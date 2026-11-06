from fastapi import APIRouter
from python.app.api.v1.endpoints import forensics, general

api_v1_router = APIRouter()

api_v1_router.include_router(general.router, tags=["General Operations"])
api_v1_router.include_router(forensics.router, prefix="/forensics", tags=["AI Video Forensics"])
