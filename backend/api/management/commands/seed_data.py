"""
Management command to seed initial data for testing.

Usage:
    python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Region, Property

# Try to import PostGIS Point, fallback if not available
try:
    from django.contrib.gis.geos import Point
    HAS_POSTGIS = True
except (ImportError, Exception):
    HAS_POSTGIS = False
    Point = None


class Command(BaseCommand):
    help = 'Seed initial data (regions and sample properties) for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    @transaction.atomic
    def handle(self, *args, **options) -> None:  # type: ignore[override]
        clear = options['clear']

        if clear:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))  # type: ignore[attr-defined]
            Property.objects.all().delete()  # type: ignore[attr-defined]
            Region.objects.all().delete()  # type: ignore[attr-defined]
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))  # type: ignore[attr-defined]

        # Create regions
        self.stdout.write('Creating regions...')
        regions_data = [
            {
                'name': 'Lisbon',
                'code': 'LIS',
                'avg_price_per_sqm': 3500.00,
                'avg_rent': 1200.00,
                'avg_yield': 4.10,
            },
            {
                'name': 'Porto',
                'code': 'OPO',
                'avg_price_per_sqm': 2500.00,
                'avg_rent': 800.00,
                'avg_yield': 3.84,
            },
            {
                'name': 'Cascais',
                'code': 'CAS',
                'avg_price_per_sqm': 4200.00,
                'avg_rent': 1500.00,
                'avg_yield': 4.29,
            },
        ]

        regions = {}
        for region_data in regions_data:
            region, created = Region.objects.get_or_create(  # type: ignore[attr-defined]
                code=region_data['code'],
                defaults=region_data
            )
            regions[region_data['code']] = region
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Created region: {region.name}')  # type: ignore[attr-defined]
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'  - Region already exists: {region.name}')  # type: ignore[attr-defined]
                )

        # Create sample properties (10-20 realistic properties from Lisbon and Porto)
        self.stdout.write('\nCreating sample properties...')
        
        properties_data = [
            # Lisbon Properties
            {
                'external_id': 'LIS-001',
                'address': 'Rua Augusta 123, 1100-053 Lisboa',
                'coordinates': [-9.1393, 38.7223],
                'price': 350000.00,
                'size_sqm': 85.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Beautiful apartment in the heart of Lisbon'},
            },
            {
                'external_id': 'LIS-002',
                'address': 'Avenida da Liberdade 245, 1250-096 Lisboa',
                'coordinates': [-9.1450, 38.7165],
                'price': 485000.00,
                'size_sqm': 95.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 2.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Elegant apartment on Lisbon\'s main boulevard'},
            },
            {
                'external_id': 'LIS-003',
                'address': 'Rua do Comércio 78, 1100-148 Lisboa',
                'coordinates': [-9.1378, 38.7086],
                'price': 420000.00,
                'size_sqm': 88.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.5,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Renovated apartment in historic Baixa district'},
            },
            {
                'external_id': 'LIS-004',
                'address': 'Rua da Prata 156, 1100-420 Lisboa',
                'coordinates': [-9.1385, 38.7102],
                'price': 380000.00,
                'size_sqm': 75.0,
                'property_type': 'apartment',
                'bedrooms': 1,
                'bathrooms': 1.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Compact studio in central Lisbon'},
            },
            {
                'external_id': 'LIS-005',
                'address': 'Rua de São Bento 234, 1200-821 Lisboa',
                'coordinates': [-9.1502, 38.7145],
                'price': 550000.00,
                'size_sqm': 120.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Spacious 3-bedroom apartment in Lapa'},
            },
            {
                'external_id': 'LIS-006',
                'address': 'Rua do Alecrim 89, 1200-014 Lisboa',
                'coordinates': [-9.1431, 38.7123],
                'price': 320000.00,
                'size_sqm': 70.0,
                'property_type': 'apartment',
                'bedrooms': 1,
                'bathrooms': 1.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Charming 1-bedroom in Chiado area'},
            },
            {
                'external_id': 'LIS-007',
                'address': 'Avenida Almirante Reis 312, 1150-018 Lisboa',
                'coordinates': [-9.1305, 38.7208],
                'price': 295000.00,
                'size_sqm': 82.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Affordable 2-bedroom in Arroios'},
            },
            {
                'external_id': 'LIS-008',
                'address': 'Rua de São Paulo 145, 1200-427 Lisboa',
                'coordinates': [-9.1478, 38.7089],
                'price': 680000.00,
                'size_sqm': 150.0,
                'property_type': 'house',
                'bedrooms': 4,
                'bathrooms': 3.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Renovated townhouse in Cais do Sodré'},
            },
            {
                'external_id': 'LIS-009',
                'address': 'Rua da Escola Politécnica 67, 1250-096 Lisboa',
                'coordinates': [-9.1523, 38.7178],
                'price': 520000.00,
                'size_sqm': 110.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Modern apartment in Príncipe Real'},
            },
            {
                'external_id': 'LIS-010',
                'address': 'Rua do Salitre 201, 1250-199 Lisboa',
                'coordinates': [-9.1498, 38.7192],
                'price': 410000.00,
                'size_sqm': 90.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.5,
                'region_code': 'LIS',
                'raw_data': {'source': 'manual', 'description': 'Bright apartment with balcony in Bairro Alto'},
            },
            # Porto Properties
            {
                'external_id': 'OPO-001',
                'address': 'Avenida da Boavista 456, 4050-115 Porto',
                'coordinates': [-8.6291, 41.1579],
                'price': 280000.00,
                'size_sqm': 110.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Spacious apartment in Porto with great views'},
            },
            {
                'external_id': 'OPO-002',
                'address': 'Rua de Cedofeita 234, 4050-180 Porto',
                'coordinates': [-8.6253, 41.1502],
                'price': 245000.00,
                'size_sqm': 95.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.5,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Renovated apartment in trendy Cedofeita'},
            },
            {
                'external_id': 'OPO-003',
                'address': 'Rua das Flores 89, 4050-262 Porto',
                'coordinates': [-8.6145, 41.1423],
                'price': 320000.00,
                'size_sqm': 105.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Historic building apartment in city center'},
            },
            {
                'external_id': 'OPO-004',
                'address': 'Rua de Santa Catarina 156, 4000-450 Porto',
                'coordinates': [-8.6089, 41.1498],
                'price': 195000.00,
                'size_sqm': 65.0,
                'property_type': 'apartment',
                'bedrooms': 1,
                'bathrooms': 1.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Compact studio on main shopping street'},
            },
            {
                'external_id': 'OPO-005',
                'address': 'Rua do Almada 278, 4050-030 Porto',
                'coordinates': [-8.6201, 41.1456],
                'price': 265000.00,
                'size_sqm': 88.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Modern 2-bedroom in central Porto'},
            },
            {
                'external_id': 'OPO-006',
                'address': 'Rua de Camões 123, 4000-139 Porto',
                'coordinates': [-8.6112, 41.1478],
                'price': 350000.00,
                'size_sqm': 125.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.5,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Luxury apartment with river views'},
            },
            {
                'external_id': 'OPO-007',
                'address': 'Rua de Sá da Bandeira 345, 4000-427 Porto',
                'coordinates': [-8.6056, 41.1512],
                'price': 220000.00,
                'size_sqm': 78.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Affordable 2-bedroom near train station'},
            },
            {
                'external_id': 'OPO-008',
                'address': 'Rua de Miguel Bombarda 567, 4050-381 Porto',
                'coordinates': [-8.6189, 41.1523],
                'price': 310000.00,
                'size_sqm': 115.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'OPO',
                'raw_data': {'source': 'manual', 'description': 'Spacious apartment in arts district'},
            },
            # Cascais Properties
            {
                'external_id': 'CAS-001',
                'address': 'Rua da Praia, 2750-310 Cascais',
                'coordinates': [-9.4215, 38.6979],
                'price': 450000.00,
                'size_sqm': 95.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 2.0,
                'region_code': 'CAS',
                'raw_data': {'source': 'manual', 'description': 'Luxury apartment near the beach in Cascais'},
            },
            {
                'external_id': 'CAS-002',
                'address': 'Avenida Dom Carlos I 234, 2750-310 Cascais',
                'coordinates': [-9.4189, 38.6998],
                'price': 520000.00,
                'size_sqm': 110.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'CAS',
                'raw_data': {'source': 'manual', 'description': 'Beachfront apartment with sea views'},
            },
        ]

        for prop_data in properties_data:
            region_code = prop_data.pop('region_code')
            region = regions.get(region_code)
            
            # Handle coordinates based on PostGIS availability
            coordinates = prop_data.pop('coordinates')
            if HAS_POSTGIS and Point:
                # Use PostGIS PointField
                prop_data['coordinates'] = Point(coordinates[0], coordinates[1], srid=4326)
            else:
                # Use JSONField (store as [longitude, latitude])
                prop_data['coordinates'] = coordinates

            property_obj, created = Property.objects.get_or_create(  # type: ignore[attr-defined]
                external_id=prop_data['external_id'],
                defaults={
                    **prop_data,
                    'region': region,
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(  # type: ignore[attr-defined]
                        f'  ✓ Created property: {property_obj.address} - €{property_obj.price:,.0f}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(  # type: ignore[attr-defined]
                        f'  - Property already exists: {property_obj.address}'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(  # type: ignore[attr-defined]
                f'\n✓ Seed data created successfully!\n'
                f'  - {Region.objects.count()} regions\n'  # type: ignore[attr-defined]
                f'  - {Property.objects.count()} properties'  # type: ignore[attr-defined]
            )
        )

