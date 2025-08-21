# Titan

Next.js 15 fullstack template with better-auth for authentication and drizzle-orm as the ORM.

![Titan](./public/og.png)

> [!WARNING]
> This project uses Next.js 15-canary to support node runtime on middleware. This is not yet supported in stable version.

## Tech Stack

- Full-stack framework: Next.js 15-canary
- UI: Tailwind CSS v4
- Component library: Shadcn UI
- Authentication: better-auth
- Database: postgres
- ORM: drizzle-orm

## Features

- Authentication
  - Social login
    - Google
    - Github
    - Discord
- Database
  - Postgres (Neon)
  - ORM: drizzle-orm
- Next.js API, server actions, and middleware

## Getting Started

Clone the repository

```bash
git clone https://github.com/rudrodip/titan.git
```

Install dependencies

```bash
bun install
```

Create environment file

```bash
cp .env.example .env
```

Provide environment variables in `.env` file

- `BETTER_AUTH_SECRET`: Secret key for Better Auth authentication generate one [here](https://www.better-auth.com/docs/installation#set-environment-variables)
- `BETTER_AUTH_URL`: Better Auth URL (e.g., `http://localhost:3000`)
- `DATABASE_URL`: PostgreSQL connection string provided from Neon (e.g., `postgresql://username:password@neon:5432/titan`)

Generate database schema

```bash
bun run db:generate
```

Migrate database

```bash
bun run db:migrate
```

Run the development server

```bash
bun dev
```

Open the browser and navigate to `http://localhost:3000`

## Using a Local Database

Have Docker installed on your system. Before running the db:generate command from Getting Started, run the following command in the project directory to start a local database:

```bash
docker-compose up -d
```

Use the following environment variables in `.env` file:
- `DATABASE_URL`: `postgres://postgres:postgres@localhost:5432/titan`

Add the `pg` and `@types/pg` dependencies to your project:

```bash
bun add pg
bun add -D @types/pg
```

Then, change the `/src/lib/db/index.ts` file to use the `drizzle-orm/node-postgres` and `pg` package instead of `@neondatabase/serverless`:

```typescript
import * as schema from "@/lib/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const sql = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(sql, { schema });
```

Continue steps from Getting Started e.g. generating the database schema, applying migrations, and running the dev server.

Open the browser and navigate to `http://localhost:3000`
