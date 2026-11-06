# Enterprise System Architecture: FE, Node.js & Python

본 문서는 엔터프라이즈 통합 관리자 시스템의 3대 핵심 모듈인 **프론트엔드(FE)**, **Node.js (BFF / Gateway)**, **Python (AI Microservice)** 에 적용된 최신 개발 방법론과 폴더 구조 표준을 정의합니다.

---

## 1. 3대 모듈 개발 방법론 개요

| 모듈 | 기술 스택 | 적용 방법론 | 핵심 역할 |
|---|---|---|---|
| **FE (Frontend)** | Modern TS, Tailwind CSS, Three.js WebGL, FSD | **Feature-Sliced Design (FSD) + DDD** | 3대 도메인(일반 업무, AI 인텔리전스, 게임 FE)의 명확한 격리 및 사용자 경험 제공 |
| **Node.js (BFF)** | Express 5, TypeScript (NodeNext), Multer | **BFF (Backend-For-Frontend) + Layered Clean Architecture** | 프론트엔드 화면 최적화 API 중계, 정적 자산 서빙, 인증/인가 및 세션 관리 |
| **Python (Microservice)** | FastAPI 0.115+, Python 3.12, Pydantic v2 | **Hexagonal (Ports & Adapters) + Async ASGI** | AI 비디오 포렌식 추론, 고부하 데이터 집계, ML 모델 라이프사이클 관리 |

---

## 2. 통합 데이터 흐름 (Unified Data Flow)

```
[ Browser / Client ]
      │
      ├──> (Static HTML/CSS/JS Assets) ───────> Node.js Port 3000 (Static File Server)
      │
      ├──> (REST API Request) ────────────────> Node.js Port 3000 (BFF Gateway)
                                                        │
                                                        ├── [General Domain] ──> In-Memory / PostgreSQL Store
                                                        │
                                                        └── [AI Domain Proxy] ──> Python FastAPI Port 8000
                                                                                        │
                                                                                        └── AI Video Forensics Inference
```

---

## 3. 모듈별 상세 디렉터리 정의 및 방법론

### 1) FE (Frontend) 모듈 (`fe/`)
- **방법론**: **Feature-Sliced Design (FSD) & Domain-Driven Design (DDD)**
  - UI 복잡도를 낮추기 위해 수평적 슬라이스(`domains/`)와 수직적 레이어(`shared/`, `entities/`, `features/`, `widgets/`)를 분리.
- **3대 비즈니스 도메인**:
  - `domains/general/`: ERP, 부서 관리, WMS 입출고, 일정 캘린더, 권한 시스템.
  - `domains/ai/`: 생성형 AI 비디오 포렌식 감지기, CEO 글로벌 일정/뉴스 추적, IT 용어사전.
  - `domains/game/`: Three.js WebGL 기반 3D 부루마블 보드 게임 및 주사위 물리 엔진.
- **공통 기반 계층 (`shared/`)**:
  - `shared/api/client.ts`: JWT 인증 헤더 자동 주입 및 에러 정규화 클라이언트.
  - `shared/theme/tokens.ts`: 다크모드 및 도메인별 시그니처 컬러 토큰.

```
fe/
├── README.md
├── package.json
└── src/
    ├── domains/
    │   ├── general/           # 일반 업무 도메인 (types.ts, api.ts)
    │   ├── ai/                # AI 특화 업무 도메인 (types.ts, api.ts)
    │   └── game/              # 3D 게임 FE 도메인 (board.config.ts, dice.engine.ts, types.ts)
    ├── shared/
    │   ├── api/client.ts      # 타입 세이프 HTTP 클라이언트
    │   ├── theme/tokens.ts    # 다크 테마 및 도메인 컬러 토큰
    │   └── types/index.ts     # 공통 DTO 인터페이스
    └── index.ts               # 루트 배럴
```

---

