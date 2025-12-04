"""
Report Generation Service.

This service generates comprehensive PDF reports for various use cases:
- Single property reports
- Property comparison reports
- Portfolio summary reports
"""

import logging
from datetime import datetime
from decimal import Decimal
from io import BytesIO
from typing import Any, Optional

from django.template.loader import render_to_string

from ..models import Property, Portfolio
from .analysis_service import InvestmentAnalysisService

logger = logging.getLogger(__name__)


class ReportGenerationService:
    """Service for generating comprehensive PDF reports."""

    def __init__(self) -> None:
        """Initialize the report service."""
        self._weasyprint_available = self._check_weasyprint()
        self._analysis_service = InvestmentAnalysisService()

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
    ) -> Optional[bytes]:
        """
        Generate a comprehensive PDF report for a single property.

        Args:
            property: The property to generate a report for
            include_analysis: Whether to include investment analysis

        Returns:
            PDF bytes or None if generation fails
        """
        if not self._weasyprint_available:
            logger.error("WeasyPrint not available for PDF generation")
            return None

        try:
            from weasyprint import HTML

            # Get analysis data if requested
            analysis_data = None
            if include_analysis:
                analysis_data = self._get_property_analysis(property)

            # Prepare context data
            context = self._prepare_property_context(property, analysis_data)

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
            logger.error(f"Error generating property report: {str(e)}")
            return None

    def generate_comparison_report(
        self,
        properties: list[Property],
    ) -> Optional[bytes]:
        """
        Generate a PDF report comparing multiple properties.

        Args:
            properties: List of properties to compare (2-4 properties)

        Returns:
            PDF bytes or None if generation fails
        """
        if not self._weasyprint_available:
            logger.error("WeasyPrint not available for PDF generation")
            return None

        if len(properties) < 2:
            logger.error("Need at least 2 properties for comparison")
            return None

        try:
            from weasyprint import HTML

            # Prepare comparison data
            context = self._prepare_comparison_context(properties)

            # Render HTML template
            html_content = render_to_string(
                "reports/comparison_report.html", context
            )

            # Generate PDF
            pdf_file = BytesIO()
            HTML(string=html_content).write_pdf(pdf_file)
            pdf_file.seek(0)

            return pdf_file.read()

        except Exception as e:
            logger.error(f"Error generating comparison report: {str(e)}")
            return None

    def generate_portfolio_report(
        self,
        portfolio: Portfolio,
    ) -> Optional[bytes]:
        """
        Generate a PDF report for a portfolio.

        Args:
            portfolio: The portfolio to generate a report for

        Returns:
            PDF bytes or None if generation fails
        """
        if not self._weasyprint_available:
            logger.error("WeasyPrint not available for PDF generation")
            return None

        try:
            from weasyprint import HTML

            # Prepare portfolio data
            context = self._prepare_portfolio_context(portfolio)

            # Render HTML template
            html_content = render_to_string(
                "reports/portfolio_report.html", context
            )

            # Generate PDF
            pdf_file = BytesIO()
            HTML(string=html_content).write_pdf(pdf_file)
            pdf_file.seek(0)

            return pdf_file.read()

        except Exception as e:
            logger.error(f"Error generating portfolio report: {str(e)}")
            return None

    def _get_property_analysis(self, property: Property) -> dict[str, Any]:
        """Get investment analysis for a property."""
        try:
            # Use default assumptions for the report
            result = self._analysis_service.analyze(property.id, "rental", {})
            return result
        except Exception as e:
            logger.warning(f"Could not get analysis for property: {e}")
            return {}

    def _prepare_property_context(
        self,
        property: Property,
        analysis_data: Optional[dict[str, Any]],
    ) -> dict[str, Any]:
        """Prepare context data for property report template."""
        context: dict[str, Any] = {
            "property": property,
            "price_formatted": self._format_price(property.price),
            "price_per_sqm": self._calculate_price_per_sqm(property),
            "property_type_display": self._get_property_type_display(
                property.property_type
            ),
            "condition_display": self._get_condition_display(property.condition),
            "include_analysis": analysis_data is not None,
            "generated_at": self._get_current_date(),
        }

        if property.region:
            context["region"] = {
                "name": property.region.name,
                "avg_price_per_sqm": property.region.avg_price_per_sqm,
                "avg_rent": property.region.avg_rent,
                "avg_yield": property.region.avg_yield,
            }

        if analysis_data:
            context["analysis"] = analysis_data

        return context

    def _prepare_comparison_context(
        self,
        properties: list[Property],
    ) -> dict[str, Any]:
        """Prepare context data for comparison report template."""
        properties_data = []
        
        for prop in properties:
            analysis = self._get_property_analysis(prop)
            properties_data.append({
                "property": prop,
                "price_formatted": self._format_price(prop.price),
                "price_per_sqm": self._calculate_price_per_sqm(prop),
                "property_type_display": self._get_property_type_display(
                    prop.property_type
                ),
                "analysis": analysis,
            })

        # Calculate comparison metrics
        comparison_metrics = self._calculate_comparison_metrics(properties_data)

        return {
            "properties": properties_data,
            "comparison_metrics": comparison_metrics,
            "generated_at": self._get_current_date(),
            "property_count": len(properties),
        }

    def _prepare_portfolio_context(
        self,
        portfolio: Portfolio,
    ) -> dict[str, Any]:
        """Prepare context data for portfolio report template."""
        portfolio_properties = portfolio.portfolioproperty_set.select_related(
            "property", "property__region"
        ).all()

        total_value = Decimal("0")
        total_monthly_income = Decimal("0")
        properties_data = []

        for pp in portfolio_properties:
            prop = pp.property
            analysis = self._get_property_analysis(prop)
            
            total_value += prop.price
            if analysis.get("monthly_cash_flow"):
                total_monthly_income += Decimal(str(analysis["monthly_cash_flow"]))

            properties_data.append({
                "property": prop,
                "notes": pp.notes,
                "price_formatted": self._format_price(prop.price),
                "analysis": analysis,
            })

        return {
            "portfolio": portfolio,
            "properties": properties_data,
            "total_value": self._format_price(total_value),
            "total_monthly_income": f"€{int(total_monthly_income):,}".replace(",", " "),
            "property_count": len(properties_data),
            "avg_yield": self._calculate_avg_yield(properties_data),
            "generated_at": self._get_current_date(),
        }

    def _calculate_comparison_metrics(
        self,
        properties_data: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Calculate comparison metrics between properties."""
        prices = [p["property"].price for p in properties_data]
        sizes = [p["property"].size_sqm for p in properties_data]
        yields = [
            p["analysis"].get("gross_yield", 0)
            for p in properties_data
            if p["analysis"].get("gross_yield")
        ]

        return {
            "lowest_price": self._format_price(min(prices)),
            "highest_price": self._format_price(max(prices)),
            "avg_price": self._format_price(sum(prices) / len(prices)),
            "avg_size": f"{int(sum(sizes) / len(sizes))} m²",
            "avg_yield": f"{sum(yields) / len(yields):.2f}%" if yields else "N/A",
            "best_yield_index": yields.index(max(yields)) if yields else -1,
        }

    def _calculate_avg_yield(
        self,
        properties_data: list[dict[str, Any]],
    ) -> str:
        """Calculate average yield across properties."""
        yields = [
            p["analysis"].get("gross_yield", 0)
            for p in properties_data
            if p["analysis"].get("gross_yield")
        ]
        if yields:
            return f"{sum(yields) / len(yields):.2f}%"
        return "N/A"

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
        return datetime.now().strftime("%B %d, %Y")


# Module-level instance
_service_instance: Optional[ReportGenerationService] = None


def get_report_service() -> ReportGenerationService:
    """Get the singleton report service instance."""
    global _service_instance
    if _service_instance is None:
        _service_instance = ReportGenerationService()
    return _service_instance

