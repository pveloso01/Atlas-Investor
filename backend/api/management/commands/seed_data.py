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

        # Create sample properties
        self.stdout.write('\nCreating sample properties...')
        
        properties_data = [
            {
                'external_id': 'PROP-001',
                'address': 'Rua Augusta 123, 1100-053 Lisboa',
                'coordinates': [-9.1393, 38.7223],  # [longitude, latitude] - Lisbon center
                'price': 350000.00,
                'size_sqm': 85.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 1.0,
                'region_code': 'LIS',
                'raw_data': {
                    'source': 'manual',
                    'description': 'Beautiful apartment in the heart of Lisbon',
                },
            },
            {
                'external_id': 'PROP-002',
                'address': 'Avenida da Boavista 456, 4050-115 Porto',
                'coordinates': [-8.6291, 41.1579],  # [longitude, latitude] - Porto center
                'price': 280000.00,
                'size_sqm': 110.0,
                'property_type': 'apartment',
                'bedrooms': 3,
                'bathrooms': 2.0,
                'region_code': 'OPO',
                'raw_data': {
                    'source': 'manual',
                    'description': 'Spacious apartment in Porto with great views',
                },
            },
            {
                'external_id': 'PROP-003',
                'address': 'Rua da Praia, 2750-310 Cascais',
                'coordinates': [-9.4215, 38.6979],  # [longitude, latitude] - Cascais
                'price': 450000.00,
                'size_sqm': 95.0,
                'property_type': 'apartment',
                'bedrooms': 2,
                'bathrooms': 2.0,
                'region_code': 'CAS',
                'raw_data': {
                    'source': 'manual',
                    'description': 'Luxury apartment near the beach in Cascais',
                },
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

