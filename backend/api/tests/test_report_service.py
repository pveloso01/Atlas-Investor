"""
Tests for report generation service.
"""

import pytest
from decimal import Decimal
from unittest.mock import Mock, patch, MagicMock

from django.test import TestCase

from api.services.report_service import ReportGenerationService, get_report_service


class TestReportGenerationService(TestCase):
    """Tests for ReportGenerationService."""

    def setUp(self):
        """Set up test data."""
        self.service = ReportGenerationService()

    def test_service_initialization(self):
        """Test service initializes correctly."""
        assert self.service is not None
        # WeasyPrint may or may not be available
        assert isinstance(self.service._weasyprint_available, bool)

    def test_get_report_service_singleton(self):
        """Test get_report_service returns singleton."""
        service1 = get_report_service()
        service2 = get_report_service()
        assert service1 is service2

    def test_format_price(self):
        """Test price formatting."""
        assert self.service._format_price(Decimal("650000")) == "€650 000"
        assert self.service._format_price(Decimal("1250000")) == "€1 250 000"
        assert self.service._format_price(Decimal("99000")) == "€99 000"

    def test_get_property_type_display(self):
        """Test property type display names."""
        assert self.service._get_property_type_display("apartment") == "Apartment"
        assert self.service._get_property_type_display("house") == "House"
        assert self.service._get_property_type_display("land") == "Land"
        assert self.service._get_property_type_display("commercial") == "Commercial"
        assert self.service._get_property_type_display("mixed") == "Mixed Use"
        assert self.service._get_property_type_display("unknown") == "unknown"

    def test_get_condition_display(self):
        """Test condition display names."""
        assert self.service._get_condition_display("new") == "New Construction"
        assert self.service._get_condition_display("excellent") == "Excellent"
        assert self.service._get_condition_display("good") == "Good"
        assert self.service._get_condition_display("fair") == "Fair"
        assert self.service._get_condition_display("needs_renovation") == "Needs Renovation"
        assert self.service._get_condition_display("demolition") == "Demolition Required"
        assert self.service._get_condition_display(None) == "Not specified"
        assert self.service._get_condition_display("custom") == "custom"

    def test_get_current_date(self):
        """Test current date formatting."""
        date_str = self.service._get_current_date()
        # Should be in format like "December 04, 2025"
        assert len(date_str) > 0
        assert "," in date_str

    @patch.object(ReportGenerationService, '_check_weasyprint')
    def test_generate_property_report_without_weasyprint(self, mock_check):
        """Test report generation fails gracefully without WeasyPrint."""
        mock_check.return_value = False
        service = ReportGenerationService()
        
        mock_property = Mock()
        mock_property.price = Decimal("500000")
        
        result = service.generate_property_report(mock_property)
        assert result is None

    @patch.object(ReportGenerationService, '_check_weasyprint')
    def test_generate_comparison_report_without_weasyprint(self, mock_check):
        """Test comparison report fails gracefully without WeasyPrint."""
        mock_check.return_value = False
        service = ReportGenerationService()
        
        mock_properties = [Mock(), Mock()]
        result = service.generate_comparison_report(mock_properties)
        assert result is None

    @patch.object(ReportGenerationService, '_check_weasyprint')
    def test_generate_comparison_report_needs_minimum_properties(self, mock_check):
        """Test comparison report requires at least 2 properties."""
        mock_check.return_value = True
        service = ReportGenerationService()
        
        result = service.generate_comparison_report([Mock()])
        assert result is None

    @patch.object(ReportGenerationService, '_check_weasyprint')
    def test_generate_portfolio_report_without_weasyprint(self, mock_check):
        """Test portfolio report fails gracefully without WeasyPrint."""
        mock_check.return_value = False
        service = ReportGenerationService()
        
        mock_portfolio = Mock()
        result = service.generate_portfolio_report(mock_portfolio)
        assert result is None

    def test_calculate_price_per_sqm(self):
        """Test price per square meter calculation."""
        mock_property = Mock()
        mock_property.price_per_sqm = Decimal("5000")
        result = self.service._calculate_price_per_sqm(mock_property)
        assert "€5 000/m²" == result

    def test_calculate_price_per_sqm_none(self):
        """Test price per sqm returns N/A when not available."""
        mock_property = Mock()
        mock_property.price_per_sqm = None
        result = self.service._calculate_price_per_sqm(mock_property)
        assert result == "N/A"

    def test_calculate_avg_yield(self):
        """Test average yield calculation."""
        properties_data = [
            {"analysis": {"gross_yield": 5.0}},
            {"analysis": {"gross_yield": 6.0}},
            {"analysis": {"gross_yield": 4.0}},
        ]
        result = self.service._calculate_avg_yield(properties_data)
        assert result == "5.00%"

    def test_calculate_avg_yield_no_yields(self):
        """Test average yield with no yields available."""
        properties_data = [
            {"analysis": {}},
            {"analysis": {}},
        ]
        result = self.service._calculate_avg_yield(properties_data)
        assert result == "N/A"

    def test_calculate_comparison_metrics(self):
        """Test comparison metrics calculation."""
        mock_prop1 = Mock()
        mock_prop1.price = Decimal("300000")
        mock_prop1.size_sqm = Decimal("80")

        mock_prop2 = Mock()
        mock_prop2.price = Decimal("500000")
        mock_prop2.size_sqm = Decimal("120")

        properties_data = [
            {
                "property": mock_prop1,
                "analysis": {"gross_yield": 4.5},
            },
            {
                "property": mock_prop2,
                "analysis": {"gross_yield": 5.5},
            },
        ]

        metrics = self.service._calculate_comparison_metrics(properties_data)
        
        assert "€300 000" == metrics["lowest_price"]
        assert "€500 000" == metrics["highest_price"]
        assert "€400 000" == metrics["avg_price"]
        assert "100 m²" == metrics["avg_size"]
        assert "5.00%" == metrics["avg_yield"]
        assert metrics["best_yield_index"] == 1

    def test_prepare_property_context(self):
        """Test property context preparation."""
        mock_property = Mock()
        mock_property.price = Decimal("400000")
        mock_property.price_per_sqm = Decimal("4000")
        mock_property.property_type = "apartment"
        mock_property.condition = "good"
        mock_property.region = None

        context = self.service._prepare_property_context(
            mock_property,
            {"gross_yield": 5.0, "net_yield": 4.0}
        )

        assert context["property"] == mock_property
        assert context["price_formatted"] == "€400 000"
        assert context["price_per_sqm"] == "€4 000/m²"
        assert context["property_type_display"] == "Apartment"
        assert context["condition_display"] == "Good"
        assert context["include_analysis"] is True
        assert context["analysis"]["gross_yield"] == 5.0

    def test_prepare_property_context_with_region(self):
        """Test property context includes region data."""
        mock_region = Mock()
        mock_region.name = "Lisboa"
        mock_region.avg_price_per_sqm = Decimal("5000")
        mock_region.avg_rent = Decimal("1500")
        mock_region.avg_yield = Decimal("5.5")

        mock_property = Mock()
        mock_property.price = Decimal("400000")
        mock_property.price_per_sqm = Decimal("4000")
        mock_property.property_type = "apartment"
        mock_property.condition = "good"
        mock_property.region = mock_region

        context = self.service._prepare_property_context(mock_property, None)

        assert "region" in context
        assert context["region"]["name"] == "Lisboa"
        assert context["region"]["avg_price_per_sqm"] == Decimal("5000")


class TestReportServiceWithWeasyPrint(TestCase):
    """Tests that require WeasyPrint (marked for skipping if not available)."""

    def setUp(self):
        """Set up test data."""
        self.service = ReportGenerationService()

    @pytest.mark.skipif(
        not ReportGenerationService()._check_weasyprint(),
        reason="WeasyPrint not installed"
    )
    def test_generate_property_report_with_weasyprint(self):
        """Test actual PDF generation with WeasyPrint."""
        from api.models import Region, Property
        
        # Create test region
        region = Region.objects.create(
            name="Test Region",
            code="TST",
            avg_price_per_sqm=5000,
            avg_rent=1200,
            avg_yield=5.0,
        )
        
        # Create test property
        property = Property.objects.create(
            address="Test Address 123",
            property_type="apartment",
            price=Decimal("300000"),
            size_sqm=Decimal("100"),
            bedrooms=2,
            bathrooms=1,
            region=region,
        )
        
        result = self.service.generate_property_report(property)
        
        # If WeasyPrint is available, we should get bytes
        if self.service._weasyprint_available:
            assert result is not None
            assert isinstance(result, bytes)
            # PDF files start with %PDF
            assert result[:4] == b'%PDF'

