# Node.js Backend-For-Frontend (BFF) Architecture Guide

본 모듈은 Express 5와 TypeScript 최신 표준(NodeNext)을 기반으로 구축된 **BFF(Backend-For-Frontend)** 및 **Layered Clean Architecture** 구현체입니다.

---

## 1. 아키텍처 패러다임: Layered Clean Architecture & BFF

프론트엔드의 다양한 클라이언트(일반 관리자 화면, AI 포렌식 툴, 3D 게임 인터랙션)의 요구사항을 최적화하여 중계하고, Python AI 마이크로서비스 및 온프레미스/클라우드 데이터베이스와 안전하게 통신합니다.

### 4단계 레이어 구조 (단방향 의존성)
```
1. Presentation / Routing Layer  (routes/)
   - HTTP 진입점 라우팅
   - 미들웨어 체이닝 (인증, 로깅, 유효성 검증)
   ↓
2. Controller Layer              (controllers/)
   - 요청(Request) 파라미터 파싱 및 DTO 정규화
   - 서비스(Service) 레이어 호출
   - 일관된 HTTP 응답(Response) 형식 반환
   ↓
3. Service Layer                 (services/)
   - 비즈니스 로직 및 트랜잭션 관리
   - Python AI 마이크로서비스 RPC/REST 통신
   - 인메모리/캐시 및 영속성 스토어 처리
   ↓
4. Infrastructure / Data Layer   (config/, types/)
   - 환경 변수 및 인프라 디렉터리 경로 관리
   - 공통 타입 정의 및 외부 SDK 초기화
```

---

## 2. 디렉터리 구조 (`nodejs/`)

```
nodejs/
├── README.md                  # 본 아키텍처 가이드 문서
└── src/
    ├── app.ts                 # Express 애플리케이션 팩토리 (createApp)
    ├── config/                # 환경 변수 및 런타임 설정
    │   └── env.ts             # PORT(3000 Invariant), Host, 경로 정의
    ├── controllers/           # 계층형 컨트롤러
    │   ├── ai.controller.ts       # AI 도메인 (용어집, CEO 뉴스, 비디오 분석)
    │   ├── auth.controller.ts     # 인증/인가 (JWT Bearer, Refresh)
    │   └── general.controller.ts  # 일반 업무 (부서 그리드, WMS, 캘린더, 동적 쿼리)
    ├── middlewares/           # 전역 및 라우트별 미들웨어
    │   └── index.ts           # requestLogger, authMiddleware, errorHandler
    ├── routes/                # 도메인별 라우터
    │   ├── ai.routes.ts
    │   ├── auth.routes.ts
    │   ├── general.routes.ts
    │   └── index.ts           # 통합 라우터 및 Health Check
    ├── services/              # 핵심 비즈니스 서비스
    │   └── store.service.ts   # 영속/목 데이터 스토어 싱글톤
    └── types/                 # 엄격한 TypeScript 타입 인터페이스
        └── index.ts           # UserRole, CodeItem, VideoForensicResult 등
```

---

## 3. 핵심 규칙 및 제약사항

1. **Port Invariant**: 포트는 반드시 `0.0.0.0:3000` 고정입니다. (Nginx 리버스 프록시 및 컨테이너 환경 호환)
2. **ESM / NodeNext Compliance**: 모든 로컬 상대경로 import는 `.js` 확장자를 명시합니다. (`import { ENV } from './config/env.js'`)
3. **Graceful Error Handling**: 전역 `errorHandler`가 예외를 인터셉트하여 일관된 JSON 포맷을 반환합니다.
