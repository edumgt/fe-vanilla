# EDUMGT 관리자 포털

[English](README.md) | **한국어** | [LLM 색인](llms.txt)

정적 HTML / Vanilla JavaScript 화면, Express 5 BFF, Python FastAPI 포렌식 마이크로서비스를 한 저장소에서 보여주는 데모입니다. 포털은 **일반 업무**, **AI 용 업무**, **게임 FE** 세 영역으로 나뉩니다.

학습·시연용 코드베이스이며 완성된 상용 서비스가 아닙니다. 데모 로그인 토큰을 운영 자격 증명으로 쓰지 마세요.

## 빠른 시작

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev
```

`npm run dev`와 `npm start`는 모두 `tsx server.ts`를 실행합니다. 프로세스는 `0.0.0.0:3000`에 붙습니다.

- 포털: http://localhost:3000/
- 헬스: http://localhost:3000/health
- 준비: http://localhost:3000/health/ready
- 생존: http://localhost:3000/health/live
- 서버가 떠 있는 동안 인프라 파일: http://localhost:3000/infra/

확장자 없는 경로도 동작합니다. `public/system.html`이 있으면 `/system`으로 열립니다. 모르는 GET 경로는 `public/index.html`로 떨어집니다.

Python 마이크로서비스는 별도 프로세스이며 포트는 8000입니다.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r python/requirements.txt
uvicorn python.app.main:app --host 0.0.0.0 --port 8000
```

저장소 루트에서 실행하세요. import 경로는 `python.app.*`입니다.

- 헬스: http://localhost:8000/health
- OpenAPI: http://localhost:8000/api/v1/docs

TypeScript 엔트리, BFF, `fe/` 모듈 검사:

```bash
npm run build
```

`npm run build`는 `tsc --noEmit`입니다. `dist/`를 만들지 않습니다.

## 데모 로그인

포털과 `POST /login`은 아래 계정을 받습니다. 비밀번호는 `1111`입니다.

| 역할 | 아이디 | 권한 |
| --- | --- | --- |
| Admin | `admin` | `*` |
| Manager | `manager` | `read`, `write` |
| Guest | `guest` | `read` |

액세스 토큰은 서명된 JWT가 아니라 `demo-token-...` 문자열입니다. Node 프로세스를 재시작하면 메모리에 둔 용어, 일정, WMS, 코드 그리드 데이터가 사라집니다.

## 실행 구조

```text
브라우저
  ├─ 정적 HTML/CSS/JS ─────────► Express :3000  (public/)
  └─ /login /api /db /upload ──► Express :3000  (nodejs/)
                                      │
                                      └─ PYTHON_MICROSERVICE_URL (기본 http://localhost:8000)
                                         설정만 있고, 현재 영상 라우트는 호출하지 않음

Python FastAPI :8000
  └─ /api/v1/forensics/analyze   독립 스코어링 서비스
```

| 포트 | 프로세스 | 역할 |
| --- | --- | --- |
| 3000 | `server.ts` → `nodejs/src/app.ts` | 정적 파일, 데모 인증, 화면 API, 이미지 업로드 |
| 8000 | `python.app.main:app` | 버전 API와 OpenAPI |

Express의 `/api/video-forensics/analyze`는 프로세스 안에서 만든 시뮬레이션 JSON을 반환합니다. Python으로 프록시하지 않습니다. FastAPI 스코어링이 필요하면 Python 서비스를 직접 호출하세요.

## 저장소 구성

| 경로 | 역할 |
| --- | --- |
| `public/` | Vanilla HTML 화면, 앱 CSS/JS, mock JSON, 업로드 |
| `server.ts` | 프로세스 진입점. 호스트 `0.0.0.0`, 포트 `3000` 고정 |
| `nodejs/` | Express 5 BFF. 라우트, 컨트롤러, 인메모리 스토어 |
| `fe/` | TypeScript 도메인 계층 (FSD + DDD). HTML 런타임이 아님 |
| `python/` | FastAPI 0.115+ 마이크로서비스, Dockerfile, `pyproject.toml` |
| `infra/` | AWS SAM, Docker Compose, Kubernetes 스캐폴드 |
| `scripts/` | AWS 부트스트랩과 CI/CD 셸 |
| `docs/` | 화면 캡처와 이전 API 매핑 메모 |
| `tests/` | 동영상 AI 단위 테스트, Playwright 캡처 |
| `ARCHITECTURE.md` | FE / Node / Python 방법론 |

