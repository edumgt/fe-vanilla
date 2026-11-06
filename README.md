# EDUMGT Admin Portal

**English** | [한국어](readme-kr.md) | [LLM index](llms.txt)

Static HTML / Vanilla JavaScript admin screens, an Express 5 Backend-for-Frontend, and a Python FastAPI forensics microservice in one demo repository. The portal groups work into three domains: general operations, AI intelligence, and a 3D game frontend.

This is a learning and demonstration codebase, not a finished commercial service. Demo login tokens are not production credentials.

## Quick start

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

`npm run dev` and `npm start` both run `tsx server.ts`. The process listens on `0.0.0.0:3000`.

- Portal: http://localhost:3000/
- Health: http://localhost:3000/health
- Readiness: http://localhost:3000/health/ready
- Liveness: http://localhost:3000/health/live
- Infra files (while the server is up): http://localhost:3000/infra/

Extensionless paths work. `/system` serves `public/system.html` when that file exists. Unknown GET paths fall back to `public/index.html`.

Optional Python microservice (port 8000, separate process):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r python/requirements.txt
uvicorn python.app.main:app --host 0.0.0.0 --port 8000
```

- Health: http://localhost:8000/health
- OpenAPI: http://localhost:8000/api/v1/docs

Run that command from the repository root. Imports are `python.app.*`.

Typecheck the TypeScript entry, BFF, and `fe/` module:

```bash
npm run build
```

`npm run build` is `tsc --noEmit`. It does not emit `dist/`.

## Demo login

The portal and `POST /login` accept these demo accounts. Password is `1111`.

| Role | Username | Permissions |
| --- | --- | --- |
| Admin | `admin` | `*` |
| Manager | `manager` | `read`, `write` |
| Guest | `guest` | `read` |

The access token is a demo string (`demo-token-...`), not a signed JWT. Restarting the Node process clears in-memory glossary, calendar, WMS, and code-grid data.

## Runtime

```text
Browser
  ├─ static HTML/CSS/JS ─────────► Express :3000  (public/)
  └─ /login /api /db /upload ────► Express :3000  (nodejs/)
                                      │
                                      └─ PYTHON_MICROSERVICE_URL (default http://localhost:8000)
                                         configured, not called by the current video route

Python FastAPI :8000
  └─ /api/v1/forensics/analyze   independent scoring service
```

| Port | Process | Role |
| --- | --- | --- |
| 3000 | `server.ts` → `nodejs/src/app.ts` | Static files, demo auth, screen APIs, image upload |
| 8000 | `python.app.main:app` | Versioned AI forensics API and OpenAPI |

`/api/video-forensics/analyze` on the Express server returns an in-process simulated result. It does not proxy to Python. Call the Python service directly when you want the FastAPI scoring path.

## Repository layout

| Path | Role |
| --- | --- |
| `public/` | Vanilla HTML screens, app CSS/JS, mock JSON, uploads |
| `server.ts` | Process entry. Fixed host `0.0.0.0`, port `3000` |
| `nodejs/` | Express 5 BFF. Routes, controllers, in-memory store |
| `fe/` | TypeScript domain layer (FSD + DDD). Not the HTML runtime |
| `python/` | FastAPI 0.115+ microservice, Dockerfile, `pyproject.toml` |
| `infra/` | AWS SAM, Docker Compose, and Kubernetes scaffolds |
| `scripts/` | AWS bootstrap and CI/CD shell entrypoints |
| `docs/` | Screen captures and the older API mapping note |
| `tests/` | Node video-AI unit test and Playwright capture script |
| `ARCHITECTURE.md` | Module methodology (FE / Node / Python) |

`backend_fastapi/` now contains only `.env.example`. `run_backend.sh`, the root `docker-compose.yml`, and `infra/aws/Makefile` still copy or start `backend_fastapi/app`, which is no longer in the tree. Do not use those paths as the local entrypoint.

## Screens

The portal at `public/index.html` is the hub.

### General operations

| Screen | File |
| --- | --- |
| Code grid | `public/system.html` |
| Calendar | `public/calendar.html` |
| Finance sheet | `public/flow.html` |
| Tasks and Gantt | `public/trello.html` |
| Members and stats | `public/stati.html` |
| Org permissions | `public/orgtree.html` |
| Lecture timetable | `public/1.html` |
| Enrollment estimate | `public/2.html` |

![Login and portal](./docs/image.png)

![Code management](./docs/image-1.png)

![Calendar popup](./docs/image-5.png)

![Project timeline](./docs/image-11.png)

![Permissions](./docs/image-13.png)

### AI intelligence

| Screen | File |
| --- | --- |
| AI and semiconductor companies | `public/aistock.html` |
| Video forensics | `public/video-ai.html` |
| CEO diary | `public/ceo-diary.html` |
| Document viewer | `public/document.html` |
| Glossary | `public/glos.html` |
| Sector and supply chain | `public/chain.html` |

![Video AI capture](./docs/box-ai-playwright.png)

### Game frontend

| Screen | File |
| --- | --- |
| 3D Blue Marble | `public/burumable.html` |
| SQL console | `public/4.html` |

Open `public/burumable.html?demo=1` for the curated capture state.

![Blue Marble 3D](./docs/burumable-3d.png)

### Other admin screens

These HTML files are still served. They are not all linked from the portal hub.

`attend.html`, `orgni.html`, `network.html`, `city.html`, `survey.html`, `wms.html`, `hospital.html`, `work.html`, `meeting.html`, `lectures.html`, `timeline.html`, `total.html`, `locker.html`, `kegeditor.html`, `kegeditor2.html`, `kegcode.html`, `orgsel.html`, `config.html`, `box.html`, `login.html`, `register.html`, `account-pop.html`, `3.html`, `5.html`

PaaS setup console: `public/config.html`

![PaaS AWS](./docs/paas-setup-aws.png)

![PaaS Kubernetes](./docs/paas-setup-onprem-k8s.png)

Screen capture script: [scripts/capture-screens.js](./scripts/capture-screens.js)

## HTTP API (Express)

Implemented in `nodejs/src/routes/`. Responses are JSON unless noted.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health`, `/health/live`, `/health/ready` | Process checks |
| POST | `/login` | Demo login |
| POST | `/auth/refresh` | Demo refresh |
| GET | `/protected` | Requires `Authorization` |
| POST | `/upload/image` | Multipart field `image`. Returns `{ url }` |
| GET | `/api/menu`, `/api/members`, `/api/permissions` | Menu and people |
| GET | `/api/data` | Code grid |
| POST | `/api/save`, `/api/delete` | Code grid writes |
| GET | `/db/inbound`, `/db/outbound` | WMS lists |
| POST | `/db/inbound/add`, `/db/outbound/add` | WMS create |
| POST | `/db/inbound/update`, `/db/outbound/update` | WMS update |
| POST | `/db/inbound/delete`, `/db/outbound/delete` | WMS delete |
| POST | `/db/dynamicConnect`, `/db/query` | Demo SQL console |
| GET | `/api/calendar` | Calendar tasks |
| POST | `/api/calendar/mock-seed`, `/api/addDate`, `/api/addEvent` | Calendar writes |
| DELETE | `/api/deleteEvent/:event_id` | Delete one event |
| GET | `/api/codegroup`, `/api/code`, `/api/SitePlaceRoom` | Code and room trees |
| GET, POST | `/api/todos` | Todo list |
| GET | `/api/bookings`, `/api/reservations` | Bookings |
| GET | `/api/list` | API catalog |
| GET, POST, PUT, DELETE | `/api/glos`, `/api/setGlos`, `/api/glos/:item_id`, `/api/glos/delete` | Glossary CRUD |
| POST | `/api/glos_req` | Glossary correction request |
| GET | `/api/getGlosReq` | List correction requests |
| GET | `/api/ceo-news?ticker=NVDA` | Demo CEO items. Also `MSFT`, `GOOGL` |
| POST | `/api/video-forensics/analyze` | In-process simulated forensics JSON |

Browser scripts should call the same origin, or `window.APP_API_BASE` when the API host differs. `fe/src/shared/api/client.ts` follows that rule.

[docs/api-mapping.md](./docs/api-mapping.md) still describes the removed `backend_fastapi` app and port 8000. Treat this README as the live route list.

## CDN assets

App-specific CSS and JavaScript stay in `public/assets/`. Shared vendor libraries on the main screens load from CDNs, including:

- Font Awesome 5.15.4 from cdnjs
- Tailwind (CDN script) on the portal and video pages
- Toast UI Grid and Pagination from `uicdn.toast.com`
- Pikaday from jsDelivr

`public/assets/vendor/` still holds local copies. New pages should follow the CDN links already used in `public/system.html` and `public/index.html` unless a screen must work offline.

## Python microservice

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health |
| GET | `/api/v1/health` | Router health |
| GET | `/api/v1/menu` | Page-visibility map |
| POST | `/api/v1/forensics/analyze` | Scoring response from `VideoForensicsService` |

The forensics service builds indicator scores from the request payload (duration and frame sample count). It does not decode an uploaded MP4 and it is not a trained model. Browser sampling for `video-ai.html` stays in the frontend.

Container build context is `python/`:

```bash
docker build -t fe-vanilla-python python
```

Settings live in `python/app/core/config.py` (`HOST`, `PORT`, `SECRET_KEY`, `VIDEO_FORENSIC_THRESHOLD`, `DEVICE`). Do not commit real secrets.

## Tests

```bash
node --test tests/video-ai-core.test.mjs
npm run build
```

Playwright capture (legacy box flow, needs Docker):

```bash
docker compose -f docker-compose.playwright.yml up -d static
docker compose -f docker-compose.playwright.yml run --rm playwright python tests/playwright/box_capture_test.py
docker compose -f docker-compose.playwright.yml down
```

## Deployment scaffolds

`infra/` is a PaaS-style scaffold, not the current local runtime.

| Target | Docs | Notes |
| --- | --- | --- |
| AWS SAM | [infra/aws/README.md](./infra/aws/README.md) | Lambda handler still imports removed `backend_fastapi/app` via `infra/aws/Makefile` |
| Docker Compose | [infra/docker/README.md](./infra/docker/README.md) | Root `docker-compose.yml` builds `./backend_fastapi`, which no longer has an app |
| Kubernetes | [infra/k8s/README.md](./infra/k8s/README.md) | Dev overlay under `infra/k8s/overlays/dev` |
| CI shell | `scripts/cicd/` | `ci.sh`, `deploy.sh`, `pipeline.sh` for `local`, `dev`, `stage`, `prod` |

Use the scaffolds as references. Wire them to `server.ts` and `python/` before treating a deploy as current.

Profile example: [infra/setup.profile.example.json](./infra/setup.profile.example.json)

## Environment

Node (`nodejs/src/config/env.ts`):

| Variable | Default | Use |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime label |
| `JWT_SECRET` | demo value in code | Replace outside local demo |
| `PYTHON_MICROSERVICE_URL` | `http://localhost:8000` | Reserved for a future proxy |
| `DEBUG_LOGS` | unset | `true` logs every HTTP line |

Port and host are fixed at `3000` / `0.0.0.0` in `server.ts` and `ENV`. They are not read from `PORT`.

Root `.env.example` still lists the older FastAPI and Postgres variables (`DATABASE_URL`, `APP_ENV`, `DEMO_USERS_JSON`). Those apply only to the removed backend and the leftover shell scripts.

## Related docs

- [readme-kr.md](./readme-kr.md)
- [llms.txt](./llms.txt)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [fe/README.md](./fe/README.md)
- [nodejs/README.md](./nodejs/README.md)
- [python/README.md](./python/README.md)
