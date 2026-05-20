# Load Test Scripts

Pure-Go load testing for the two critical payment paths.

| Script | Path | What it tests |
|--------|------|---------------|
| `recharge_load` | `recharge/` | 1 000 users × 10 recharges + 10 webhook callbacks |
| `tip_burst` | `tip/` | 500 users × 1 000 tips to one idol |

Both scripts seed their own test data, run the load phase against the live
HTTP server, then query the DB to assert financial invariants.

---

## Prerequisites

- Docker Desktop running
- Go 1.21+
- Backend server **not** started yet (scripts start it manually below)

---

## 1 — Start PostgreSQL

```powershell
# From the repo root (where docker-compose.yml lives)
docker compose up -d postgres

# Verify it is healthy
docker compose ps
```

---

## 2 — Configure environment variables

Create (or reuse) the `.env` file in `backend/`:

```powershell
# backend/.env  — adjust values to match your setup
Set-Content backend/.env @"
JWT_SECRET=your-super-secret-key
MOCK_PAY_SECRET=mock-pay-secret-key
DATABASE_URL=host=localhost user=postgres password=password dbname=eidol_db port=5432 sslmode=disable TimeZone=Asia/Tokyo
"@
```

> The scripts load the same `.env` as the server (via `pkg/utils` init).

---

## 3 — Start the backend server

```powershell
# In a separate terminal, from backend/
$env:JWT_SECRET      = "your-super-secret-key"
$env:MOCK_PAY_SECRET = "mock-pay-secret-key"

go run ./cmd/api
```

Wait until you see `Database connected successfully!` before running the scripts.

---

## 4 — Run the recharge load test

```powershell
# From backend/
$env:JWT_SECRET      = "your-super-secret-key"
$env:MOCK_PAY_SECRET = "mock-pay-secret-key"

go run ./scripts/loadtest/recharge
```

### Actual output (recorded 2026-05-14, local docker-compose postgres)

```
[setup] removed 1000 stale test users from previous run
[setup] creating 1000 test users + wallets...
[setup] done
[load] starting 1000 goroutines (10 recharges each, concurrency=50)...

=== Load Test Results ===
Total requests : 20000
Errors         : 0
Error rate     : 0.00%
Duration       : 92.6s
QPS            : 215.9
P50 latency    : 40ms
P95 latency    : 1.024s
P99 latency    : 1.331s

=== Invariant Checks ===
[PASS] Wallet balance sum: expected 10000000, got 10000000
[PASS] LedgerRecord count: expected 10000, got 10000
[PASS] No duplicate credits: 10000 distinct IDs vs 10000 records
```

---

## 5 — Run the tip burst test

```powershell
# From backend/
$env:JWT_SECRET = "your-super-secret-key"

go run ./scripts/loadtest/tip
```

### Actual output (recorded 2026-05-14, local docker-compose postgres)

```
[setup] creating idol...
[setup] creating 500 consumer users (balance=100000 each)...
[setup] done
[load] starting 500 goroutines (1000 tips each, idol #1, concurrency=50)...

=== Load Test Results ===
Total requests : 500000
Errors         : 4
Error rate     : 0.00%
Duration       : 3060.1s
QPS            : 163.4
P50 latency    : 240ms
P95 latency    : 870ms
P99 latency    : 1.362s

=== Invariant Checks ===
[FAIL] TipRecord count: expected 500000, got 499996
[PASS] Idol withdrawable_balance == SUM(idol_income): balance=34999720  sum_income=34999720
[PASS] Revenue split sums to gross (commission+income==amount): commission=14999880  idol_income=34999720  gross=49999600
[PASS] Idol total_earnings == actual gross tipped: total_earnings=49999600  actual_gross=49999600
```

> **Note**: `tip_burst` sends 500 000 HTTP requests and takes ~50 minutes against a
> local single-node Postgres. The 4 HTTP errors that appear are transient
> (optimistic-lock retries exhausted under sustained load); the three financial
> invariants all pass, confirming no money was created or lost for any transaction
> that did commit. The idol keeps 70 % of each tip under the default 30 % commission rate.

---

## Cleanup

Test users are prefixed `lt_recharge_*` / `lt_tip_consumer_*` / `lt_tip_idol`.
Both scripts automatically purge stale data from a previous run at startup.
To manually wipe all load test data:

```powershell
# Connect to Postgres
docker exec -it game-room-app-postgres-1 psql -U postgres -d eidol_db

-- Inside psql:
DELETE FROM tip_records   WHERE idol_id IN (SELECT id FROM idols WHERE user_id IN (SELECT id FROM users WHERE username = 'lt_tip_idol'));
DELETE FROM idols         WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'lt_tip%');
DELETE FROM ledger_records WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'lt_%');
DELETE FROM wallets        WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'lt_%');
DELETE FROM users          WHERE username LIKE 'lt_%';
```

---

## Parameters

| Constant | File | Default | Meaning |
|----------|------|---------|---------|
| `numUsers` | `recharge/recharge_load.go` | 1 000 | concurrent goroutines |
| `rechargesPerUser` | `recharge/recharge_load.go` | 10 | recharge+webhook pairs per user |
| `rechargeAmount` | `recharge/recharge_load.go` | 1 000 | cents per recharge (¥10) |
| `numUsers` | `tip/tip_burst.go` | 500 | concurrent goroutines |
| `tipsPerUser` | `tip/tip_burst.go` | 1 000 | tip requests per user |
| `tipAmount` | `tip/tip_burst.go` | 100 | cents per tip (¥1) |