`backend_fastapi/`에는 `.env.example`만 남아 있습니다. `run_backend.sh`, 루트 `docker-compose.yml`, `infra/aws/Makefile`은 더 이상 없는 `backend_fastapi/app`를 기동하거나 복사합니다. 로컬 진입점으로 쓰지 마세요.

## 화면

허브는 `public/index.html`입니다.

### 일반 업무

| 화면 | 파일 |
| --- | --- |
| 종목 코드 관리 | `public/system.html` |
| 실적·이벤트 일정 | `public/calendar.html` |
| 매출·재무분석 | `public/flow.html` |
| 리서치 태스크·간트 | `public/trello.html` |
| 시장통계·회원 | `public/stati.html` |
| 조직·권한 | `public/orgtree.html` |
| 강의시간표 | `public/1.html` |
| 수강신청견적 | `public/2.html` |

![포털·로그인](./docs/image.png)

![코드관리](./docs/image-1.png)

![다국어 라벨 예시](./docs/image-2.png)

![전체 메뉴](./docs/image-3.png)

![좌측 트리](./docs/image-4.png)

![일정 팝업](./docs/image-5.png)

![조직도](./docs/image-6.png)

![프로젝트 일정](./docs/image-11.png)

![권한관리](./docs/image-13.png)

![근태](./docs/image-18.png)

### AI 용 업무

| 화면 | 파일 |
| --- | --- |
| AI·반도체 기업 정보 | `public/aistock.html` |
| 동영상 AI 생성 판별 | `public/video-ai.html` |
| 글로벌 AI CEO 다이어리 | `public/ceo-diary.html` |
| 뉴스 문서분석 | `public/document.html` |
| 투자·AI 용어사전 | `public/glos.html` |
| 글로벌 섹터·공급망 | `public/chain.html` |

브라우저에서 MP4 메타데이터와 샘플 프레임을 읽어 질감, 반사, 프레임 변화, 윤곽, 길이, 구도, 비트레이트를 점수화합니다. 서버의 포렌식 JSON은 그 화면과 별개인 시뮬레이션·휴리스틱 응답입니다.

![동영상 AI 캡처](./docs/box-ai-playwright.png)

![3D 박스 도안](./docs/image-9.png)

### 게임 FE

| 화면 | 파일 |
| --- | --- |
| 부루마블 3D | `public/burumable.html` |
| DB Admin·SQL 콘솔 | `public/4.html` |

캡처용 상태는 `public/burumable.html?demo=1`입니다.

![부루마블 3D](./docs/burumable-3d.png)

### 허브 밖에 남아 있는 화면

`attend.html`, `orgni.html`, `network.html`, `city.html`, `survey.html`, `wms.html`, `hospital.html`, `work.html`, `meeting.html`, `lectures.html`, `timeline.html`, `total.html`, `locker.html`, `kegeditor.html`, `kegeditor2.html`, `kegcode.html`, `orgsel.html`, `config.html`, `box.html`, `login.html`, `register.html`, `account-pop.html`, `3.html`, `5.html`

PaaS 설치 콘솔은 `public/config.html`입니다. 1차로 AWS Cloud 또는 On Prem, On Prem이면 Docker Compose 또는 Kubernetes를 고릅니다. 선택 결과는 브라우저에 저장되고, 설정 JSON 다운로드와 스캐폴드 미리보기를 제공합니다.

![PaaS AWS](./docs/paas-setup-aws.png)

![PaaS Kubernetes](./docs/paas-setup-onprem-k8s.png)

![설문 빌더](./docs/image-14.png)

![설문 결과](./docs/image-15.png)

![KEG-EDITOR](./docs/image-16.png)

