
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Create Users
  const [user1] = await db.insert(schema.users).values({
    name: "Yussuf Hersi",
    email: "hersi@nextdeploy.one",
    image: "https://picsum.photos/200",
  }).returning();

  // 2. Create Team
  const [team1] = await db.insert(schema.teams).values({
    name: "NextDeploy Core Team",
    ownerId: user1.id,
  }).returning();

  // 3. Add user to team
  await db.insert(schema.teamMembers).values({
    userId: user1.id,
    teamId: team1.id,
    role: "owner",
  });

  // 4. Create Account & Link
  const [account1] = await db.insert(schema.accounts).values({
    provider: "github",
    providerAccountId: "aynaash",
    type: "oauth",
  }).returning();

  await db.insert(schema.userAccounts).values({
    userId: user1.id,
    accountId: account1.id,
  });

  // 5. Session for the user
  await db.insert(schema.sessions).values({
    sessionToken: "sess_123456",
    userId: user1.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  });

  // 6. API Key
  await db.insert(schema.apiKeys).values({
    key: "api_12345678",
    userId: user1.id,
    projectId: null,
  });

  // 7. Project
  const [project1] = await db.insert(schema.projects).values({
    name: "NextDeploy Demo",
    description: "Seeded project",
    ownerId: user1.id,
    teamId: team1.id,
  }).returning();

  // 8. Deployment
  const [deployment1] = await db.insert(schema.deployments).values({
    url: "https://nextdeploy.one",
    status: "success",
    projectId: project1.id,
    createdAt: new Date(),
  }).returning();

  // 9. Metrics for that deployment
  await db.insert(schema.metrics).values({
    deploymentId: deployment1.id,
    cpuUsage: 0.12,
    memoryUsage: 204,
    requestCount: 12,
    createdAt: new Date(),
  });

  // 10. Billing
  await db.insert(schema.billings).values({
    userId: user1.id,
    amount: 20,
    status: "paid",
    createdAt: new Date(),
  });

  console.log("✅ Seed complete!");
  await client.end();
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
