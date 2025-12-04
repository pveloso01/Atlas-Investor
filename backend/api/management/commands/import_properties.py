"""
Management command to import properties from JSON file.

Usage:
    python manage.py import_properties [options]

Examples:
    # Import sample data
    python manage.py import_properties

    # Import from custom file
    python manage.py import_properties --file /path/to/data.json

    # Dry run (don't save to database)
    python manage.py import_properties --dry-run
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from api.services.ingestion_service import PropertyIngestionService


class Command(BaseCommand):
    """Management command to import properties from JSON file."""

    help = "Import properties from a JSON file into the database"

    def add_arguments(self, parser):
        """Add command-line arguments."""
        parser.add_argument(
            "--file",
            "-f",
            type=str,
            default=None,
            help="Path to JSON file containing properties (default: data/sample_properties.json)",
        )
        parser.add_argument(
            "--dry-run",
            "-d",
            action="store_true",
            help="Validate data without saving to database",
        )
        parser.add_argument(
            "--show-details",
            action="store_true",
            help="Show detailed output",
        )

    def handle(self, *args, **options):
        """Execute the command."""
        file_path = options.get("file")
        dry_run = options.get("dry_run", False)
        verbose = options.get("show_details", False)

        # Determine file path
        if file_path:
            json_path = Path(file_path)
        else:
            # Default to sample_properties.json in data directory
            json_path = (
                Path(__file__).resolve().parent.parent.parent.parent
                / "data"
                / "sample_properties.json"
            )

        # Check if file exists
        if not json_path.exists():
            raise CommandError(f"JSON file not found: {json_path}")

        self.stdout.write(f"Importing properties from: {json_path}")

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - No data will be saved"))

        # Load and parse JSON
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            raise CommandError(f"Invalid JSON file: {e}")

        properties = data.get("properties", [])
        self.stdout.write(f"Found {len(properties)} properties in file")

        if dry_run:
            # Validate without saving
            service = PropertyIngestionService()
            errors = []

            for index, prop_data in enumerate(properties):
                try:
                    normalized = service.normalize_property_data(prop_data)
                    service.validate_property_data(normalized)

                    if verbose:
                        self.stdout.write(
                            f"  ✓ Property {index + 1}: {normalized.get('address', 'Unknown')}"
                        )
                except Exception as e:
                    errors.append(f"Property {index + 1}: {str(e)}")
                    if verbose:
                        self.stdout.write(self.style.ERROR(f"  ✗ Property {index + 1}: {str(e)}"))

            if errors:
                self.stdout.write(self.style.ERROR(f"\n{len(errors)} validation error(s):"))
                for error in errors:
                    self.stdout.write(self.style.ERROR(f"  - {error}"))
            else:
                self.stdout.write(
                    self.style.SUCCESS(f"\nAll {len(properties)} properties are valid")
                )
        else:
            # Actually import the data
            service = PropertyIngestionService()
            results = service.ingest_from_json_file(json_path)

            # Report results
            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS(f"✓ Created: {results['created']} properties"))
            self.stdout.write(f"✓ Updated: {results['updated']} properties")

            if results["errors"]:
                self.stdout.write(self.style.ERROR(f"\n✗ Errors: {len(results['errors'])}"))
                for error in results["errors"]:
                    self.stdout.write(self.style.ERROR(f"  - {error}"))

            self.stdout.write("")
            total = results["created"] + results["updated"]
            self.stdout.write(self.style.SUCCESS(f"Import complete! Total processed: {total}"))
