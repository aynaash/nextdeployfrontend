# 🎨 Contributing to the NextDeploy Frontend

## Welcome, Frontend Engineer.

Thanks for checking out the frontend of **NextDeploy** — a real-world, production-first frontend built entirely with **Next.js**, for **Next.js**.

This isn’t a marketing page.  
This isn’t a UI playground.  
This is the testbed and flagship frontend that powers, validates, and **battle-tests** the entire NextDeploy engine.

We’re using it to deploy real apps. And we’re building it to make sure **every Next.js feature** works in production under extreme conditions.

---

## 🚩 What This Frontend _Is_

The NextDeploy frontend is:

- A **developer-facing dashboard** for managing deployments
- A **landing and documentation site** for the public
- A **Next.js feature stress-test harness** — built to push the limits of:
  - SSR (Server-side rendering)
  - ISR (Incremental Static Regeneration)
  - Middleware
  - Dynamic routing
  - API routes
  - Auth flows
  - Image optimization
  - Streaming and Edge Functions
  - Env var injection
  - Tailwind, SEO, and custom headers

> Think of it like the “Rails blog app” — but for testing and proving _NextDeploy_ in production environments.

---

## ✅ What We Want From Contributors

We’re looking for frontend engineers who:

- Know Next.js deeply (or want to learn through real-world pressure)
- Care about **DX** (developer experience), performance, and architecture
- Want to improve or extend real product features (dashboards, logs, billing, etc.)
- Want to test and validate edge-case Next.js features in a production context
- Want to help us build the **canonical example** of a deployable, self-hosted Next.js app

You can contribute by:

- Implementing or stress-testing key Next.js features (see list below)
- Adding smart UI features to the dashboard
- Improving error handling, 404s, fallback rendering, etc.
- Extending SSR/ISR edge cases to catch daemon bugs
- Writing clean, minimal, maintainable UI components
- Improving responsive design, accessibility, and load speed

---

## 🧱 Tech Stack

The frontend uses:

- **Next.js (App Router + SSR + API routes)**
- **TailwindCSS** for styling
- **Prisma + PostgreSQL** (optional for internal apps)
- **BetterAuth** or custom auth layer (TBD)
- **React Server Components** and streaming support
- **Deployed via NextDeploy**

---

## 🧪 Feature Test Coverage Goals

The frontend should include real usage of:

| Feature                  | Implemented      | Priority |
| ------------------------ | ---------------- | -------- |
| SSR                      | ✅               | High     |
| ISR                      | ✅               | High     |
| Streaming Routes         | ⚠️ partial       | Medium   |
| Middleware (`/auth`)     | ✅               | High     |
| API Routes (`/api/logs`) | ✅               | High     |
| App Router w/ Layouts    | ✅               | High     |
| Static Assets            | ✅               | High     |
| Image Optimization       | ⚠️ needs testing | Medium   |
| Head Injection (SEO)     | ✅               | Medium   |
| Custom Headers           | ⚠️ pending       | Medium   |
| Dynamic Route Params     | ✅               | High     |
| Edge Functions           | ❌               | Optional |
| Websockets / Live Logs   | ⚠️ partial       | High     |

If it’s a Next.js feature that can break deployment — we want it in here.

---

## 🛠️ PR Guidelines

Before submitting your pull request:

- [ ] Ensure your feature aligns with Next.js and helps verify a production edge case
- [ ] Keep components modular and composable
- [ ] Avoid adding runtime third-party dependencies without clear value
- [ ] Test for deployment behavior (SSR/ISR still works after change?)
- [ ] Document anything non-obvious in code or in the PR

---

## 🌱 First Steps for New Contributors

- [x] Clone the frontend repo and run it locally with `pnpm dev`
- [x] Explore the structure — layouts, pages, API routes
- [x] Try changing `next.config.js` and testing its effect on deploy
- [x] Test SSR and ISR pages manually via the CLI + VPS
- [x] Join an issue, or suggest a new test case based on your own Next.js experience

---

## 🧠 Design Philosophy

### 1. **This Is a Real App**

It’s not a dummy. We deploy this frontend with our own engine. If you break something — we’ll know. Fast.

### 2. **Performance Is a Feature**

We’re not bloated. No random UI libraries. No waste.  
Minimal CSS, fast loads, and **clear SSR boundaries**.

### 3. **Dogfooding > Theory**

If a feature can’t be deployed cleanly with NextDeploy, we want to know now — not after launch. The frontend **must hurt the backend if it’s weak**.

### 4. **Simple Is Scalable**

We write minimal code, with clear structure. No tech debt. This frontend should be forkable, understandable, and deployable by junior devs too.

---

## 🤝 Let’s Build the Frontend That Stress-Tests the Platform

This frontend is part of something bigger than a UI.  
It’s a key layer in the NextDeploy stack — and we’re using it to build the most developer-first deployment ecosystem in the world.

If you're passionate about:

- Next.js
- Developer tools
- Self-hosted infrastructure
- Clean, scalable frontends
- Simplicity over ceremony

...then you're one of us. Open an issue. Fork the repo. Submit a PR. Let’s build this right.

— **The NextDeploy Frontend Team** _(just me — for now)_