![사물함](./docs/image-17.png)

![컨설팅](./docs/image-10.png)

![행정구역 비교](./docs/image-12.png)

![시스템 로그 차트](./docs/image-7.png)

![통계 대시보드](./docs/image-8.png)

화면 캡처 스크립트: [scripts/capture-screens.js](./scripts/capture-screens.js)

## HTTP API (Express)

구현 위치는 `nodejs/src/routes/`입니다.

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| GET | `/health`, `/health/live`, `/health/ready` | 프로세스 점검 |
| POST | `/login` | 데모 로그인 |
| POST | `/auth/refresh` | 데모 리프레시 |
| GET | `/protected` | `Authorization` 필요 |
| POST | `/upload/image` | multipart 필드 `image`. `{ url }` 반환 |
| GET | `/api/menu`, `/api/members`, `/api/permissions` | 메뉴·구성원 |
| GET | `/api/data` | 코드 그리드 |
| POST | `/api/save`, `/api/delete` | 코드 그리드 쓰기 |
| GET | `/db/inbound`, `/db/outbound` | WMS 목록 |
| POST | `/db/inbound/add`, `/db/outbound/add` | WMS 생성 |
| POST | `/db/inbound/update`, `/db/outbound/update` | WMS 수정 |
| POST | `/db/inbound/delete`, `/db/outbound/delete` | WMS 삭제 |
| POST | `/db/dynamicConnect`, `/db/query` | 데모 SQL 콘솔 |
| GET | `/api/calendar` | 일정 |
| POST | `/api/calendar/mock-seed`, `/api/addDate`, `/api/addEvent` | 일정 쓰기 |
| DELETE | `/api/deleteEvent/:event_id` | 일정 삭제 |
| GET | `/api/codegroup`, `/api/code`, `/api/SitePlaceRoom` | 코드·강의실 트리 |
| GET, POST | `/api/todos` | 할 일 |
| GET | `/api/bookings`, `/api/reservations` | 예약 |
| GET | `/api/list` | API 목록 |
| GET, POST, PUT, DELETE | `/api/glos`, `/api/setGlos`, `/api/glos/:item_id`, `/api/glos/delete` | 용어 CRUD |
| POST | `/api/glos_req` | 용어 수정 요청 |
| GET | `/api/getGlosReq` | 수정 요청 목록 |
| GET | `/api/ceo-news?ticker=NVDA` | 데모 CEO 일정. `MSFT`, `GOOGL`도 있음 |
| POST | `/api/video-forensics/analyze` | 인프로세스 시뮬레이션 JSON |

화면 스크립트는 같은 오리진을 쓰고, API 호스트가 다르면 `window.APP_API_BASE`를 씁니다. `fe/src/shared/api/client.ts`도 같은 규칙입니다.

[docs/api-mapping.md](./docs/api-mapping.md)는 제거된 `backend_fastapi`와 포트 8000을 기준으로 적혀 있습니다. 현재 라우트 목록은 이 문서를 기준으로 보세요.

## CDN

화면 전용 CSS/JS는 `public/assets/`에 둡니다. 주요 HTML은 공통 라이브러리를 CDN에서 불러옵니다.

- Font Awesome 5.15.4 (cdnjs)
- 포털·영상 화면의 Tailwind CDN 스크립트
- Toast UI Grid, Pagination (`uicdn.toast.com`)
- Pikaday (jsDelivr)

`public/assets/vendor/`의 로컬 복사본은 남아 있습니다. 오프라인 화면이 아니면 `public/system.html`, `public/index.html`처럼 CDN 링크를 따르세요.

## Python 마이크로서비스

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| GET | `/health` | 서비스 헬스 |
| GET | `/api/v1/health` | 라우터 헬스 |
| GET | `/api/v1/menu` | 페이지 노출 맵 |
| POST | `/api/v1/forensics/analyze` | `VideoForensicsService` 점수 응답 |

이 서비스는 요청의 길이·프레임 샘플 수로 지표 점수를 만듭니다. 업로드된 MP4를 디코딩하지 않으며, 학습된 모델도 아닙니다. `video-ai.html`의 프레임 샘플링은 브라우저에서 처리합니다.

