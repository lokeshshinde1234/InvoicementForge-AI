from jinja2 import Template

try:
    from weasyprint import HTML
except Exception:  # pragma: no cover - optional native dependency in local dev
    HTML = None


INVOICE_TEMPLATE = """
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #172033; margin: 36px; }
    .top { display: flex; justify-content: space-between; border-bottom: 2px solid #1f6feb; padding-bottom: 18px; }
    h1 { margin: 0; font-size: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 28px; }
    th, td { border-bottom: 1px solid #d8dee9; padding: 10px; text-align: left; }
    th { background: #f3f6fb; }
    .right { text-align: right; }
    .badge { display: inline-block; padding: 6px 10px; background: #e8f2ff; color: #0b5cad; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="top">
    <div>
      <h1>{{ company.name }}</h1>
      <p>{{ company.address or "" }}</p>
      <p>GST: {{ company.gst_number or "N/A" }}</p>
    </div>
    <div class="right">
      <h2>Invoice {{ invoice.invoice_number }}</h2>
      <span class="badge">{{ invoice.status }}</span>
      <p>Due: {{ invoice.due_date or "N/A" }}</p>
    </div>
  </div>
  <h3>Bill To: {{ client.name }}</h3>
  <p>{{ client.email }}<br>{{ client.address or "" }}</p>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th class="right">Total</th></tr></thead>
    <tbody>
      {% for item in invoice.items %}
      <tr><td>{{ item.description }}</td><td>{{ item.quantity }}</td><td>{{ item.unit_price }}</td><td class="right">{{ item.line_total }}</td></tr>
      {% endfor %}
    </tbody>
  </table>
  <p class="right">Subtotal: {{ invoice.subtotal }}</p>
  <p class="right">Tax {{ invoice.tax_percent }}% | Discount: {{ invoice.discount }}</p>
  <h2 class="right">Grand Total: {{ invoice.total }}</h2>
  <p><strong>Bank:</strong> {{ company.bank_account_name or "" }} {{ company.bank_account_number or "" }} {{ company.bank_ifsc or "" }}</p>
  <p>{{ invoice.notes or "" }}</p>
</body>
</html>
"""


def render_invoice_html(company, client, invoice) -> str:
    return Template(INVOICE_TEMPLATE).render(company=company, client=client, invoice=invoice)


def render_invoice_pdf(company, client, invoice) -> bytes:
    html = render_invoice_html(company, client, invoice)
    if HTML is None:
        return html.encode("utf-8")
    return HTML(string=html).write_pdf()

