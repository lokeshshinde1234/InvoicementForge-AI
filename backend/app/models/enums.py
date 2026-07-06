from enum import StrEnum


class UserRole(StrEnum):
    super_admin = "super_admin"
    company_admin = "company_admin"
    client = "client"


class InvoiceStatus(StrEnum):
    unpaid = "unpaid"
    paid = "paid"
    partially_paid = "partially_paid"
    overdue = "overdue"


class ProposalStatus(StrEnum):
    draft = "draft"
    sent = "sent"
    approved = "approved"
    rejected = "rejected"


class ESignStatus(StrEnum):
    not_required = "not_required"
    pending = "pending"
    signed = "signed"

