"""
Management command to load Portugal's geographic hierarchy from PDF.

Usage:
    python manage.py load_geography
    python manage.py load_geography --clear  # Clear existing data first
"""

import re
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import District, Municipality, Parish, AutonomousRegion

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False


def parse_parishes(parishes_text):
    """Parse parish names from text"""
    # Split by semicolon
    parishes = [p.strip() for p in re.split(r'[;]', parishes_text) if p.strip()]
    
    cleaned_parishes = []
    for parish in parishes:
        # Remove trailing citation numbers like "③" or "25 26" or "16 ."
        parish = re.sub(r'\s*[①②③④⑤⑥⑦⑧⑨⑩\d\s\.]+$', '', parish)
        parish = parish.strip()
        
        # Skip if it's a note in parentheses
        if parish and not parish.startswith('(') and not parish.startswith('Note:'):
            # Remove any trailing periods
            parish = parish.rstrip('.')
            if parish:
                cleaned_parishes.append(parish)
    
    return cleaned_parishes


def parse_district_section(text, district_name):
    """Parse a district section to extract municipalities and parishes"""
    # Find the district section - look for "District Name District" pattern
    # Also handle "Lisboa (Lisbon city)" format
    if district_name == 'Lisboa':
        pattern = r"Lisboa.*?District.*?(?=\n\w+\s+District|\n##|\Z)"
    else:
        pattern = rf"{re.escape(district_name)}\s+District.*?(?=\n\w+\s+District|\n##|\Z)"
    
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    if not match:
        return []
    
    section = match.group(0)
    municipalities = []
    
    # Pattern to match municipality lines: "• Municipality Name – parish1; parish2; ..."
    lines = section.split('\n')
    current_mun = None
    current_parishes_text = ""
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Special handling for Lisboa city (not a bullet point)
        if district_name == 'Lisboa' and 'Lisboa (Lisbon city)' in line and '–' in line:
            # Extract Lisboa city as a municipality
            lisboa_match = re.match(r'Lisboa\s*\([^)]+\)\s*[–—]\s*(.+)$', line)
            if lisboa_match:
                if current_mun:
                    parishes = parse_parishes(current_parishes_text)
                    if parishes:
                        municipalities.append({
                            'name': current_mun,
                            'parishes': parishes
                        })
                current_mun = 'Lisboa'
                current_parishes_text = lisboa_match.group(1).strip()
            continue
            
        # Check if this is a municipality line (starts with bullet and has dash)
        mun_match = re.match(r'^[•·]\s*(.+?)\s*[–—]\s*(.+)$', line)
        if mun_match:
            # Save previous municipality if exists
            if current_mun:
                parishes = parse_parishes(current_parishes_text)
                if parishes:
                    municipalities.append({
                        'name': current_mun,
                        'parishes': parishes
                    })
            
            # Start new municipality
            current_mun = mun_match.group(1).strip()
            current_parishes_text = mun_match.group(2).strip()
        elif current_mun and line and not line.startswith('(') and not line.startswith('Note:'):
            # Continuation of parishes list (but not notes)
            current_parishes_text += " " + line
    
    # Don't forget the last municipality
    if current_mun:
        parishes = parse_parishes(current_parishes_text)
        if parishes:
            municipalities.append({
                'name': current_mun,
                'parishes': parishes
            })
    
    return municipalities


def parse_region_section(section):
    """Parse a region section (similar to district section)"""
    municipalities = []
    lines = section.split('\n')
    current_mun = None
    current_parishes_text = ""
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if this is a municipality line (starts with bullet and has dash)
        mun_match = re.match(r'^[•·]\s*(.+?)\s*[–—]\s*(.+)$', line)
        if mun_match:
            # Save previous municipality if exists
            if current_mun:
                parishes = parse_parishes(current_parishes_text)
                if parishes:
                    municipalities.append({
                        'name': current_mun,
                        'parishes': parishes
                    })
            
            # Start new municipality
            current_mun = mun_match.group(1).strip()
            # Remove parenthetical notes like "(Terceira Island)"
            current_mun = re.sub(r'\s*\([^)]+\)\s*$', '', current_mun).strip()
            current_parishes_text = mun_match.group(2).strip()
        elif current_mun and line and not line.startswith('(') and not line.startswith('Note:'):
            # Continuation of parishes list
            current_parishes_text += " " + line
    
    # Don't forget the last municipality
    if current_mun:
        parishes = parse_parishes(current_parishes_text)
        if parishes:
            municipalities.append({
                'name': current_mun,
                'parishes': parishes
            })
    
    return municipalities


