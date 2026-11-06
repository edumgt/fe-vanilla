# Python AI & Business Microservice Architecture Guide

본 모듈은 **FastAPI 0.115+ (Python 3.12)** 와 **Clean / Hexagonal Architecture**를 기반으로 설계된 고성능 AI 추론 및 비즈니스 데이터 마이크로서비스입니다.

---

## 1. 아키텍처 패러다임: Clean / Hexagonal Architecture

외부 프레임워크나 HTTP 전송 계층의 변경이 핵심 비즈니스 로직(도메인 엔티티 및 유즈케이스)에 영향을 미치지 않도록 분리합니다.

### 레이어 계층 구조
```
1. Entrypoint & Transport (app/main.py, app/api/v1/)
   - ASGI Lifespan 관리 (애플리케이션 시작/종료 시 리소스 초기화)
   - FastAPI Router & OpenAPI / Swagger 자동 문서화 (/api/v1/docs)
   - HTTP Request DTO 검증 및 Dependency Injection
   ↓
2. Business Services (app/services/)
   - 비디오 포렌식 딥러닝 추론 (시간축 불연속성, 센서 질감 노이즈 분석)
   - 주식/CEO 일정 인텔리전스 가공
   ↓
3. Domain Models & Schemas (app/schemas/)
   - Pydantic v2 기반 엄격한 타입 계약 및 직렬화
   ↓
4. Core & Infrastructure (app/core/)
   - Pydantic-Settings 기반 환경 설정 (`Settings`)
   - JWT 토큰 발급 및 해싱 보안 유틸리티
```

---

## 2. 디렉터리 구조 (`python/`)

```
python/
├── Dockerfile                 # Multi-stage 프로덕션 최적화 컨테이너
├── README.md                  # 본 아키텍처 가이드 문서
├── pyproject.toml             # Python 3.12 표준 패키징 명세
├── requirements.txt           # 런타임 의존성
└── app/
    ├── main.py                # FastAPI 인스턴스 및 Lifespan 컨텍스트
    ├── api/
    │   └── v1/
    │       ├── router.py      # v1 통합 라우터
    │       └── endpoints/
    │           ├── forensics.py  # 비디오 AI 포렌식 엔드포인트
    │           └── general.py    # 공통 메타데이터 엔드포인트
    ├── core/
    │   ├── config.py          # Pydantic v2 기반 환경 설정
    │   └── security.py        # 암호화 및 JWT 토큰 처리
    ├── schemas/               # Pydantic v2 DTO 정의
    │   ├── forensics.py       # 비디오 분석 입출력 스키마
    │   └── general.py         # 부서/WMS 공통 스키마
    └── services/              # 순수 비즈니스 로직
        └── forensics_service.py # AI 포렌식 분석 엔진
```

---

## 3. 핵심 모던 기법 적용 내역

1. **Async ASGI & Non-blocking I/O**: `async def` 핸들러 및 고성능 비동기 컨텍스트.
2. **Pydantic v2 Strict Validation**: `ConfigDict`, `Field(ge=0, le=1)` 등 컴파일 타임에 준하는 유효성 검증.
3. **Lifespan Context Manager**: 최신 FastAPI 표준(`lifespan(app: FastAPI)`)을 통해 리소스 누수 방지.
4. **Interactive OpenAPI Specs**: `/api/v1/docs` (Swagger UI) 및 `/api/v1/redoc` 자동 생성.