### 2) Node.js BFF 모듈 (`nodejs/`)
- **방법론**: **Layered Clean Architecture & BFF Pattern**
  - Presentation(라우트) -> Controller -> Service -> Data 계층 분리.
  - 클라이언트가 필요로 하는 포맷으로 조합(Aggregation)하여 전송 오버헤드 최소화.
- **주요 구성요소**:
  - `config/env.ts`: 불변 포트(`PORT: 3000`) 및 환경 설정 중앙화.
  - `controllers/`: 도메인별 컨트롤러 (`auth`, `general`, `ai`).
  - `services/store.service.ts`: 싱글톤 인메모리 및 목 데이터 관리.
  - `middlewares/`: 요청 로깅, JWT 인증 해석, 전역 에러 핸들러.
  - `app.ts`: Express 5 애플리케이션 팩토리 (`createApp()`).

```
nodejs/
├── README.md
└── src/
    ├── app.ts                 # Express 애플리케이션 팩토리
    ├── config/env.ts          # 런타임 환경 설정 (Port 3000 고정)
    ├── controllers/
    │   ├── ai.controller.ts
    │   ├── auth.controller.ts
    │   └── general.controller.ts
    ├── middlewares/index.ts   # Logger, Auth, ErrorHandler
    ├── routes/
    │   ├── ai.routes.ts
    │   ├── auth.routes.ts
    │   ├── general.routes.ts
    │   └── index.ts           # 통합 라우터 및 Health Check
    ├── services/
    │   └── store.service.ts   # 비즈니스/스토어 서비스
    └── types/index.ts         # TypeScript 인터페이스
```

---

### 3) Python AI 마이크로서비스 모듈 (`python/`)
- **방법론**: **Clean / Hexagonal Architecture + Modern FastAPI (Python 3.12)**
  - 비동기 ASGI 기반 논블로킹 I/O 처리.
  - Pydantic v2 기반 엄격한 스키마 검증.
  - Lifespan 비동기 컨텍스트를 통한 AI 모델 워밍업 및 리소스 관리.
- **주요 구성요소**:
  - `app/main.py`: Lifespan 수명주기 및 OpenAPI 자동 생성 (`/api/v1/docs`).
  - `app/core/`: `pydantic-settings` 환경 설정 및 JWT 보안.
  - `app/schemas/forensics.py`: 비디오 분석 입출력 DTO.
  - `app/services/forensics_service.py`: 광학 흐름(Optical Flow), 텍스처 노이즈, 시간축 일관성 분석 엔진.
  - `Dockerfile`: Multi-stage 빌드 기반 초경량 프로덕션 이미지.

```
python/
├── Dockerfile
├── README.md
├── pyproject.toml
├── requirements.txt
└── app/
    ├── main.py                # FastAPI 인스턴스 (Lifespan 패턴)
    ├── api/v1/
    │   ├── router.py          # v1 라우터
    │   └── endpoints/
    │       ├── forensics.py   # AI 영상 분석 엔드포인트
    │       └── general.py     # 공통 메타데이터
    ├── core/
    │   ├── config.py          # Pydantic v2 Settings
    │   └── security.py        # 보안 및 토큰 유틸리티
    ├── schemas/
    │   ├── forensics.py       # Pydantic v2 스키마
    │   └── general.py
    └── services/
        └── forensics_service.py # AI 포렌식 도메인 로직
```

---

## 4. 실행 및 배포 규칙

1. **포트 규약**:
   - 프론트엔드 및 게이트웨이는 항상 `http://0.0.0.0:3000`에서 서빙됩니다.
   - Python 마이크로서비스는 `http://0.0.0.0:8000`에서 독립 실행되며 Node.js BFF를 통해 투명하게 프록시됩니다.
2. **타입 안전성**:
   - `npm run build` (`tsc --noEmit`) 실행 시 `server.ts`, `nodejs/`, `fe/` 전체의 TypeScript 유효성을 일괄 검증합니다.
