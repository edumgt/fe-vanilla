from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter()

@router.get("/menu", summary="Menu configuration")
async def get_menu() -> Dict[str, bool]:
    pages = [
        'system.html', 'glos.html', 'orgtree.html', 'document.html', 'wms.html',
        'calendar.html', 'trello.html', 'timeline.html', 'orgni.html', 'attend.html',
        'total.html', 'stati.html', 'flow.html', 'chain.html', 'work.html',
        'meeting.html', 'hospital.html', 'lectures.html', 'city.html', 'config.html',
        'network.html', 'survey.html', 'locker.html', 'kegcode.html', 'kegeditor.html',
        'kegeditor2.html', 'orgsel.html', 'aistock.html', '1.html', '2.html', '3.html',
        '4.html', '5.html', 'account-pop.html'
    ]
    return {page: True for page in pages}

@router.get("/health", summary="Health check")
async def health_check() -> Dict[str, str]:
    return {"status": "ok", "service": "python-fastapi-microservice"}
