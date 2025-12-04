"""
Investment Analysis Service.

This service provides investment analysis calculations for properties,
including rental yield, cash flow, ROI, and payback period calculations.
"""

import hashlib
import json
import logging
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Optional

from django.core.cache import cache

from ..models import Property

logger = logging.getLogger(__name__)


@dataclass
class AnalysisParams:
    """Parameters for investment analysis."""

    monthly_rent: Decimal = Decimal("0")
    occupancy_rate: Decimal = Decimal("0.95")
    property_tax_rate: Decimal = Decimal("0.003")
    insurance_rate: Decimal = Decimal("0.002")
    maintenance_rate: Decimal = Decimal("0.01")
    management_fee_rate: Decimal = Decimal("0.08")
    down_payment_percent: Decimal = Decimal("0.20")
    mortgage_rate: Decimal = Decimal("0.035")
    mortgage_term_years: int = 30
    strategy: str = "rental"

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "AnalysisParams":
        params = cls()
        for key, value in data.items():
            if hasattr(params, key):
                if key in ["monthly_rent", "occupancy_rate", "property_tax_rate",
                          "insurance_rate", "maintenance_rate", "management_fee_rate",
                          "down_payment_percent", "mortgage_rate"]:
                    setattr(params, key, Decimal(str(value)))
                elif key == "mortgage_term_years":
                    setattr(params, key, int(value))
                else:
                    setattr(params, key, value)
        return params


@dataclass
class AnalysisResult:
    gross_yield: Decimal
    net_yield: Decimal
    annual_gross_income: Decimal
    annual_expenses: Decimal
    annual_net_income: Decimal
    monthly_cash_flow: Decimal
    cash_on_cash_return: Decimal
    total_roi: Decimal
    payback_years: Decimal
    expense_breakdown: dict
    monthly_mortgage_payment: Optional[Decimal]

    def to_dict(self) -> dict:
        return {
            "gross_yield": float(self.gross_yield),
            "net_yield": float(self.net_yield),
            "annual_gross_income": float(self.annual_gross_income),
            "annual_expenses": float(self.annual_expenses),
            "annual_net_income": float(self.annual_net_income),
            "monthly_cash_flow": float(self.monthly_cash_flow),
            "cash_on_cash_return": float(self.cash_on_cash_return),
            "total_roi": float(self.total_roi),
            "payback_years": float(self.payback_years),
            "expense_breakdown": {k: float(v) for k, v in self.expense_breakdown.items()},
            "monthly_mortgage_payment": float(self.monthly_mortgage_payment) if self.monthly_mortgage_payment else None,
        }


class InvestmentAnalysisService:
    CACHE_TIMEOUT = 300

    def analyze_property(self, property: Property, params: Optional[AnalysisParams] = None, use_cache: bool = True) -> AnalysisResult:
        if params is None:
            params = self._estimate_params(property)

        if use_cache:
            cache_key = self._get_cache_key(property.id, params)
            cached_result = cache.get(cache_key)
            if cached_result:
                return cached_result

        result = self._calculate_analysis(property, params)

        if use_cache:
            cache.set(cache_key, result, self.CACHE_TIMEOUT)

        return result

    def _estimate_params(self, property: Property) -> AnalysisParams:
        params = AnalysisParams()
        if property.region and property.region.avg_rent:
            size_factor = Decimal(str(property.size_sqm)) / Decimal("80")
            params.monthly_rent = property.region.avg_rent * size_factor
        else:
            params.monthly_rent = Decimal(str(property.price)) * Decimal("0.004")
        return params

    def _calculate_analysis(self, property: Property, params: AnalysisParams) -> AnalysisResult:
        price = Decimal(str(property.price))
        annual_gross_rent = params.monthly_rent * 12
        annual_gross_income = annual_gross_rent * params.occupancy_rate

        property_tax = price * params.property_tax_rate
        insurance = price * params.insurance_rate
        maintenance = price * params.maintenance_rate
        management_fee = annual_gross_rent * params.management_fee_rate

        expense_breakdown = {"property_tax": property_tax, "insurance": insurance, "maintenance": maintenance, "management_fee": management_fee}
        annual_expenses = sum(expense_breakdown.values())
        annual_net_income = annual_gross_income - annual_expenses

        gross_yield = (annual_gross_income / price * 100) if price > 0 else Decimal("0")
        net_yield = (annual_net_income / price * 100) if price > 0 else Decimal("0")

        down_payment = price * params.down_payment_percent
        loan_amount = price - down_payment
        monthly_mortgage = self._calculate_mortgage_payment(loan_amount, params.mortgage_rate, params.mortgage_term_years)

        monthly_net_income = annual_net_income / 12
        monthly_cash_flow = monthly_net_income - (monthly_mortgage or Decimal("0"))

        annual_mortgage = (monthly_mortgage * 12) if monthly_mortgage else Decimal("0")
        annual_cash_flow = annual_net_income - annual_mortgage
        cash_on_cash_return = (annual_cash_flow / down_payment * 100) if down_payment > 0 else Decimal("0")
        total_roi = (annual_net_income * 5 / down_payment * 100) if down_payment > 0 else Decimal("0")
        payback_years = (price / annual_net_income) if annual_net_income > 0 else Decimal("999")

        return AnalysisResult(
            gross_yield=gross_yield.quantize(Decimal("0.01")),
            net_yield=net_yield.quantize(Decimal("0.01")),
            annual_gross_income=annual_gross_income.quantize(Decimal("0.01")),
            annual_expenses=annual_expenses.quantize(Decimal("0.01")),
            annual_net_income=annual_net_income.quantize(Decimal("0.01")),
            monthly_cash_flow=monthly_cash_flow.quantize(Decimal("0.01")),
            cash_on_cash_return=cash_on_cash_return.quantize(Decimal("0.01")),
            total_roi=total_roi.quantize(Decimal("0.01")),
            payback_years=payback_years.quantize(Decimal("0.1")),
            expense_breakdown={k: v.quantize(Decimal("0.01")) for k, v in expense_breakdown.items()},
            monthly_mortgage_payment=monthly_mortgage.quantize(Decimal("0.01")) if monthly_mortgage else None,
        )

    def _calculate_mortgage_payment(self, principal: Decimal, annual_rate: Decimal, term_years: int) -> Optional[Decimal]:
        if principal <= 0 or annual_rate <= 0 or term_years <= 0:
            return None
        monthly_rate = annual_rate / 12
        num_payments = term_years * 12
        rate_factor = (1 + monthly_rate) ** num_payments
        monthly_payment = principal * (monthly_rate * rate_factor) / (rate_factor - 1)
        return monthly_payment

    def _get_cache_key(self, property_id: int, params: AnalysisParams) -> str:
        params_str = json.dumps({"monthly_rent": str(params.monthly_rent), "mortgage_rate": str(params.mortgage_rate)}, sort_keys=True)
        params_hash = hashlib.md5(params_str.encode()).hexdigest()[:8]
        return f"property_analysis:{property_id}:{params_hash}"


def get_analysis_service() -> InvestmentAnalysisService:
    return InvestmentAnalysisService()
