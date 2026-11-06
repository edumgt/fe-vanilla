# Frontend (FE) Architecture Guide

본 프론트엔드 모듈은 **Feature-Sliced Design (FSD)** 과 **Domain-Driven Design (DDD)** 원칙을 결합하여, 엔터프라이즈 환경에서 스케일업 가능한 트렌디한 아키텍처를 정의하고 적용합니다.

---

## 1. 아키텍처 패러다임: FSD + DDD

전통적인 flat 폴더 구조(단순 `components/`, `utils/`)를 지양하고, 시스템의 3대 핵심 도메인(`일반 업무`, `AI 인텔리전스`, `게임 FE`)을 1차 바운더리로 격리한 후 계층적 책임을 부여합니다.

### 레이어 계층 구조 (Top-Down 의존성 단방향 원칙)
```
app          -> 전역 프로바이더, 라우팅 엔트리포인트, 전역 스타일
  ↓
pages        -> 사용자 진입 라우트 화면 (Intro Portal Hub, WMS, Video AI, 3D Game)
  ↓
widgets      -> 독립적인 복합 UI 블록 (포털 도메인 카드, 분석 인디케이터 차트)
  ↓
features     -> 사용자 인터랙션 단위 (비디오 업로드 분석, 주사위 굴리기, 코드 등록)
  ↓
entities     -> 비즈니스 엔티티 모델 (Department, Glossary, GameTile, Member)
  ↓
shared       -> 도메인 독립적 재사용 라이브러리 (ApiClient, ThemeTokens, UI Kit)
```

---

## 2. 3대 도메인 바운더리 (`fe/src/domains/`)

### 1) 일반 업무 도메인 (`domains/general`)
- **책임**: ERP, 부서 그리드 관리, 입출고 WMS, 일정 캘린더, 조직도, 권한 인가.
- **핵심 모듈**:
  - `types.ts`: `DepartmentRecord`, `WmsInventoryItem`, `CalendarEventItem`, `CodeGroupItem`
  - `api.ts`: Typed `GeneralApi` (RESTful CRUD 및 동적 SQL 쿼리)

### 2) AI 인텔리전스 도메인 (`domains/ai`)
- **책임**: 생성형 AI 영상 포렌식 탐지, 주식/CEO 일정 인텔리전스, IT 용어집(Glossary) 엔진.
- **핵심 모듈**:
  - `types.ts`: `VideoForensicAnalysis`, `CeoArticleItem`, `GlossaryItem`
  - `api.ts`: Typed `AiApi` (동영상 분석 요청, CEO 타임라인 피드)

### 3) 게임 FE 도메인 (`domains/game`)
- **책임**: Three.js WebGL 기반 3D 부루마블(Blue Marble) 인터랙티브 보드 게임.
- **핵심 모듈**:
  - `types.ts`: `BoardTile`, `PlayerState`, `GameState`
  - `board.config.ts`: 36개 글로벌 도시/랜드마크 보드 타일 맵
  - `dice.engine.ts`: 더블 규칙 및 보드 순환 이동 연산 순수 함수 엔진

---

## 3. 공통 기반 계층 (`fe/src/shared/`)

- `api/client.ts`: JWT Bearer 인증 헤더 자동 주입, 에러 정규화, 직렬화 처리.
- `theme/tokens.ts`: 다크모드 기반 고대비 컬러 팔레트, 도메인별 시그니처 컬러(General: Blue, AI: Purple, Game: Emerald), 글래스모피즘(Glassmorphism) 토큰.
- `types/index.ts`: 공통 `ApiResponse<T>`, `UserProfile`, `MenuItem`.

---

## 4. 디렉터리 구조

```
fe/
├── README.md                  # 본 아키텍처 가이드 문서
├── package.json               # FE 독립 빌드/테스트 명세
└── src/
    ├── domains/
    │   ├── general/           # 일반 업무 도메인
    │   │   ├── api.ts
    │   │   └── types.ts
    │   ├── ai/                # AI 특화 업무 도메인
    │   │   ├── api.ts
    │   │   └── types.ts
    │   └── game/              # 3D 게임 FE 도메인
    │       ├── board.config.ts
    │       ├── dice.engine.ts
    │       └── types.ts
    ├── shared/                # 공통 기반
    │   ├── api/
    │   │   └── client.ts
    │   ├── theme/
    │   │   └── tokens.ts
    │   └── types/
    │       └── index.ts
    └── index.ts               # 통합 배럴(Barrel) 내보내기
```
