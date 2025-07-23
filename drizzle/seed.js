import { db } from '../lib/db';
import {
  user,
  account,
  organization,
  team,
  teamMember,
  project,
  projectEnvironment,
  deployment,
  deploymentLog,
  metric,
  plan,
  subscription,
  billing,
  apiKey,
  webhook,
  webhookEvent,
  auditLog,
  twoFactor,
  passkey,
  session,
  verificationToken,
} from './schema/schema';
import { randomUUID } from 'crypto';

// Constants for shared values
const TENANT_ID = 'tenant_123456789';
const DEFAULT_TIMESTAMP = new Date();

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Clear existing data (be careful with this in production!)
  console.log('Clearing existing data...');
  await db.delete(webhookEvent).execute();
  await db.delete(webhook).execute();
  await db.delete(apiKey).execute();
  await db.delete(billing).execute();
  await db.delete(subscription).execute();
  await db.delete(plan).execute();
  await db.delete(metric).execute();
  await db.delete(deploymentLog).execute();
  await db.delete(deployment).execute();
  await db.delete(projectEnvironment).execute();
  await db.delete(project).execute();
  await db.delete(teamMember).execute();
  await db.delete(team).execute();
  await db.delete(organization).execute();
  await db.delete(passkey).execute();
  await db.delete(twoFactor).execute();
  await db.delete(account).execute();
  await db.delete(session).execute();
  await db.delete(verificationToken).execute();
  await db.delete(auditLog).execute();
  await db.delete(user).execute();

  // Insert users
  console.log('Inserting users...');
  const [johnDoe] = await db
    .insert(user)
    .values({
      id: 'usr_123456789',
      name: 'John Doe',
      email: 'john.doe@example.com',
      emailVerified: true,
      image: 'https://example.com/avatars/john.jpg',
      firstName: 'John',
      lastName: 'Doe',
      password: '$2a$10$hashedpassword', // bcrypt hash
      role: 'super_admin',
      stripeCustomerId: 'cus_123456789',
      stripeSubscriptionId: 'sub_123456789',
      stripePriceId: 'price_123456789',
      stripeCurrentPeriodEnd: new Date('2023-12-31T23:59:59Z'),
      twoFactorEnabled: true,
      lastLoginAt: DEFAULT_TIMESTAMP,
      preferredLanguage: 'en',
      tenantId: TENANT_ID,
    })
    .returning();

  // Insert accounts
  console.log('Inserting accounts...');
  await db.insert(account).values({
    id: 'acc_123456789',
    userId: johnDoe.id,
    accountId: '123456789',
    providerId: 'google',
    accessToken: 'ya29.a0token',
    refreshToken: '1//03refreshtoken',
    accessTokenExpiresAt: new Date('2023-12-31T23:59:59Z'),
    scope: 'email profile',
    tenantId: TENANT_ID,
  });

  // Insert session
  console.log('Inserting session...');
  await db.insert(session).values({
    id: 'sess_123456789',
    userId: johnDoe.id,
    token: 'session_token_123',
    expiresAt: new Date('2023-12-31T23:59:59Z'),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    tenantId: TENANT_ID,
    activeOrganizationId: 'org_123456789', // Will be set after org creation
  });

  // Insert verification token
  console.log('Inserting verification token...');
  await db.insert(verificationToken).values({
    identifier: johnDoe.email,
    token: 'verify_123456789',
    expires: new Date('2023-12-31T23:59:59Z'),
    tenantId: TENANT_ID,
  });

  // Insert two-factor auth
  console.log('Inserting two-factor auth...');
  await db.insert(twoFactor).values({
    id: '2fa_123456789',
    userId: johnDoe.id,
    secret: 'ABCDEFGHIJKLMNOP',
    backupCodes: ['123456', '789012', '345678'],
  });

  // Insert passkey
  console.log('Inserting passkey...');
  await db.insert(passkey).values({
    id: 'pass_123456789',
    userId: johnDoe.id,
    credentialID: 'cred_123456789',
    publicKey: 'pubkey_123456789',
    counter: 5,
    deviceType: 'single_device',
    backedUp: true,
    transports: ['usb', 'nfc'],
  });

  // Insert organization
  console.log('Inserting organization...');
  const [acmeInc] = await db
    .insert(organization)
    .values({
      id: 'org_123456789',
      name: 'Acme Inc',
      slug: 'acme-inc',
      logo: 'https://example.com/logos/acme.png',
      billingEmail: 'billing@acme.com',
      ownerId: johnDoe.id,
    })
    .returning();

  // Update session with organization ID
  //await db.update(session)
  //  .set({ activeOrganizationId: acmeInc.id })
  // .where({ id: "ysDfWPoL0YULjfkoRdoFW49RpnNMMqMU" });

  // Insert team
  console.log('Inserting team...');
  const [frontendTeam] = await db
    .insert(team)
    .values({
      id: 'team_123456789',
      name: 'Frontend Developers',
      description: 'Team responsible for frontend development',
      ownerId: johnDoe.id,
      organizationId: acmeInc.id,
      avatarUrl: 'https://example.com/teams/frontend.jpg',
      tenantId: TENANT_ID,
    })
    .returning();

  // Insert team member
  console.log('Inserting team member...');
  await db.insert(teamMember).values({
    id: 'tm_123456789',
    userId: johnDoe.id,
    teamId: frontendTeam.id,
    role: 'admin',
    status: 'active',
    joinedAt: DEFAULT_TIMESTAMP,
  });

  // Insert project
  console.log('Inserting project...');
  const [ecommerceProject] = await db
    .insert(project)
    .values({
      id: 'proj_123456789',
      name: 'E-commerce Platform',
      description: 'Next.js e-commerce platform',
      slug: 'ecommerce-platform',
      ownerId: johnDoe.id,
      teamId: frontendTeam.id,
      organizationId: acmeInc.id,
      repositoryUrl: 'https://github.com/acme/ecommerce',
      framework: 'nextjs',
      productionBranch: 'main',
      tenantId: TENANT_ID,
    })
    .returning();

  // Insert environment
  console.log('Inserting environment...');
  const [prodEnv] = await db
    .insert(projectEnvironment)
    .values({
      id: 'env_123456789',
      projectId: ecommerceProject.id,
      name: 'production',
      type: 'production',
      envVars: {
        API_URL: 'https://api.acme.com',
        DATABASE_URL: 'postgres://user:pass@db.acme.com:5432/prod',
      },
    })
    .returning();

  // Insert deployment
  console.log('Inserting deployment...');
  const [ecommerceDeployment] = await db
    .insert(deployment)
    .values({
      id: 'dep_123456789',
      projectId: ecommerceProject.id,
      environmentId: prodEnv.id,
      status: 'success',
      commitHash: 'a1b2c3d4e5',
      commitMessage: 'Fix checkout flow',
      branch: 'main',
      deploymentUrl: 'https://ecommerce.acme.com',
      tenantId: TENANT_ID,
      createdById: johnDoe.id,
      startedAt: new Date('2023-06-15T10:00:00Z'),
      completedAt: new Date('2023-06-15T10:05:23Z'),
    })
    .returning();

  // Insert deployment log
  console.log('Inserting deployment log...');
  await db.insert(deploymentLog).values({
    id: 'log_123456789',
    deploymentId: ecommerceDeployment.id,
    level: 'info',
    message: 'Deployment completed successfully',
    metadata: {
      buildTime: '45s',
      imageSize: '1.2GB',
    },
  });

  // Insert metric
  console.log('Inserting metric...');
  await db.insert(metric).values({
    id: 'met_123456789',
    deploymentId: ecommerceDeployment.id,
    cpuUsage: 23.5,
    memoryUsage: 45.2,
    responseTime: 125.7,
    requestCount: 1245,
  });

  // Insert plan
  console.log('Inserting plan...');
  const [proPlan] = await db
    .insert(plan)
    .values({
      id: 'plan_123456789',
      name: 'Pro Plan',
      description: 'For professional teams',
      price: 29.99,
      stripePriceId: 'price_pro_123',
      features: {
        deployments: 'unlimited',
        teamMembers: 10,
      },
      maxProjects: 10,
      maxDeployments: 100,
    })
    .returning();

  // Insert subscription
  console.log('Inserting subscription...');
  const [acmeSubscription] = await db
    .insert(subscription)
    .values({
      id: 'sub_123456789',
      planId: proPlan.id,
      organizationId: acmeInc.id,
      referenceId: 'ref_123456789',
      stripeSubscriptionId: 'sub_stripe_123',
      status: 'paid',
      periodStart: new Date('2023-06-01T00:00:00Z'),
      periodEnd: new Date('2023-07-01T00:00:00Z'),
      seats: 5,
    })
    .returning();

  // Insert billing
  console.log('Inserting billing...');
  await db.insert(billing).values({
    id: 'bill_123456789',
    userId: johnDoe.id,
    organizationId: acmeInc.id,
    subscriptionId: acmeSubscription.id,
    planId: proPlan.id,
    amount: '149.95', // Numeric as string
    status: 'paid',
    currency: 'USD',
    paidAt: new Date('2023-06-01T10:30:00Z'),
  });

  // Insert API key
  console.log('Inserting API key...');
  await db.insert(apiKey).values({
    id: 'key_123456789',
    keyHash: '$2a$10$hashedkey',
    name: 'CI/CD Integration',
    organizationId: acmeInc.id,
    scope: 'admin',
    expiresAt: new Date('2024-01-01T00:00:00Z'),
  });

  // Insert webhook
  console.log('Inserting webhook...');
  const [deployWebhook] = await db
    .insert(webhook)
    .values({
      id: 'wh_123456789',
      name: 'Deployment Notifications',
      url: 'https://hooks.acme.com/deployments',
      projectId: ecommerceProject.id,
      secret: 'whsec_123456789',
      events: ['deployment_started', 'deployment_success'],
    })
    .returning();

  // Insert webhook event
  console.log('Inserting webhook event...');
  await db.insert(webhookEvent).values({
    id: 'whe_123456789',
    webhookId: deployWebhook.id,
    tenantId: TENANT_ID,
    source: 'deployment-system',
    eventType: 'deployment_success',
    uniqueRequestId: 'req_123456789',
    payload: {
      deploymentId: ecommerceDeployment.id,
      status: 'success',
    },
    responseStatus: 200,
  });

  // Insert audit log
  console.log('Inserting audit log...');
  await db.insert(auditLog).values({
    id: 'audit_123456789',
    userId: johnDoe.id,
    organizationId: acmeInc.id,
    action: 'project.create',
    resourceType: 'project',
    resourceId: ecommerceProject.id,
    metadata: {
      name: 'E-commerce Platform',
    },
    tenantId: TENANT_ID,
    ip: '192.168.1.1',
  });

  console.log('Database seeding completed successfully!');
}

seedDatabase()
  .then(() => {
    console.log('Seed script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
