from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


class StorageService:
    async def upload(self, file: UploadFile, folder: str) -> str:
        uploads = Path("uploads") / folder
        uploads.mkdir(parents=True, exist_ok=True)
        suffix = Path(file.filename or "upload.bin").suffix
        target = uploads / f"{uuid4()}{suffix}"
        content = await file.read()
        target.write_bytes(content)
        return str(target.as_posix())


storage_service = StorageService()

