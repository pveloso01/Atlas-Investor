"""
PDF Report Generation Service.

This service generates PDF reports for properties using WeasyPrint.
"""

import logging
from decimal import Decimal
from io import BytesIO
from typing import Any, Optional

from django.template.loader import render_to_string

from ..models import Property

logger = logging.getLogger(__name__)


class PDFReportService:
    """Service for generating PDF property reports."""

    def __init__(self) -> None:
        """Initialize the PDF service."""
        self._weasyprint_available = self._check_weasyprint()

    def _check_weasyprint(self) -> bool:
        """Check if WeasyPrint is available."""
        try:
            import weasyprint  # noqa: F401

            return True
        except ImportError:
            logger.warning("WeasyPrint not installed. PDF generation unavailable.")
            return False

    def generate_property_report(
        self,
        property: Property,
        include_analysis: bool = True,
        analysis_data: Optional[dict[str, Any]] = None,
    ) -> Optional[bytes]:
        """
        Generate a PDF report for a property.

        Args:
            property: The property to generate a report for
            include_analysis: Whether to include investment analysis
            analysis_data: Optional pre-computed analysis data

        Returns:
            PDF bytes or None if generation fails
        """
        if not self._weasyprint_available:
            logger.error("WeasyPrint not available for PDF generation")
            return None

        try:
            from weasyprint import HTML

            # Prepare context data
            context = self._prepare_report_context(
                property, include_analysis, analysis_data
            )

            # Render HTML template
            html_content = render_to_string(
                "reports/property_report.html", context
            )

            # Generate PDF
            pdf_file = BytesIO()
            HTML(string=html_content).write_pdf(pdf_file)
            pdf_file.seek(0)

            return pdf_file.read()

        except Exception as e:
            logger.error(f"Error generating PDF report: {str(e)}")
            return None

    def _prepare_report_context(
        self,
        property: Property,
        include_analysis: bool,
        analysis_data: Optional[dict[str, Any]],
    ) -> dict[str, Any]:
        """
        Prepare the context data for the report template.

        Args:
            property: The property object
            include_analysis: Whether to include analysis
            analysis_data: Pre-computed analysis data

        Returns:
            Dictionary of context data for the template
        """
        # Basic property data
        context: dict[str, Any] = {
            "property": property,
            "price_formatted": self._format_price(property.price),
            "price_per_sqm": self._calculate_price_per_sqm(property),
            "property_type_display": self._get_property_type_display(
                property.property_type
            ),
            "condition_display": self._get_condition_display(property.condition),
            "include_analysis": include_analysis,
            "generated_at": self._get_current_date(),
        }

        # Region data
        if property.region:
            context["region"] = {
                "name": property.region.name,
                "avg_price_per_sqm": property.region.avg_price_per_sqm,
                "avg_rent": property.region.avg_rent,
                "avg_yield": property.region.avg_yield,
            }

        # Analysis data
        if include_analysis and analysis_data:
            context["analysis"] = analysis_data

        return context

    def _format_price(self, price: Decimal) -> str:
        """Format price as currency string."""
        return f"€{int(price):,}".replace(",", " ")

    def _calculate_price_per_sqm(self, property: Property) -> str:
        """Calculate and format price per square meter."""
        if property.price_per_sqm:
            return f"€{int(property.price_per_sqm):,}/m²".replace(",", " ")
        return "N/A"

    def _get_property_type_display(self, prop_type: str) -> str:
        """Get display name for property type."""
        types = {
            "apartment": "Apartment",
            "house": "House",
            "land": "Land",
            "commercial": "Commercial",
            "mixed": "Mixed Use",
        }
        return types.get(prop_type, prop_type)

    def _get_condition_display(self, condition: Optional[str]) -> str:
        """Get display name for condition."""
        if not condition:
            return "Not specified"
        conditions = {
            "new": "New Construction",
            "excellent": "Excellent",
            "good": "Good",
            "fair": "Fair",
            "needs_renovation": "Needs Renovation",
            "demolition": "Demolition Required",
        }
        return conditions.get(condition, condition)

    def _get_current_date(self) -> str:
        """Get current date formatted."""
        from datetime import datetime

        return datetime.now().strftime("%B %d, %Y")


# Module-level instance
_service_instance: Optional[PDFReportService] = None


def get_pdf_service() -> PDFReportService:
    """Get the singleton PDF service instance."""
    global _service_instance
    if _service_instance is None:
        _service_instance = PDFReportService()
    return _service_instance

