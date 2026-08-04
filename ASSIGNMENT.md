# PR Assignment — Idempotency and Duplicate-Safe Writes

## Scenario

Fireline's `POST /incidents` creates a new incident for every request. If a mobile client retries after a lost response, duplicate incidents can be created.

Starter repository:

https://github.com/kalviumcommunity/idempotency-and-duplicate-safe-writes

## Task

Make `POST /incidents` duplicate-safe.

Your implementation must:

- require one client idempotency key per logical incident;
- scope key using authenticated tenant and operation;
- bind key to canonical request contents;
- atomically prevent sequential and concurrent duplicates;
- replay completed result and reject same key with changed request;
- create incident and one durable paging job in same database transaction.

Use 24-hour exercise expiry, document design decisions in README, and make all 14 supplied tests pass. Do not modify tests.

## Submission

Fork starter repository, create branch `idempotent-incidents`, and open pull request into your fork's `main` branch.

Submit pull-request URL. PR must contain implementation, README updates, and passing test output.
