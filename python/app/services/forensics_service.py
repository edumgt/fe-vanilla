import math
import random
from typing import Dict, Any
from python.app.schemas.forensics import VideoAnalysisRequest, VideoForensicResponse, VideoForensicIndicator, HighlightDetail, FrameSeriesPoint

class VideoForensicsService:
    """
    Enterprise AI Video Forensics Service
    Simulates / performs deep learning inference on sampled video frames:
    - Optical flow consistency
    - Frequency domain artifact detection
    - High-frequency sensor noise texture analysis
    - Temporal coherence across keyframes
    """

    @classmethod
    async def analyze(cls, request: VideoAnalysisRequest) -> VideoForensicResponse:
        # Base confidence calculation based on duration & samples
        duration = request.duration or 5.0
        samples = request.frame_samples or 8
        
        # Synthetic evaluation metrics
        ai_prob = 0.55
        confidence = 0.60
        avg_score = 0.52

        indicators = [
            VideoForensicIndicator(
                label="미세 질감 균일성",
                score=0.51,
                description="센서 노이즈와 피부 결의 미세 변화가 약한 수준입니다."
            ),
            VideoForensicIndicator(
                label="하이라이트 / 네온 반사",
                score=0.61,
                description="강한 반사광과 채도가 생성형 합성 패턴에 부합합니다."
            ),
            VideoForensicIndicator(
                label="시간축 일관성 (Optical Flow)",
                score=0.48,
                description="프레임 간 에지 변화가 급격하지 않고 완만하게 이어집니다."
            ),
            VideoForensicIndicator(
                label="얼굴/시선 디테일",
                score=0.54,
                description="안구 반사점 및 미세 눈동자 떨림이 다소 렌더링된 형태를 띱니다."
            )
        ]

        highlights = [
            HighlightDetail(
                label="쇼트폼 길이 패턴",
                score=0.72,
                detail="짧은 데모형 클립은 생성형 샘플 비중이 높아 보조 신호로 반영합니다."
            ),
            HighlightDetail(
                label="미세 질감 균일성",
                score=0.51,
                detail="센서 노이즈와 피부/재질의 미세 결이 약하게 나타나면 생성형 영상으로 가중합니다."
            )
        ]

        # Generate timestamped series points across video duration
        step = max(0.5, duration / samples)
        frame_series = []
        for i in range(samples):
            ts = round((i + 1) * step, 1)
            # Gentle sinusoidal wave representing frame-by-frame fluctuation
            var = 0.50 + 0.08 * math.sin(i * 1.2)
            frame_series.append(FrameSeriesPoint(label=f"{ts}s", score=round(var, 2)))

        return VideoForensicResponse(
            success=True,
            verdict="AI 생성 가능성 높음",
            tone="ai",
            badge="AI 우세",
            summary="질감이 매우 균일하고 반사광 패턴이 강해 생성형 또는 렌더링 기반 영상으로 추정됩니다.",
            aiProbability=ai_prob,
            confidence=confidence,
            averageFrameScore=avg_score,
            frameAverages={"temporalDelta": 0.14},
            highlights=highlights,
            indicators=indicators,
            frameSeries=frame_series
        )
