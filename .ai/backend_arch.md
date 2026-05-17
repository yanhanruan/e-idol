# Backend Architecture & Coding Standards (Go Backend Development Standards)

## 1. Core Technology Stack
- **Web Framework**: Gin (`github.com/gin-gonic/gin`)
- **ORM**: GORM (`gorm.io/gorm`)
- **Database**: PostgreSQL

## 2. Directory Responsibilities & Code Boundaries
When writing or modifying backend code, the following directory responsibilities must be strictly followed. **Cross-layer contamination is strictly prohibited.**

- **`cmd/api/`**: Entry point.
  - Responsible only for initializing configuration, connecting to the database, registering routes, and starting the server in `main.go`.
  - Business logic is prohibited in this layer.

- **`internal/models/`**: Data model layer.
  - Contains only GORM struct definitions and database table mappings.
  - Importing Gin-related packages is prohibited.

- **`internal/database/`**: Database connection layer.
  - Responsible for PostgreSQL initialization and singleton database management.

- **`internal/handlers/`**: HTTP controller layer.
  - **Responsibilities**:
    - Parse request parameters (`BindJSON` / `BindQuery`)
    - Invoke business logic
    - Return standardized JSON responses
  - **Rules**:
    - Complex business logic and large database queries should be extracted whenever possible to keep handlers clean and maintainable.

- **`internal/routes/`**: Routing layer.
  - Responsible only for binding URL paths to specific functions in `handlers`.

- **`internal/services/`**: Business logic layer.
  - One service struct per domain (`WalletService`, `VipService`, `TipService`, `IdolService`).
  - All DB queries and business rules live here. Gin imports are prohibited.
  - Package-private helpers (e.g. `applyTransactionTx(tx *gorm.DB, ...)`) may be shared across services within the package to participate in an outer transaction without nesting.

- **`internal/jobs/`**: Background scheduled tasks.
  - One job struct per domain with a `Run()` method.
  - Each domain registers jobs via a `Start*Scheduler(db *gorm.DB)` function using `robfig/cron/v3`.

- **`internal/websocket/`**: WebSocket-specific logic.
  - Handles persistent connections, message broadcasting, and heartbeat keep-alive mechanisms.

- **`pkg/middleware/`**: Gin middleware.
  - Stores interceptor logic such as authentication (Auth), CORS handling, and request logging.

- **`pkg/utils/`**: Common utility functions.
  - Contains pure utility functions unrelated to specific business logic (e.g., password hashing, JWT generation, string processing).

## 3. Standard API Response Format
**All HTTP responses (whether success or failure) must strictly follow the JSON structure below.**
Returning raw strings or non-standard response structures is strictly prohibited.

```go
// Standard response structure (should be encapsulated and reused consistently)
type Response struct {
    Code    int         `json:"code"`    // Business status code (200 for success, others for errors)
    Message string      `json:"message"` // Response message
    Data    interface{} `json:"data"`    // Actual payload (null or empty object when no data exists)
}
```

**Error handling pattern:**
- Declare sentinel errors as package-level `var` in `services/errors.go`.
- Map each sentinel to `{HTTPStatus, BizCode, message}` in `pkg/utils/response.go` (`errorCodeMap`).
- Handlers call `utils.FailWithError(c, err)`; unknown errors map to HTTP 500 / biz code 5000.

## 4. Financial & Concurrency Conventions

| Rule | Constraint |
|------|------------|
| Monetary values | `int64` cents. `float64` is banned on all financial paths. |
| Rates (commission, discount) | `int` basis points (0–10000). e.g. `3000` = 30 %. |
| High-frequency writes | Optimistic locking: `version` field incremented on every update; up to 3 retries with random jitter. |
| Low-frequency writes (admin, webhook) | Pessimistic locking: `SELECT … FOR UPDATE`. Do not use on hot paths. |
| Transaction composition | Service methods that participate in an outer transaction accept `tx *gorm.DB` as a parameter and must not open nested transactions. |
| Idempotency | Every fund-moving operation requires a caller-supplied UUID `TransactionID`; enforced by a `UNIQUE` index on `ledger_records.transaction_id`. |
| Atomic balance updates | Use `gorm.Expr("col + ?", delta)` for increment/decrement. Read-modify-write on balance fields is prohibited. |
