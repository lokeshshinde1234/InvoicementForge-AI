from celery import Celery

from app.core.config import get_settings

celery_app = Celery("invoice_forge", broker=get_settings().redis_url, backend=get_settings().redis_url)

