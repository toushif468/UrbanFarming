# API Benchmark Report

**Tool:** autocannon  
**Config:** 10 concurrent connections, 5 seconds duration  
**Environment:** Local development (Node.js v24, PostgreSQL, Express v5)  
**Date:** April 18, 2026

---

## Results

### 1. GET /api/produce (Public - Paginated Marketplace)

| Stat       | 2.5%   | 50%    | 97.5%  | 99%   | Avg      | Stdev   | Max    |
|------------|--------|--------|--------|-------|----------|---------|--------|
| Latency    | 3 ms   | 4 ms   | 8 ms   | 9 ms  | 4.27 ms  | 4.95 ms | 232 ms |

| Stat       | 1%     | 2.5%   | 50%     | 97.5%   | Avg       | Stdev  | Min    |
|------------|--------|--------|---------|---------|-----------|--------|--------|
| Req/Sec    | 1,628  | 1,628  | 2,147   | 2,311   | 2,078.81  | 237.3  | 1,628  |
| Bytes/Sec  | 3.9 MB | 3.9 MB | 5.14 MB | 5.54 MB | 4.98 MB   | 569 kB | 3.9 MB |

**Summary:** 10,000 requests in 5.03s — 24.9 MB read  
**Verdict:** ✅ Excellent. Avg latency 4.27ms, ~2,078 req/sec throughput.

---

### 2. GET /api/forum (Public - Paginated Community Posts)

| Stat       | 2.5%   | 50%   | 97.5% | 99%   | Avg      | Stdev   | Max    |
|------------|--------|-------|-------|-------|----------|---------|--------|
| Latency    | 4 ms   | 6 ms  | 22 ms | 32 ms | 8.06 ms  | 6.33 ms | 105 ms |

| Stat       | 1%      | 2.5%    | 50%     | 97.5%   | Avg       | Stdev   | Min     |
|------------|---------|---------|---------|---------|-----------|---------|---------|
| Req/Sec    | 714     | 714     | 1,203   | 1,896   | 1,184.41  | 403.15  | 714     |
| Bytes/Sec  | 2.36 MB | 2.36 MB | 3.98 MB | 6.26 MB | 3.91 MB   | 1.33 MB | 2.36 MB |

**Summary:** 6,000 requests in 5.1s — 19.6 MB read  
**Verdict:** ✅ Good. Higher latency than produce due to user JOIN query (includes user name + role). Still well within acceptable range.

---

### 3. GET /api/rentals (Public - Paginated Rental Spaces)

| Stat       | 2.5%   | 50%   | 97.5% | 99%   | Avg     | Stdev   | Max   |
|------------|--------|-------|-------|-------|---------|---------|-------|
| Latency    | 3 ms   | 4 ms  | 7 ms  | 11 ms | 4.2 ms  | 1.56 ms | 25 ms |

| Stat       | 1%      | 2.5%    | 50%     | 97.5%   | Avg      | Stdev  | Min     |
|------------|---------|---------|---------|---------|----------|--------|---------|
| Req/Sec    | 2,010   | 2,010   | 2,045   | 2,303   | 2,113.4  | 108.45 | 2,010   |
| Bytes/Sec  | 3.23 MB | 3.23 MB | 3.28 MB | 3.69 MB | 3.39 MB  | 174 kB | 3.22 MB |

**Summary:** 11,000 requests in 5.03s — 16.9 MB read  
**Verdict:** ✅ Excellent. Most consistent endpoint. Low stdev (1.56ms) shows stable performance.

---

## Comparison Summary

| Endpoint        | Avg Latency | Avg Req/Sec | Total Requests | Notes                        |
|-----------------|-------------|-------------|----------------|------------------------------|
| GET /api/produce | 4.27 ms    | 2,078       | 10,000         | Highest throughput           |
| GET /api/forum   | 8.06 ms    | 1,184       | 6,000          | Slower due to JOIN with User |
| GET /api/rentals | 4.20 ms    | 2,113       | 11,000         | Most stable, lowest stdev    |

---

## Performance Strategy Applied

### 1. Pagination
All list endpoints use `skip/take` to avoid loading entire 
tables into memory. Default page size is 10 records, keeping 
response payloads small and query times consistent.

### 2. Parallel Queries with Promise.all()
List endpoints run the data query and count query simultaneously:
```javascript
const [data, total] = await Promise.all([
    prisma.model.findMany({ skip, take: limit }),
    prisma.model.count()
])
```
This cuts response time roughly in half compared to sequential queries.

### 3. Selective Fields with Prisma select
Only required fields are returned from the database:
```javascript
include: {
    user: { select: { name: true, email: true } }
}
```
This reduces both payload size and database load.

### 4. Rate Limiting on Auth Routes
Auth routes are protected with express-rate-limit:
- Window: 15 minutes
- Max requests: 10 per window
This prevents brute force attacks on login/register endpoints.

### 5. Standardized Error Handling
A global error handler middleware catches unhandled errors,
preventing server crashes and ensuring consistent error responses.

---

## Conclusion

All three public endpoints perform well under load with average 
latencies under 10ms and throughput exceeding 1,000 req/sec. 
The forum endpoint is slightly slower due to relational JOIN queries 
but remains well within acceptable performance thresholds for a 
production API. No bottlenecks were identified during testing.