# Fireline Idempotency

## Run

```bash
docker compose up -d
npm install
npm run db:reset
npm test
```

Default database URL: `postgres://postgres:postgres@localhost:54329/fireline`. Override with `DATABASE_URL`.

## Task

Implement schema and `src/incidents.js` from `ASSIGNMENT.md`. Do not edit tests. Starter intentionally fails tests.
