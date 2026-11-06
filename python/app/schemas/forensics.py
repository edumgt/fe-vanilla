from typing import List, Optional, Dict
from pydantic import BaseModel, Field, ConfigDict

class FrameSeriesPoint(BaseModel):
    label: str = Field(..., description="Timestamp label (e.g. 0.4s)")
    score: float = Field(..., ge=0.0, le=1.0, description="Frame anomaly/AI score")

class VideoForensicIndicator(BaseModel):
    label: str = Field(..., description="Indicator category name")
    score: float = Field(..., ge=0.0, le=1.0, description="Risk confidence score")
    description: str = Field(..., description="Technical explanation")

class HighlightDetail(BaseModel):
    label: str
    score: float
    detail: str

class VideoAnalysisRequest(BaseModel):
    video_url: Optional[str] = Field(None, description="Remote video URL or uploaded file path")
    video_name: Optional[str] = Field("sample.mp4", description="Original file name")
    duration: Optional[float] = Field(5.0, description="Duration in seconds")
    frame_samples: Optional[int] = Field(8, description="Number of frames sampled")

class VideoForensicResponse(BaseModel):
    success: bool = True
    verdict: str = Field(..., description="AI generation conclusion")
    tone: str = Field("ai", description="Badge styling category (ai, real, uncertain)")
    badge: str = Field("AI 우세", description="Visual badge label")
    summary: str = Field(..., description="Detailed analytical summary")
    aiProbability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    averageFrameScore: float = Field(...)
    frameAverages: Dict[str, float] = Field(default_factory=lambda: {"temporalDelta": 0.14})
    highlights: List[HighlightDetail] = Field(default_factory=list)
    indicators: List[VideoForensicIndicator] = Field(default_factory=list)
    frameSeries: List[FrameSeriesPoint] = Field(default_factory=list)

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "success": True,
                "verdict": "AI 생성 가능성 높음",
                "tone": "ai",
                "badge": "AI 우세",
                "summary": "질감이 매우 균일하고 반사광 패턴이 강해 생성형 또는 렌더링 기반 영상으로 추정됩니다.",
                "aiProbability": 0.55,
                "confidence": 0.60,
                "averageFrameScore": 0.52
            }
        }
    )
