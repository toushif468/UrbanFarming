# API Response Control & Performance Strategy

## 1. Standardized Response Structure
Every API endpoint returns a consistent JSON format:

{
  "success": true | false,
  "message": "Human readable message",
  "data": { } | [ ] | null
}

This makes client-side handling predictable and debuggable.

## 2. HTTP Status Codes Used
| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Resource created |
| 400  | Bad request / invalid input |
| 401  | Unauthorized / invalid token |
| 403  | Forbidden / insufficient role |
| 404  | Resource not found |
| 409  | Conflict / duplicate resource |
| 500  | Internal server error |

## 3. Pagination
All list endpoints accept `page` and `limit` query parameters.
Default: page=1, limit=10.
Response always includes:
  - total: total number of records
  - page: current page
  - limit: records per page
  - totalPages: total number of pages

## 4. Performance Strategies

### Parallel Queries
List endpoints use Promise.all() to run data fetch and 
count queries simultaneously instead of sequentially,
cutting response time roughly in half.

### Selective Fields
Prisma queries use `select` to return only required fields,
reducing payload size and database load.

### Database Relations
Prisma `include` is used instead of multiple separate queries
when joining related data (e.g. orders with produce details).

## 5. Security
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 7 days
- Rate limiting on auth routes: 10 requests per 15 minutes
- Role-based access control on all protected routes
- Admin cannot be deleted or suspended via API