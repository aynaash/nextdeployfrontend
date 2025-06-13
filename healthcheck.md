
Here’s how to build a **robust health check endpoint** for a Next.js app running in Docker, with production-level discipline:
Here’s how to build a **robust health check endpoint** for a Next.js app running in Docker, with production-level discipline:

---

## 🧠 Purpose of Health Check

Don’t be sloppy here. The health check is not just “is the server up?”—it’s **“is the app operational and ready to serve traffic?”**

A proper health check should:

1. Confirm the server is responding (`200 OK`)
2. Optionally verify connection to DBs or external services
3. Be **cheap** to execute
4. Not cache responses (disable CDN or proxy caching)
5. Be **readable** for humans and **parsable** for automation

---

## ✅ Step-by-Step Setup

### 1. **Create a Custom API Route for Health Check**

In `pages/api/health.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type HealthResponse = {
  status: 'ok'
  uptime: number
  timestamp: string
  info: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  res.setHeader('Cache-Control', 'no-store')

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    info: 'Next.js app is healthy',
  }) 
}
```

### 2. **Include This in Your Docker Healthcheck**

In your `Dockerfile`:

```Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

This means Docker will ping the `/api/health` every 30 seconds after the container starts. If it fails 3 times, the container is marked unhealthy.

---

## 🔒 Optional: Add DB or External Checks

If your Next.js app connects to a DB, add a real check:

```ts
// pages/api/health.ts

import { db } from '@/lib/db' // Adjust to your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db.raw('SELECT 1') // or equivalent ping
  } catch (err) {
    return res.status(500).json({ status: 'fail', error: 'DB unreachable' })
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    info: 'App and DB healthy',
  })
}
```

But **don’t abuse it**—keep this endpoint fast and lightweight. If your app depends on more services (cache, queue, S3, etc.), you can check them **periodically in a background job** and just return the last known status here.

---

## 🧪 Test It

Make sure it works from inside the container:

```bash
docker exec -it your_container_name curl http://localhost:3000/api/health
```

---

## 🧱 Production Suggestions

1. **Separate Readiness and Liveness Probes**

   * `api/liveness`: Just check the server is up
   * `api/readiness`: Check dependencies like DB, Redis, etc.
2. **Return a 5xx if something breaks**, or your orchestrator (K8s, Docker, ECS) won’t restart the container.
3. **Log failures** in a persistent store if you're running on a platform like Fly, Render, or your own VPS.

---

## 🧨 Mistakes to Avoid

* 💩 Using the root `/` as your health check endpoint.
* 🧠 Forgetting to disable caching.
* 🪦 Letting your health check depend on expensive or unstable services.
* 🫥 Returning `200 OK` even when a core dependency (DB, cache) is broken.

---

## TL;DR Boilerplate

```ts
// pages/api/health.ts
export default function handler(_, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
```

```Dockerfile
HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1
```

---

If you want to take it further, I can help you wire this into a full **NextDeploy observability system** where the daemon watches these health endpoints, reports metrics, and restarts containers when something breaks.

Let me know how deep you want to go.

---

## 🧠 Purpose of Health Check

Don’t be sloppy here. The health check is not just “is the server up?”—it’s **“is the app operational and ready to serve traffic?”**

A proper health check should:

1. Confirm the server is responding (`200 OK`)
2. Optionally verify connection to DBs or external services
3. Be **cheap** to execute
4. Not cache responses (disable CDN or proxy caching)
5. Be **readable** for humans and **parsable** for automation

---

## ✅ Step-by-Step Setup

### 1. **Create a Custom API Route for Health Check**

In `pages/api/health.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type HealthResponse = {
  status: 'ok'
  uptime: number
  timestamp: string
  info: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  res.setHeader('Cache-Control', 'no-store')

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    info: 'Next.js app is healthy',
  })
}
```

### 2. **Include This in Your Docker Healthcheck**

In your `Dockerfile`:

```Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

This means Docker will ping the `/api/health` every 30 seconds after the container starts. If it fails 3 times, the container is marked unhealthy.

---

