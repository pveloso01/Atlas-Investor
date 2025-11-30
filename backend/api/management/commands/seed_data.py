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
    help = "Seed initial data (regions and sample properties) for testing"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before seeding",
        )

    @transaction.atomic
    def handle(self, *args, **options) -> None:  # type: ignore[override]
        clear = options["clear"]

        if clear:
            self.stdout.write(self.style.WARNING("Clearing existing data..."))  # type: ignore[attr-defined]
            Property.objects.all().delete()  # type: ignore[attr-defined]
            Region.objects.all().delete()  # type: ignore[attr-defined]
            self.stdout.write(self.style.SUCCESS("Existing data cleared."))  # type: ignore[attr-defined]

        # Create regions
        self.stdout.write("Creating regions...")
        regions_data = [
            {
                "name": "Lisbon",
                "code": "LIS",
                "avg_price_per_sqm": 3500.00,
                "avg_rent": 1200.00,
                "avg_yield": 4.10,
            },
            {
                "name": "Porto",
                "code": "OPO",
                "avg_price_per_sqm": 2500.00,
                "avg_rent": 800.00,
                "avg_yield": 3.84,
            },
            {
                "name": "Cascais",
                "code": "CAS",
                "avg_price_per_sqm": 4200.00,
                "avg_rent": 1500.00,
                "avg_yield": 4.29,
            },
        ]

        regions = {}
        for region_data in regions_data:
            region, created = Region.objects.get_or_create(  # type: ignore[attr-defined]
                code=region_data["code"], defaults=region_data
            )
            regions[region_data["code"]] = region
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"  ✓ Created region: {region.name}")  # type: ignore[attr-defined]
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"  - Region already exists: {region.name}")  # type: ignore[attr-defined]
                )

        # Create sample properties (10-20 realistic properties from Lisbon and Porto)
        self.stdout.write("\nCreating sample properties...")

        # Helper function to generate property data with new fields
        def create_property_data(
            external_id,
            address,
            coordinates,
            description,
            price,
            size_sqm,
            property_type,
            bedrooms,
            bathrooms,
            region_code,
            year_built=None,
            condition=None,
            floor_number=None,
            total_floors=None,
            has_elevator=None,
            parking_spaces=0,
            has_balcony=False,
            has_terrace=False,
            energy_rating=None,
            listing_status="active",
            source_url="",
        ):
            """Create property data dictionary with all fields."""
            data = {
                "external_id": external_id,
                "address": address,
                "coordinates": coordinates,
                "description": description,
                "price": price,
                "size_sqm": size_sqm,
                "property_type": property_type,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "parking_spaces": parking_spaces,
                "has_balcony": has_balcony,
                "has_terrace": has_terrace,
                "listing_status": listing_status,
                "source_url": source_url
                or f"https://example.com/listings/{external_id.lower()}",
                "images": [
                    f"https://example.com/images/{external_id.lower()}-1.jpg",
                    f"https://example.com/images/{external_id.lower()}-2.jpg",
                ],
                "region_code": region_code,
                "raw_data": {"source": "manual"},
            }

            # Add optional fields if provided
            if year_built is not None:
                data["year_built"] = year_built
            if condition is not None:
                data["condition"] = condition
            if floor_number is not None:
                data["floor_number"] = floor_number
            if total_floors is not None:
                data["total_floors"] = total_floors
            if has_elevator is not None:
                data["has_elevator"] = has_elevator
            if energy_rating is not None:
                data["energy_rating"] = energy_rating

            return data

        properties_data = [
            # Lisbon Properties
            create_property_data(
                "LIS-001",
                "Rua Augusta 123, 1100-053 Lisboa",
                [-9.1393, 38.7223],
                "Beautiful apartment in the heart of Lisbon",
                350000.00,
                85.0,
                "apartment",
                2,
                1.0,
                "LIS",
                year_built=2010,
                condition="good",
                floor_number=3,
                total_floors=5,
                has_elevator=True,
                has_balcony=True,
                energy_rating="C",
            ),
            create_property_data(
                "LIS-002",
                "Avenida da Liberdade 245, 1250-096 Lisboa",
                [-9.1450, 38.7165],
                "Elegant apartment on Lisbon's main boulevard",
                485000.00,
                95.0,
                "apartment",
                2,
                2.0,
                "LIS",
                year_built=2015,
                condition="excellent",
                floor_number=4,
                total_floors=6,
                has_elevator=True,
                has_balcony=True,
                energy_rating="B",
            ),
            create_property_data(
                "LIS-003",
                "Rua do Comércio 78, 1100-148 Lisboa",
                [-9.1378, 38.7086],
                "Renovated apartment in historic Baixa district",
                420000.00,
                88.0,
                "apartment",
                2,
                1.5,
                "LIS",
                year_built=2008,
                condition="good",
                floor_number=2,
                total_floors=4,
                has_elevator=True,
                has_balcony=True,
                energy_rating="D",
            ),
            create_property_data(
                "LIS-004",
                "Rua da Prata 156, 1100-420 Lisboa",
                [-9.1385, 38.7102],
                "Compact studio in central Lisbon",
                380000.00,
                75.0,
                "apartment",
                1,
                1.0,
                "LIS",
                year_built=2012,
                condition="excellent",
                floor_number=1,
                total_floors=3,
                has_elevator=False,
                has_balcony=False,
                energy_rating="C",
            ),
            create_property_data(
                "LIS-005",
                "Rua de São Bento 234, 1200-821 Lisboa",
                [-9.1502, 38.7145],
                "Spacious 3-bedroom apartment in Lapa",
                550000.00,
                120.0,
                "apartment",
                3,
                2.0,
                "LIS",
                year_built=2018,
                condition="excellent",
                floor_number=4,
                total_floors=6,
                has_elevator=True,
                parking_spaces=1,
                has_balcony=True,
                energy_rating="B",
            ),
            create_property_data(
                "LIS-006",
                "Rua do Alecrim 89, 1200-014 Lisboa",
                [-9.1431, 38.7123],
                "Charming 1-bedroom in Chiado area",
                320000.00,
                70.0,
                "apartment",
                1,
                1.0,
                "LIS",
                year_built=1995,
                condition="fair",
                floor_number=2,
                total_floors=4,
                has_elevator=False,
                has_balcony=True,
                energy_rating="E",
            ),
            create_property_data(
                "LIS-007",
                "Avenida Almirante Reis 312, 1150-018 Lisboa",
                [-9.1305, 38.7208],
                "Affordable 2-bedroom in Arroios",
                295000.00,
                82.0,
                "apartment",
                2,
                1.0,
                "LIS",
                year_built=2005,
                condition="good",
                floor_number=3,
                total_floors=5,
                has_elevator=True,
                has_balcony=False,
                energy_rating="D",
            ),
            create_property_data(
                "LIS-008",
                "Rua de São Paulo 145, 1200-427 Lisboa",
                [-9.1478, 38.7089],
                "Renovated townhouse in Cais do Sodré",
                680000.00,
                150.0,
                "house",
                4,
                3.0,
                "LIS",
                year_built=2010,
                condition="excellent",
                parking_spaces=2,
                has_terrace=True,
                energy_rating="B",
            ),
            create_property_data(
                "LIS-009",
                "Rua da Escola Politécnica 67, 1250-096 Lisboa",
                [-9.1523, 38.7178],
                "Modern apartment in Príncipe Real",
                520000.00,
                110.0,
                "apartment",
                3,
                2.0,
                "LIS",
                year_built=2020,
                condition="excellent",
                floor_number=5,
                total_floors=7,
                has_elevator=True,
                parking_spaces=1,
                has_balcony=True,
                energy_rating="A",
            ),
            create_property_data(
                "LIS-010",
                "Rua do Salitre 201, 1250-199 Lisboa",
                [-9.1498, 38.7192],
                "Bright apartment with balcony in Bairro Alto",
                410000.00,
                90.0,
                "apartment",
                2,
                1.5,
                "LIS",
                year_built=2015,
                condition="good",
                floor_number=3,
                total_floors=5,
                has_elevator=True,
                has_balcony=True,
                energy_rating="C",
            ),
            # Porto Properties
            create_property_data(
                "OPO-001",
                "Avenida da Boavista 456, 4050-115 Porto",
                [-8.6291, 41.1579],
                "Spacious apartment in Porto with great views",
                280000.00,
                110.0,
                "apartment",
                3,
                2.0,
                "OPO",
                year_built=2012,
                condition="good",
                floor_number=4,
                total_floors=6,
                has_elevator=True,
                parking_spaces=1,
                has_balcony=True,
                energy_rating="C",
            ),
            create_property_data(
                "OPO-002",
                "Rua de Cedofeita 234, 4050-180 Porto",
                [-8.6253, 41.1502],
                "Renovated apartment in trendy Cedofeita",
                245000.00,
                95.0,
                "apartment",
                2,
                1.5,
                "OPO",
                year_built=2008,
                condition="good",
                floor_number=2,
                total_floors=4,
                has_elevator=False,
                has_balcony=True,
                energy_rating="D",
            ),
            create_property_data(
                "OPO-003",
                "Rua das Flores 89, 4050-262 Porto",
                [-8.6145, 41.1423],
                "Historic building apartment in city center",
                320000.00,
                105.0,
                "apartment",
                3,
                2.0,
                "OPO",
                year_built=1920,
                condition="needs_renovation",
                floor_number=1,
                total_floors=3,
                has_elevator=False,
                has_balcony=False,
                energy_rating="F",
            ),
            create_property_data(
                "OPO-004",
                "Rua de Santa Catarina 156, 4000-450 Porto",
                [-8.6089, 41.1498],
                "Compact studio on main shopping street",
                195000.00,
                65.0,
                "apartment",
                1,
                1.0,
                "OPO",
                year_built=2010,
                condition="good",
                floor_number=2,
                total_floors=4,
                has_elevator=True,
                has_balcony=False,
                energy_rating="C",
            ),
            create_property_data(
                "OPO-005",
                "Rua do Almada 278, 4050-030 Porto",
                [-8.6201, 41.1456],
                "Modern 2-bedroom in central Porto",
                265000.00,
                88.0,
                "apartment",
                2,
                1.0,
                "OPO",
                year_built=2018,
                condition="excellent",
                floor_number=3,
                total_floors=5,
                has_elevator=True,
                has_balcony=True,
                energy_rating="B",
            ),
            create_property_data(
                "OPO-006",
                "Rua de Camões 123, 4000-139 Porto",
                [-8.6112, 41.1478],
                "Luxury apartment with river views",
                350000.00,
                125.0,
                "apartment",
                3,
                2.5,
                "OPO",
                year_built=2021,
                condition="excellent",
                floor_number=6,
                total_floors=8,
                has_elevator=True,
                parking_spaces=2,
                has_balcony=True,
                has_terrace=True,
                energy_rating="A",
            ),
            create_property_data(
                "OPO-007",
                "Rua de Sá da Bandeira 345, 4000-427 Porto",
                [-8.6056, 41.1512],
                "Affordable 2-bedroom near train station",
                220000.00,
                78.0,
                "apartment",
                2,
                1.0,
                "OPO",
                year_built=2000,
                condition="fair",
                floor_number=1,
                total_floors=3,
                has_elevator=False,
                has_balcony=False,
                energy_rating="E",
            ),
            create_property_data(
                "OPO-008",
                "Rua de Miguel Bombarda 567, 4050-381 Porto",
                [-8.6189, 41.1523],
                "Spacious apartment in arts district",
                310000.00,
                115.0,
                "apartment",
                3,
                2.0,
                "OPO",
                year_built=2015,
                condition="good",
                floor_number=2,
                total_floors=4,
                has_elevator=True,
                parking_spaces=1,
                has_balcony=True,
                energy_rating="C",
            ),
            # Cascais Properties
            create_property_data(
                "CAS-001",
                "Rua da Praia, 2750-310 Cascais",
                [-9.4215, 38.6979],
                "Luxury apartment near the beach in Cascais",
                450000.00,
                95.0,
                "apartment",
                2,
                2.0,
                "CAS",
                year_built=2019,
                condition="excellent",
                floor_number=3,
                total_floors=5,
                has_elevator=True,
                parking_spaces=1,
                has_balcony=True,
                has_terrace=True,
                energy_rating="A",
            ),
            create_property_data(
                "CAS-002",
                "Avenida Dom Carlos I 234, 2750-310 Cascais",
                [-9.4189, 38.6998],
                "Beachfront apartment with sea views",
                520000.00,
                110.0,
                "apartment",
                3,
                2.0,
                "CAS",
                year_built=2020,
                condition="excellent",
                floor_number=4,
                total_floors=6,
                has_elevator=True,
                parking_spaces=2,
                has_balcony=True,
                has_terrace=True,
                energy_rating="A+",
            ),
        ]

        for prop_data in properties_data:
            region_code = prop_data.pop("region_code")
            region = regions.get(region_code)

            # Handle coordinates - always store as [longitude, latitude] list in JSONField
            # The Property model uses JSONField for coordinates, not PostGIS PointField
            coordinates = prop_data.pop("coordinates")
            # Ensure coordinates are stored as [longitude, latitude] list
            if isinstance(coordinates, (list, tuple)) and len(coordinates) >= 2:
                prop_data["coordinates"] = [
                    float(coordinates[0]),
                    float(coordinates[1]),
                ]
            else:
                prop_data["coordinates"] = None

            property_obj, created = Property.objects.get_or_create(  # type: ignore[attr-defined]
                external_id=prop_data["external_id"],
                defaults={
                    **prop_data,
                    "region": region,
                },
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(  # type: ignore[attr-defined]
                        f"  ✓ Created property: {property_obj.address} - €{property_obj.price:,.0f}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(  # type: ignore[attr-defined]
                        f"  - Property already exists: {property_obj.address}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(  # type: ignore[attr-defined]
                f"\n✓ Seed data created successfully!\n"
                f"  - {Region.objects.count()} regions\n"  # type: ignore[attr-defined]
                f"  - {Property.objects.count()} properties"  # type: ignore[attr-defined]
            )
        )
