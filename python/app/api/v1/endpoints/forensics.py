from fastapi import APIRouter, HTTPException, status
from python.app.schemas.forensics import VideoAnalysisRequest, VideoForensicResponse
from python.app.services.forensics_service import VideoForensicsService

router = APIRouter()

@router.post(
    "/analyze",
    response_model=VideoForensicResponse,
    summary="Analyze Video for Generative AI Markers",
    description="Inspects optical flow, texture variance, and facial coherence to determine probability of AI synthesis."
)
async def analyze_video(request: VideoAnalysisRequest) -> VideoForensicResponse:
    try:
        result = await VideoForensicsService.analyze(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video forensic evaluation failed: {str(e)}"
        )
