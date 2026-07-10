# URL Shortener API

A production-grade URL shortener API built with NestJS, MongoDB, and Redis. Features dual authentication, atomic transactions, TTL-based link expiration, click tracking, Redis caching, and JWT-protected routes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| Authentication | Passport.js, JWT |
| Validation | class-validator, class-transformer |
| Config | @nestjs/config, Joi |
| Security | Helmet, @nestjs/throttler |
| Queue | BullMQ |
| Docs | Swagger/OpenAPI |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)

### Installation

```bash
git clone https://github.com/Willy0la/url-shortener.git
cd url-shortener
npm install
```

### Environment Variables

Create a `.env.development.local` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DB=your_mongodb_connection_string
SECRET=your_jwt_secret
TTL=7d
CLIENT_URL=http://localhost:3000
THROTTLE_TTL=60000
THROTTLE_LIMIT=5
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Running the App

```bash
# development
npm run start:dev

# production
npm run start:prod
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create a new user account | None |
| POST | `/auth/login` | Login with password or PIN | None |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users/me` | Get current user profile | Required |

### URL Shortener

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/url-short/shorten` | Create a short URL | Required |
| GET | `/:code` | Redirect to original URL | None |

Swagger docs available at `http://localhost:5000/api` in development.

---

## Key Design Decisions

**Dual Authentication — Password and PIN**
Users can login with either a password or a PIN. A custom `AtLeastOneOf` class-validator decorator enforces that exactly one must be present. A `NotBothPasswordAndPin` constraint prevents sending both simultaneously. Both are hashed independently with bcrypt using separate salt rounds to ensure complete independence between the two hashes.

**Atomic Transactions**
User creation uses MongoDB sessions via `withTransaction`  if any operation fails, everything rolls back. No orphan documents.

**Confirm Password and PIN Validation**
A reusable `MatchField` validator constraint ensures `confirmPassword` matches `password` and `confirmPinCode` matches `pinCode` at the DTO level before the request reaches the service.

**Account Lockout + Rate Limiting**
Two independent layers protect the login endpoint. Rate limiting blocks excessive requests per IP 3 attempts per minute. Account lockout blocks a specific account after 5 failed attempts for 15 minutes. A pre-save hook on the User schema automatically resets expired locks on every `.save()` call no cron job needed.

**TTL Index for Auto-Expiring Links**
Short links support optional expiry dates. MongoDB's TTL index automatically deletes expired documents in the background  no cleanup code needed. The pre-save hook on the URL schema keeps `isActive` in sync with `expiresAt`.

**Redis Caching**

Redis is a virtual in-memory cache used to optimise the performance of the database by storing the most frequently requested data. Rather than hitting MongoDB on every redirect request, the result is stored in Redis after the first lookup. Subsequent requests are served directly from Redis  significantly faster than a database query. Redis performs the same CRUD operations as the database but in memory, making reads near-instant. Cache keys are namespaced per short code (`url:{shortCode}`) and expire automatically via TTL  keeping the cache consistent without manual invalidation.

**IDOR Protection**
Protected routes extract the user ID from the JWT token via `req.user.id` rather than accepting it as a URL parameter. This prevents Insecure Direct Object Reference attacks where users could access other users' data by changing the ID in the URL.

**Helmet with Custom CSP**
Helmet adds 14 security HTTP headers to every response. The Content Security Policy is configured to allow Swagger UI assets from jsdelivr while blocking everything else.

**CORS from Environment**
The allowed origin is configured via `CLIENT_URL` environment variable  no code changes needed when switching between environments.

**Swagger Disabled in Production**
API documentation is only available in development to avoid exposing endpoint structure to attackers.

---

## Planned Improvements

- BullMQ queue for welcome emails and link expiration notifications
- Password reset flow with Nodemailer
- `GET /url-short/my-links` with Redis caching per user
- Update and delete link endpoints
- Docker + docker-compose
- Jest unit and E2E tests
- Deploy to Render