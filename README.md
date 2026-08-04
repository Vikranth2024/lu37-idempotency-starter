# Idempotency PR Assignment

1. Fork starter repository to your GitHub account:

   https://github.com/Vikranth2024/lu37-idempotency-starter

2. Clone your fork and create branch:

```bash
git clone https://github.com/<your-username>/lu37-idempotency-starter.git
cd lu37-idempotency-starter
git checkout -b idempotent-incidents
docker compose up -d
npm install
npm run db:reset
npm test
```

3. Implement schema and handler, update README decisions, and make all supplied tests pass.

4. Push branch and open pull request into your fork's `main` branch:

```bash
git add .
git commit -m "Implement duplicate-safe incident creation"
git push -u origin idempotent-incidents
```

5. Submit pull-request URL. Repository homepage, branch, commit, and PDF links are not accepted.