def extract_autonomous_regions(text):
    """Extract autonomous regions (Azores and Madeira)"""
    regions_data = {}
    
    # Find the "Autonomous Regions" section
    auto_regions_pattern = r"Autonomous Regions.*?(?=##|NUTS|Statistical|\Z)"
    auto_regions_match = re.search(auto_regions_pattern, text, re.DOTALL | re.IGNORECASE)
    if not auto_regions_match:
        return regions_data
    
    section = auto_regions_match.group(0)
    
    # Extract Azores section - look for "Azores (Região Autónoma dos Açores)"
    azores_pattern = r"Azores.*?–\s*\d+\s+municipalities.*?(?=Madeira|##|\Z)"
    azores_match = re.search(azores_pattern, section, re.DOTALL | re.IGNORECASE)
    if azores_match:
        azores_section = azores_match.group(0)
        municipalities = parse_region_section(azores_section)
        if municipalities:
            regions_data['Açores'] = municipalities
    
    # Extract Madeira section
    madeira_pattern = r"Madeira.*?–\s*\d+\s+municipalities.*?(?=##|NUTS|\Z)"
    madeira_match = re.search(madeira_pattern, section, re.DOTALL | re.IGNORECASE)
    if madeira_match:
        madeira_section = madeira_match.group(0)
        municipalities = parse_region_section(madeira_section)
        if municipalities:
            regions_data['Madeira'] = municipalities
    
    return regions_data


