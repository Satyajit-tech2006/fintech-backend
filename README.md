# 🏦 Zorvyn FinTech API

> A production-style backend system for financial data processing with role-based access control, audit logging, and analytical dashboards.

**Base URL:** `http://localhost:5000/api`

## 📌 Assumptions

- The system is designed as a single-tenant corporate financial ledger where multiple roles interact with shared financial data.


## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Viewer, Analyst, and Admin roles. Authorization is enforced at the route level using middleware to ensure strict role-based behavior.
* **Financial Records Management:** Complete CRUD operations with filtering, search, and pagination.
* **Dashboard Analytics:** Database-level aggregations for income, expenses, trends, and category breakdowns.
* **Data Integrity:** Soft deletes with data retention and immutable audit logging wrapped in atomic transactions.
* **Enterprise Security:** JWT authentication with an `HttpOnly` refresh token flow.
* **System Observability:** Request logging with Correlation IDs (Trace IDs) for production debugging.
* **Data Export:** CSV export functionality for financial records.
* **Documentation:** Interactive Swagger API documentation.

## 📂 Project Structure

\`\`\`text
src/
├── controllers/   # Request extraction and response formatting
├── services/      # Core business logic and database interactions
├── routes/        # URL mapping and middleware attachment
├── middlewares/   # Authentication, authorization, rate limiting, traceability
├── validations/   # Zod schema definitions for payload validation
├── utils/         # Helper functions and global error handlers
└── app.js         # Express application setup
prisma/
└── schema.prisma  # PostgreSQL database schema and relationships
\`\`\`

## 🏗 System Architecture

The application strictly follows a **Layered (N-Tier) Architecture** to ensure separation of concerns, making the codebase testable and easy to scale.

* **🌐 Routes:** The entry points. They simply map URLs and HTTP methods to specific controllers and attach necessary security middlewares.
* **🛡️ Middleware:** The gatekeepers. Handles authentication (JWT verification), authorization (RBAC), rate limiting, and system observability (Trace IDs).
* **🚦 Controllers:** The traffic cops. They extract data from requests (`req.body`, `req.params`), pass it to the service layer, and format the HTTP response. *No business logic lives here.*
* **⚙️ Services:** The brain. This is where the core business rules live. Services handle calculations, coordinate database transactions, and enforce domain logic.
* **💾 Database:** The data layer, managed entirely through the PostgreSQL/Prisma ORM.

## 🧠 Important Engineering Decisions

When building a FinTech application, "moving fast and breaking things" is not an option. Here is why specific technologies and patterns were chosen:

* **PostgreSQL over MongoDB:** Financial data is inherently relational. PostgreSQL enforces strict schemas and provides rock-solid ACID compliance, ensuring money and records are never lost or orphaned.
* **Prisma as ORM:** Prisma provides end-to-end type safety. If a database schema changes, Prisma throws errors in the code before it ever reaches production, eliminating an entire class of runtime bugs.
* **Zod for Validation:** Zod validates incoming payloads at the boundary. Malformed data is rejected immediately before it ever touches the business logic or database.
* **Soft Deletes:** Financial records are never `HARD DELETED`. Using a `deletedAt` timestamp ensures historical data is preserved for compliance, analytics, and potential recovery, while removing it from standard API responses.
* **Audit Logs via `$transaction`:** Every modification to a financial record is logged in an `AuditLog` table. This is wrapped in a Prisma `$transaction` so that if the audit log fails to save, the financial change rolls back automatically.
* **Correlation IDs (Traceability):** A custom middleware injects a unique `Trace ID` (`req.id`) into every request. This ID is attached to server logs and error responses, making it trivial to debug specific user issues in a high-traffic environment.
* **Refresh Token Strategy:** Storing access tokens in `localStorage` is vulnerable to XSS. This system issues a short-lived Access Token (15m) and a long-lived Refresh Token (7d) stored securely in an `HttpOnly` cookie that JavaScript cannot read.

## ⚖️ Trade-offs & What Was Excluded

In engineering, what you choose *not* to build is just as important as what you build. To adhere to the principle of "simplicity and correctness over unnecessary complexity," the following patterns were explicitly excluded:

* **Redis / Caching:** While caching dashboard aggregates would speed up response times, it introduces cache-invalidation complexity. Given the current scale, Prisma's native database-level aggregations (`groupBy`, `$aggregate`) are perfectly optimized and guarantee real-time accuracy.
* **Idempotency Keys:** Enforcing idempotency on `POST` requests prevents duplicate transactions if a network drops. However, it requires a distributed storage layer (like Redis) and complex retry logic, which was deemed overkill for this specific assessment.
* **Microservices:** Building this as a monolith reduces deployment friction and infrastructure overhead. Premature optimization into microservices introduces network latency and debugging nightmares that aren't necessary for an MVP.

## 🚀 Setup Instructions

**1. Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd zorvyn-fintech-api
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Environment Configuration**
Create a `.env` file in the root directory. Use the `.env.example` as a template:
\`\`\`env
PORT=5000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
\`\`\`

**4. Database Setup & Seeding**
Push the schema to your Postgres database and run the seed script to generate an initial Admin user and sample financial records.
\`\`\`bash
npx prisma db push
npx prisma db seed
\`\`\`

**5. Run the Server**
\`\`\`bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
\`\`\`

## 📚 API Documentation

Once the server is running, interactive API documentation is available via Swagger. 

Navigate to **`http://localhost:5000/api-docs`** in your browser to view the endpoints, expected payloads, and authorization requirements. 

*(A fully configured Postman Collection `workflow.json` is also included in the repository root for automated end-to-end testing).*