## 🔒 Optional: Add DB or External Checks

If your Next.js app connects to a DB, add a real check:

```ts
// pages/api/health.ts

import { db } from '@/lib/db' // Adjust to your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db.raw('SELECT 1') // or equivalent ping
  } catch (err) {
    return res.status(500).json({ status: 'fail', error: 'DB unreachable' })
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    info: 'App and DB healthy',
  })
}
```

But **don’t abuse it**—keep this endpoint fast and lightweight. If your app depends on more services (cache, queue, S3, etc.), you can check them **periodically in a background job** and just return the last known status here.

---

## 🧪 Test It

Make sure it works from inside the container:

```bash
docker exec -it your_container_name curl http://localhost:3000/api/health
```

---

## 🧱 Production Suggestions

1. **Separate Readiness and Liveness Probes**

   * `api/liveness`: Just check the server is up
   * `api/readiness`: Check dependencies like DB, Redis, etc.
2. **Return a 5xx if something breaks**, or your orchestrator (K8s, Docker, ECS) won’t restart the container.
3. **Log failures** in a persistent store if you're running on a platform like Fly, Render, or your own VPS.

---

## 🧨 Mistakes to Avoid

* 💩 Using the root `/` as your health check endpoint.
* 🧠 Forgetting to disable caching.
* 🪦 Letting your health check depend on expensive or unstable services.
* 🫥 Returning `200 OK` even when a core dependency (DB, cache) is broken.

---

## TL;DR Boilerplate

```ts
// pages/api/health.ts
export default function handler(_, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
```

```Dockerfile
HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1
```

---

If you want to take it further, I can help you wire this into a full **NextDeploy observability system** where the daemon watches these health endpoints, reports metrics, and restarts containers when something breaks.

Let me know how deep you want to go.



As your application grows, ensuring it remains operational is crucial. Let's explore how you can add a health check endpoint to your Next.js app, providing you with peace of mind and proactive monitoring capabilities.

Why would we need a health check endpoint?
Creating a health check endpoint is straightforward and doesn't require extensive technical expertise. By monitoring this endpoint, you can receive timely alerts when your application encounters issues.

Key reasons for implementing a health check endpoint include:
SLA (Service Level Agreement) — You're often obligated to maintain a specific uptime percentage as outlined in your SLA.
Financial Impact — Downtime can translate to substantial financial losses, especially in certain industries where even a minute of outage can be costly.
Reputation Management — Frequent downtime incidents can severely damage your business's reputation and erode customer trust.
Code
Create a new file called health.js in your pages/api directory:

Code
export default function handler(req, res) {
  res.status(200).json({ status: 'OK' });
}

This creates a simple endpoint that returns a 200 status code with a JSON response indicating your app is healthy.

Let's enhance this further by providing more detailed information:

Code
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

If your app uses a database (like Prisma), you can add a connectivity check:

Code
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message,
    });
  }
}

For additional security, you might want to add basic authentication:

Code
export default function handler(req, res) {
  if (req.headers['x-api-key'] !== process.env.HEALTHCHECK_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

Automate the checks
With your new health check endpoint in place, you can now proactively monitor your application's status and receive timely alerts when issues arise. To effectively track uptime, response time, and receive prompt notifications of any failures, consider using a dedicated uptime monitoring service like Hyperping. Create an account, and you'll be guided through the process of setting up your first monitor.



By simply adding your new health check endpoint to Hyperping, you can continuously monitor its availability without any complex configuration. After a few minutes, you'll gain valuable insights into your application's uptime and response time across various geographic regions (London, Amsterdam, Toronto, San Francisco, and more), along with historical data.

Furthermore, Hyperping seamlessly integrates with popular alerting tools like Slack, PagerDuty, and SMS, allowing you to notify your team instantly of any detected issues.

Conclusion
Setting up a health check endpoint in your Next.js application is a straightforward process that provides invaluable peace of mind. By proactively monitoring your application's health, you can ensure greater stability and reliability.

Start monitoring your Next.js application with Hyperping and get 14 days of free monitoring to ensure your application stays healthy and available.
