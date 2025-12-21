#!/usr/bin/env python3
"""
Extract complete Portugal geographic hierarchy from PDF
Based on Territorial Organization of Portugal.pdf
"""

import re
import json
from pathlib import Path

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False
    print("pdfplumber not installed. Installing...")
    import subprocess
    subprocess.check_call(["pip3", "install", "pdfplumber"])
    import pdfplumber
    HAS_PDFPLUMBER = True

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

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
    # Also handle special case: "Lisboa (Lisbon city) – parish1; parish2; ..."
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

def extract_all_districts(text):
    """Extract all districts and their data"""
    districts_data = {}
    
    # List of all 18 districts
    district_names = [
        'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
        'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
        'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu'
    ]
    
    for district in district_names:
        print(f"Extracting {district}...")
        municipalities = parse_district_section(text, district)
        if municipalities:
            districts_data[district] = municipalities
            print(f"  Found {len(municipalities)} municipalities")
    
    return districts_data

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
        print("Extracting Açores...")
        azores_section = azores_match.group(0)
        municipalities = parse_region_section(azores_section)
        if municipalities:
            regions_data['Açores'] = municipalities
            print(f"  Found {len(municipalities)} municipalities")
    
    # Extract Madeira section
    madeira_pattern = r"Madeira.*?–\s*\d+\s+municipalities.*?(?=##|NUTS|\Z)"
    madeira_match = re.search(madeira_pattern, section, re.DOTALL | re.IGNORECASE)
    if madeira_match:
        print("Extracting Madeira...")
        madeira_section = madeira_match.group(0)
        municipalities = parse_region_section(madeira_section)
        if municipalities:
            regions_data['Madeira'] = municipalities
            print(f"  Found {len(municipalities)} municipalities")
    
    return regions_data

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