이미지 빌드 컨텍스트는 `python/`입니다.

```bash
docker build -t fe-vanilla-python python
```

설정은 `python/app/core/config.py`입니다 (`HOST`, `PORT`, `SECRET_KEY`, `VIDEO_FORENSIC_THRESHOLD`, `DEVICE`). 실제 비밀 값은 커밋하지 마세요.

## 테스트

```bash
node --test tests/video-ai-core.test.mjs
npm run build
```

Playwright 캡처는 Docker가 필요하고, 이전 box 흐름을 확인합니다.

```bash
docker compose -f docker-compose.playwright.yml up -d static
docker compose -f docker-compose.playwright.yml run --rm playwright python tests/playwright/box_capture_test.py
docker compose -f docker-compose.playwright.yml down
```

## 배포 스캐폴드

`infra/`는 PaaS형 참고 골격입니다. 현재 로컬 런타임이 아닙니다.

| 대상 | 문서 | 주의 |
| --- | --- | --- |
| AWS SAM | [infra/aws/README.md](./infra/aws/README.md) | `infra/aws/Makefile`이 제거된 `backend_fastapi/app`를 Lambda 아티팩트로 복사함 |
| Docker Compose | [infra/docker/README.md](./infra/docker/README.md) | 루트 `docker-compose.yml`은 `./backend_fastapi`를 빌드함 |
| Kubernetes | [infra/k8s/README.md](./infra/k8s/README.md) | 개발 overlay는 `infra/k8s/overlays/dev` |
| CI 셸 | `scripts/cicd/` | `local`, `dev`, `stage`, `prod`용 `ci.sh`, `deploy.sh`, `pipeline.sh` |

스캐폴드를 현재 배포로 쓰기 전에 `server.ts`와 `python/`에 다시 연결해야 합니다. Lambda 기본 `DatabaseUrl`은 `sqlite:////tmp/admin-vanilla.db`라 재기동 시 사라집니다. 정적 호스트와 API 호스트를 나누면 `window.APP_API_BASE` 또는 `/api/*` 경로 라우팅이 필요합니다.

공통 프로파일: [infra/setup.profile.example.json](./infra/setup.profile.example.json)

환경 파일:

- [scripts/cicd/env/local.sh](./scripts/cicd/env/local.sh)
- [scripts/cicd/env/dev.sh](./scripts/cicd/env/dev.sh)
- [scripts/cicd/env/stage.sh](./scripts/cicd/env/stage.sh)
- [scripts/cicd/env/prod.sh](./scripts/cicd/env/prod.sh)

AWS 순서는 `scripts/aws/01-bootstrap-serverless-foundation.sh` → `02-deploy-serverless-stack.sh` → `03-sync-frontend.sh`입니다. steering EKS는 `11`, `12` 스크립트이며 사용자 트래픽 경로가 아닙니다.

## 환경 변수

Node (`nodejs/src/config/env.ts`):

| 변수 | 기본값 | 용도 |
| --- | --- | --- |
| `NODE_ENV` | `development` | 런타임 라벨 |
| `JWT_SECRET` | 코드 안 데모 값 | 로컬 데모 밖에서는 교체 |
| `PYTHON_MICROSERVICE_URL` | `http://localhost:8000` | 이후 프록시용. 현재 영상 라우트는 미사용 |
| `DEBUG_LOGS` | 없음 | `true`이면 HTTP 한 줄 로그 |

포트와 호스트는 `server.ts`와 `ENV`에 `3000` / `0.0.0.0`으로 고정되어 있습니다. `PORT`를 읽지 않습니다.

루트 `.env.example`의 `DATABASE_URL`, `APP_ENV`, `DEMO_USERS_JSON`은 제거된 FastAPI와 남은 셸 스크립트용입니다.

## 관련 문서

- [README.md](./README.md)
- [llms.txt](./llms.txt)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [fe/README.md](./fe/README.md)
- [nodejs/README.md](./nodejs/README.md)
- [python/README.md](./python/README.md)