class Command(BaseCommand):
    help = "Load Portugal's geographic hierarchy from PDF"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing geographic data before loading",
        )
        parser.add_argument(
            "--pdf-path",
            type=str,
            default="docs/Territorial Organization of Portugal.pdf",
            help="Path to the PDF file",
        )

    def handle(self, *args, **options):
        if not HAS_PDFPLUMBER:
            self.stdout.write(
                self.style.ERROR("pdfplumber is required. Install it with: pip install pdfplumber")
            )
            return

        clear = options["clear"]
        pdf_path = Path(options["pdf_path"])

        if not pdf_path.exists():
            # Try relative to project root
            pdf_path = Path(__file__).parent.parent.parent.parent.parent / pdf_path
            if not pdf_path.exists():
                self.stdout.write(
                    self.style.ERROR(f"PDF file not found at: {options['pdf_path']}")
                )
                return

        if clear:
            self.stdout.write(self.style.WARNING("Clearing existing geographic data..."))
            Parish.objects.all().delete()
            Municipality.objects.all().delete()
            District.objects.all().delete()
            AutonomousRegion.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        # Extract text from PDF
        self.stdout.write(f"Extracting text from PDF: {pdf_path}")
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        
        self.stdout.write(f"Extracted {len(text)} characters")

        # District codes mapping
        district_codes = {
            'Aveiro': '01', 'Beja': '02', 'Braga': '03', 'Bragança': '04',
            'Castelo Branco': '05', 'Coimbra': '06', 'Évora': '07', 'Faro': '08',
            'Guarda': '09', 'Leiria': '10', 'Lisboa': '11', 'Portalegre': '12',
            'Porto': '13', 'Santarém': '14', 'Setúbal': '15', 'Viana do Castelo': '16',
            'Vila Real': '17', 'Viseu': '18'
        }

        district_names = list(district_codes.keys())

        with transaction.atomic():
            # Create districts and municipalities
            self.stdout.write("\nCreating districts and municipalities...")
            districts_created = 0
            municipalities_created = 0
            parishes_created = 0

            for district_name in district_names:
                code = district_codes[district_name]
                district_code = f"dist-{code}"
                
                # Get or create district
                district, created = District.objects.get_or_create(
                    code=district_code,
                    defaults={
                        'name': district_name,
                        'full_path': district_name,
                    }
                )
                if created:
                    districts_created += 1
                
                # Parse municipalities for this district
                municipalities_data = parse_district_section(text, district_name)
                self.stdout.write(f"  {district_name}: {len(municipalities_data)} municipalities")
                
                for mun_idx, mun_data in enumerate(municipalities_data, 1):
                    mun_code = f"mun-{district_name.lower().replace(' ', '').replace('é', 'e').replace('ç', 'c')}-{mun_idx:02d}"
                    mun_name = mun_data['name']
                    mun_full_path = f"{district_name} > {mun_name}"
                    
                    # Get or create municipality
                    municipality, created = Municipality.objects.get_or_create(
                        code=mun_code,
                        defaults={
                            'name': mun_name,
                            'district': district,
                            'full_path': mun_full_path,
                        }
                    )
                    if created:
                        municipalities_created += 1
                    
                    # Create parishes
                    for par_idx, parish_name in enumerate(mun_data['parishes'], 1):
                        par_code = f"par-{district_name.lower().replace(' ', '').replace('é', 'e').replace('ç', 'c')}-{mun_idx:02d}-{par_idx:02d}"
                        par_full_path = f"{district_name} > {mun_name} > {parish_name}"
                        
                        Parish.objects.get_or_create(
                            code=par_code,
                            defaults={
                                'name': parish_name,
                                'municipality': municipality,
                                'full_path': par_full_path,
                            }
                        )
                        parishes_created += 1

            # Create autonomous regions
            self.stdout.write("\nCreating autonomous regions...")
            regions_data = extract_autonomous_regions(text)
            
            for region_name in ['Açores', 'Madeira']:
                if region_name not in regions_data:
                    continue
                
                region_code = 'AR01' if region_name == 'Açores' else 'AR02'
                ar_code = f"ar-{region_code.lower()}"
                
                # Get or create autonomous region
                autonomous_region, created = AutonomousRegion.objects.get_or_create(
                    code=ar_code,
                    defaults={
                        'name': region_name,
                        'full_path': region_name,
                    }
                )
                if created:
                    districts_created += 1  # Count as top-level entity
                
                municipalities_data = regions_data[region_name]
                self.stdout.write(f"  {region_name}: {len(municipalities_data)} municipalities")
                
                for mun_idx, mun_data in enumerate(municipalities_data, 1):
                    region_var = region_name.lower().replace('ç', 'c').replace(' ', '')
                    mun_code = f"mun-{region_var}-{mun_idx:02d}"
                    mun_name = mun_data['name']
                    mun_full_path = f"{region_name} > {mun_name}"
                    
                    # Get or create municipality
                    municipality, created = Municipality.objects.get_or_create(
                        code=mun_code,
                        defaults={
                            'name': mun_name,
                            'autonomous_region': autonomous_region,
                            'full_path': mun_full_path,
                        }
                    )
                    if created:
                        municipalities_created += 1
                    
                    # Create parishes
                    for par_idx, parish_name in enumerate(mun_data['parishes'], 1):
                        par_code = f"par-{region_var}-{mun_idx:02d}-{par_idx:02d}"
                        par_full_path = f"{region_name} > {mun_name} > {parish_name}"
                        
                        Parish.objects.get_or_create(
                            code=par_code,
                            defaults={
                                'name': parish_name,
                                'municipality': municipality,
                                'full_path': par_full_path,
                            }
                        )
                        parishes_created += 1

        # Summary
        self.stdout.write(self.style.SUCCESS("\n" + "="*50))
        self.stdout.write(self.style.SUCCESS("Geographic data loaded successfully!"))
        self.stdout.write(self.style.SUCCESS(f"  Districts: {District.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"  Autonomous Regions: {AutonomousRegion.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"  Municipalities: {Municipality.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"  Parishes: {Parish.objects.count()}"))
        self.stdout.write(self.style.SUCCESS("="*50))