def generate_typescript(districts_data, regions_data, output_path):
    """Generate TypeScript file with complete hierarchy"""
    
    # District codes
    district_codes = {
        'Aveiro': '01', 'Beja': '02', 'Braga': '03', 'Bragança': '04',
        'Castelo Branco': '05', 'Coimbra': '06', 'Évora': '07', 'Faro': '08',
        'Guarda': '09', 'Leiria': '10', 'Lisboa': '11', 'Portalegre': '12',
        'Porto': '13', 'Santarém': '14', 'Setúbal': '15', 'Viana do Castelo': '16',
        'Vila Real': '17', 'Viseu': '18'
    }
    
    ts_content = '''/**
 * Portugal Geographic Hierarchy
 * Based on Territorial Organization of Portugal
 * 18 Districts + 2 Autonomous Regions
 * 308 Municipalities (concelhos)
 * 3,091 Civil Parishes (freguesias)
 * 
 * Generated from: docs/Territorial Organization of Portugal.pdf
 */

export type GeographicType = 'district' | 'municipality' | 'parish' | 'autonomous_region';

export interface GeographicLocation {
  id: string;
  name: string;
  type: GeographicType;
  parentId?: string;
  code?: string;
  fullPath: string;
  children?: GeographicLocation[];
}

// Helper function to build full path
const buildPath = (parts: string[]): string => parts.join(' > ');

// Helper function to create location
const createLocation = (
  id: string,
  name: string,
  type: GeographicType,
  parentPath: string[] = [],
  code?: string
): GeographicLocation => ({
  id,
  name,
  type,
  code,
  fullPath: buildPath([...parentPath, name]),
});

// Districts (18 on mainland)
export const districts: GeographicLocation[] = [
'''
    
    # Add districts
    for i, (district, code) in enumerate(sorted(district_codes.items(), key=lambda x: x[1]), 1):
        ts_content += f"  createLocation('dist-{code}', '{district}', 'district', [], '{code}'),\n"
    
    ts_content += '''];

// Autonomous Regions
export const autonomousRegions: GeographicLocation[] = [
  createLocation('ar-01', 'Açores', 'autonomous_region', [], 'AR01'),
  createLocation('ar-02', 'Madeira', 'autonomous_region', [], 'AR02'),
];

'''
    
    # Generate autonomous regions municipalities
    for region_name in ['Açores', 'Madeira']:
        if region_name in regions_data:
            region_var = region_name.lower().replace('ç', 'c').replace(' ', '')
            ts_content += f"// {region_name} Autonomous Region\n"
            ts_content += f"const {region_var}Municipalities: GeographicLocation[] = [\n"
            
            for mun_idx, municipality in enumerate(regions_data[region_name], 1):
                mun_id = f"mun-{region_var}-{mun_idx:02d}"
                mun_name = municipality['name']
                ts_content += f"  {{\n"
                ts_content += f"    ...createLocation('{mun_id}', '{mun_name}', 'municipality', ['{region_name}']),\n"
                ts_content += f"    children: [\n"
                
                for par_idx, parish in enumerate(municipality['parishes'], 1):
                    par_id = f"par-{region_var}-{mun_idx:02d}-{par_idx:02d}"
                    parish_escaped = parish.replace("'", "\\'")
                    ts_content += f"      createLocation('{par_id}', '{parish_escaped}', 'parish', ['{region_name}', '{mun_name}']),\n"
                
                ts_content += f"    ],\n"
                ts_content += f"  }},\n"
            
            ts_content += f"];\n\n"
    
    # Generate municipalities and parishes for each district
    for district_name, code in sorted(district_codes.items(), key=lambda x: x[1]):
        district_id = f"dist-{code}"
        district_var = district_name.lower().replace(' ', '').replace('é', 'e').replace('ç', 'c')
        ts_content += f"// {district_name} District\n"
        ts_content += f"const {district_var}Municipalities: GeographicLocation[] = [\n"
        
        if district_name in districts_data:
            for mun_idx, municipality in enumerate(districts_data[district_name], 1):
                mun_id = f"mun-{district_var}-{mun_idx:02d}"
                mun_name = municipality['name']
                ts_content += f"  {{\n"
                ts_content += f"    ...createLocation('{mun_id}', '{mun_name}', 'municipality', ['{district_name}']),\n"
                ts_content += f"    children: [\n"
                
                for par_idx, parish in enumerate(municipality['parishes'], 1):
                    par_id = f"par-{district_var}-{mun_idx:02d}-{par_idx:02d}"
                    # Escape single quotes in parish names
                    parish_escaped = parish.replace("'", "\\'")
                    ts_content += f"      createLocation('{par_id}', '{parish_escaped}', 'parish', ['{district_name}', '{mun_name}']),\n"
                
                ts_content += f"    ],\n"
                ts_content += f"  }},\n"
        
        ts_content += f"];\n\n"
    
    # Build hierarchy function
    ts_content += '''// Build complete hierarchy
const buildCompleteHierarchy = (): GeographicLocation[] => {
  const districtMap = new Map<string, GeographicLocation>();
  
  // Add districts
  districts.forEach(district => {
    districtMap.set(district.id, { ...district, children: [] });
  });
  
'''
    
    # Add assignments for each district
    for district_name, code in sorted(district_codes.items(), key=lambda x: x[1]):
        district_id = f"dist-{code}"
        district_var = district_name.lower().replace(' ', '').replace('é', 'e').replace('ç', 'c')
        ts_content += f"  // Add {district_name} municipalities\n"
        ts_content += f"  const {district_var}District = districtMap.get('{district_id}');\n"
        ts_content += f"  if ({district_var}District) {{\n"
        ts_content += f"    {district_var}District.children = {district_var}Municipalities;\n"
        ts_content += f"  }}\n\n"
    
    # Generate autonomous regions
    ts_content += "  // Add autonomous regions\n"
    for region_name in ['Açores', 'Madeira']:
        if region_name in regions_data:
            region_var = region_name.lower().replace('ç', 'c').replace(' ', '')
            region_id = 'ar-01' if region_name == 'Açores' else 'ar-02'
            ts_content += f"  const {region_var}Region = autonomousRegions.find(r => r.id === '{region_id}');\n"
            ts_content += f"  if ({region_var}Region) {{\n"
            ts_content += f"    {region_var}Region.children = {region_var}Municipalities;\n"
            ts_content += f"  }}\n\n"
    
    ts_content += '''  return Array.from(districtMap.values());
};

// Flatten all locations for search
export const flattenLocations = (locations: GeographicLocation[]): GeographicLocation[] => {
  const result: GeographicLocation[] = [];
  
  const traverse = (loc: GeographicLocation) => {
    result.push(loc);
    if (loc.children) {
      loc.children.forEach(traverse);
    }
  };
  
  locations.forEach(traverse);
  return result;
};

// Get all locations (districts + autonomous regions)
export const allTopLevelLocations: GeographicLocation[] = [
  ...buildCompleteHierarchy(),
  ...autonomousRegions,
];

// Get all locations flattened for search
export const allLocationsFlat: GeographicLocation[] = flattenLocations(allTopLevelLocations);

// Helper functions
export const getLocationById = (id: string): GeographicLocation | undefined => {
  return allLocationsFlat.find(loc => loc.id === id);
};

export const getLocationsByType = (type: GeographicType): GeographicLocation[] => {
  return allLocationsFlat.filter(loc => loc.type === type);
};

export const getChildren = (parentId: string): GeographicLocation[] => {
  const parent = getLocationById(parentId);
  return parent?.children || [];
};

export const searchLocations = (query: string): GeographicLocation[] => {
  const lowerQuery = query.toLowerCase();
  return allLocationsFlat.filter(loc => 
    loc.name.toLowerCase().includes(lowerQuery) ||
    loc.fullPath.toLowerCase().includes(lowerQuery)
  );
};
'''
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"\nGenerated TypeScript file: {output_path}")

def main():
    pdf_path = Path("docs/Territorial Organization of Portugal.pdf")
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    print(f"Extracting text from PDF: {pdf_path}")
    text = extract_text_from_pdf(pdf_path)
    
    print(f"Extracted {len(text)} characters")
    print("\nParsing districts...")
    
    districts_data = extract_all_districts(text)
    
    print(f"\nExtracted {len(districts_data)} districts")
    total_municipalities = sum(len(muns) for muns in districts_data.values())
    total_parishes = sum(
        sum(len(mun['parishes']) for mun in muns)
        for muns in districts_data.values()
    )
    print(f"Total municipalities: {total_municipalities}")
    print(f"Total parishes: {total_parishes}")
    
    print("\nExtracting autonomous regions...")
    regions_data = extract_autonomous_regions(text)
    print(f"Extracted {len(regions_data)} autonomous regions")
    
    output_path = Path("frontend/data/portugal-geography.ts")
    print(f"\nGenerating TypeScript file: {output_path}")
    generate_typescript(districts_data, regions_data, output_path)
    
    print("\nDone!")

if __name__ == "__main__":
    main()

