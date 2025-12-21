"""
Management command to load Portugal's geographic hierarchy from JSON fixture.

Usage:
    python manage.py load_geography
    python manage.py load_geography --clear  # Clear existing data first
"""

import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import District, Municipality, Parish, AutonomousRegion


class Command(BaseCommand):
    help = "Load Portugal's geographic hierarchy from JSON fixture"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing geographic data before loading",
        )
        parser.add_argument(
            "--json-path",
            type=str,
            default="data/portugal_geography.json",
            help="Path to the JSON fixture file (relative to project root)",
        )

    def handle(self, *args, **options):
        clear = options["clear"]
        json_path = Path(options["json_path"])

        # Try to find JSON file - check relative to project root
        if not json_path.exists():
            # Try relative to command file location
            json_path = (
                Path(__file__).parent.parent.parent.parent.parent / json_path
            )
            if not json_path.exists():
                self.stdout.write(
                    self.style.ERROR(f"JSON file not found at: {options['json_path']}")
                )
                return

        if clear:
            self.stdout.write(self.style.WARNING("Clearing existing geographic data..."))
            Parish.objects.all().delete()
            Municipality.objects.all().delete()
            District.objects.all().delete()
            AutonomousRegion.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        # Load JSON data
        self.stdout.write(f"Loading geography data from: {json_path}")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f"Invalid JSON file: {e}")
            )
            return

        districts_data = data.get("districts", {})
        regions_data = data.get("autonomous_regions", {})
        district_codes = data.get("district_codes", {})

        if not district_codes:
            # Fallback to default codes if not in JSON
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

                # Get municipalities for this district from JSON
                municipalities_data = districts_data.get(district_name, [])
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
                    for par_idx, parish_name in enumerate(mun_data.get('parishes', []), 1):
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
                    for par_idx, parish_name in enumerate(mun_data.get('parishes', []), 1):
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
