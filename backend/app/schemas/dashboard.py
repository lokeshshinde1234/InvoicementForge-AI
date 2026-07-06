from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_invoices: int
    paid_amount: Decimal
    pending_amount: Decimal
    overdue_count: int
    this_month_revenue: Decimal


class TopClient(BaseModel):
    client_id: UUID
    name: str
    total_invoiced: Decimal


class AdminAnalytics(BaseModel):
    total_companies: int
    active_companies: int
    saas_wide_revenue: Decimal
    signups_this_month: int

