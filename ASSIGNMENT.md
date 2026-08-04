# PR Assignment — Idempotency and Duplicate-Safe Writes

## Starter Repository

Fork this repository to your GitHub account:

https://github.com/Vikranth2024/lu37-idempotency-starter

Then clone your fork and create the assignment branch:

```bash
git clone https://github.com/<your-username>/lu37-idempotency-starter.git
cd lu37-idempotency-starter
git checkout -b idempotent-incidents
docker compose up -d
npm install
npm run db:reset
npm test
```

Starter intentionally fails tests until implementation is complete.

## Scenario

**Fireline** creates incidents through `POST /incidents`. Mobile clients retry when response is lost. Production has duplicate incidents and duplicate paging jobs because current handler checks no stable operation key and publishes notification directly.

## Starter Structure

```text
lu37-idempotency-starter/
├── db/schema.sql
├── src/incidents.js
├── src/db.js                 # provided
├── src/app.js                # provided Express route
├── src/auth.js               # provided exercise authentication
├── tests/idempotency.test.js # 14 tests
├── package.json
└── README.md
```

Linked starter repository contains complete runnable support files, Docker PostgreSQL setup, and all 14 tests.

## Broken Behaviour

Current handler inserts a new incident for every request. It has no required idempotency key, request hash, duplicate state, atomic claim, transaction, or durable paging job.

Sequential and concurrent retries therefore create duplicate incidents. Same key with changed payload cannot be detected because the key is not stored at all.

## Task

Implement idempotent `POST /incidents` so sequential retry, concurrent retry, and lost response produce one incident and one durable paging job.

## Requirements

### 1 — Schema

Create `idempotency_keys` with:

- authenticated `tenant_id`
- `operation`
- client `key`
- `request_hash`
- state: `processing`, `completed`, `failed`
- stored `response_status`, `response_body`, `resource_id`
- `created_at`, `expires_at`
- primary/unique key `(tenant_id, operation, key)`

Create `paging_jobs` with stable job ID, incident ID, payload, status, and timestamps. Paging job must be inserted once in same DB transaction.

### 2 — Request Validation

- Require `Idempotency-Key`; missing key returns `400` before write.
- Derive tenant from `req.user.tenantId`, never client body/header tenant value.
- Use operation string `POST:/incidents`.
- Compute deterministic SHA-256 hash from canonical validated fields: `title`, `severity`, `serviceId`.

### 3 — Atomic Claim

Inside one DB transaction:

```sql
INSERT ... ON CONFLICT DO NOTHING RETURNING key
```

- Returned row means request owns operation.
- No returned row means another request owns/completed it; read existing row after conflict resolution.
- Never create incident before winning claim.

### 4 — Duplicate Behaviour

- Same scoped key + same hash + completed: replay stored status/body; no new work.
- Same scoped key + different hash: `409 Conflict`.
- Same scoped key + processing: return documented `409 operation_in_progress`; do not execute.
- Separate tenants using same key remain independent.

### 5 — New Operation

Claim owner must atomically:

1. create one incident;
2. create one durable paging job carrying stable `jobId` and incident ID;
3. update idempotency row to completed with `201` response body/resource ID;
4. commit, then send HTTP response.

No direct queue call in request handler.

### 6 — TTL and README

Set `expires_at = now() + interval '24 hours'` for exercise. README must explain:

1. why unique constraint is required in addition to pre-check;
2. why request hash is canonical and compared;
3. what happens after 24-hour expiry;
4. why paging job shares transaction;
5. production privacy/size concern for stored response.

### 7 — Tests

All 14 supplied tests must pass, including:

- missing key returns 400 with no writes;
- first request returns 201;
- sequential duplicate replays same response;
- 20 concurrent duplicates produce one incident and one paging job;
- changed body returns 409;
- same key across tenants creates separate incidents;
- transaction rollback leaves no partial incident/key/event;
- response-lost simulation retries safely.

## What You May Not Do

- Generate new server key when required header is missing
- Trust tenant ID from request body
- Use only in-memory map
- Use SELECT pre-check without database uniqueness
- Create incident before key claim
- Publish queue event directly in handler
- Replay same key when request hash differs
- Change tests

## Submission — GitHub PR

Push branch `idempotent-incidents` to your fork and open a pull request into your fork's `main` branch. Submit that pull-request URL.

The PR must include schema changes, handler implementation, README decisions, and passing test output. Do not submit a PDF, repository homepage, branch URL, or commit URL.
