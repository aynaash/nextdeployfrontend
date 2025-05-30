// mock-data.ts
import { UserSubscriptionPlan } from "./types";

// Helper functions
const randomId = () => Math.random().toString(36).substring(2, 15);
const randomDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const futureDate = (daysFromNow: number) => new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

// Mock Plans
export const mockPlans = [
  {
    id: "plan_free",
    name: "Free",
    description: "Basic plan for small projects",
    price: 0,
    interval: "monthly",
    stripePriceId: "price_free",
    features: {
      deployments: 5,
      projects: 1,
      teamMembers: 1,
      environments: 2
    },
    featureList: [
      "5 deployments/month",
      "1 project",
      "1 team member",
      "2 environments"
    ],
    maxProjects: 1,
    maxDeployments: 5,
    maxTeamMembers: 1,
    maxEnvironments: 2,
    isActive: true,
    createdAt: randomDate(30),
    updatedAt: randomDate(1)
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "For growing teams and businesses",
    price: 29,
    interval: "monthly",
    stripePriceId: "price_pro",
    features: {
      deployments: 50,
      projects: 5,
      teamMembers: 5,
      environments: 5
    },
    featureList: [
      "50 deployments/month",
      "5 projects",
      "5 team members",
      "5 environments",
      "Priority support"
    ],
    maxProjects: 5,
    maxDeployments: 50,
    maxTeamMembers: 5,
    maxEnvironments: 5,
    isActive: true,
    createdAt: randomDate(30),
    updatedAt: randomDate(1)
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "For large scale deployments",
    price: 99,
    interval: "monthly",
    stripePriceId: "price_enterprise",
    features: {
      deployments: "Unlimited",
      projects: "Unlimited",
      teamMembers: "Unlimited",
      environments: "Unlimited"
    },
    featureList: [
      "Unlimited deployments",
      "Unlimited projects",
      "Unlimited team members",
      "Unlimited environments",
      "24/7 priority support",
      "Dedicated account manager"
    ],
    maxProjects: 100,
    maxDeployments: 1000,
    maxTeamMembers: 100,
    maxEnvironments: 100,
    isActive: true,
    createdAt: randomDate(30),
    updatedAt: randomDate(1)
  }
];

// Mock Users
export const mockUsers = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: true,
    image: "https://example.com/avatars/john.jpg",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    stripeCustomerId: "cus_mock_1",
    stripeSubscriptionId: "sub_mock_1",
    stripePriceId: mockPlans[1].stripePriceId,
    stripeCurrentPeriodEnd: futureDate(30),
    createdAt: randomDate(60),
    updatedAt: randomDate(1),
    lastLoginAt: randomDate(1)
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    emailVerified: true,
    image: "https://example.com/avatars/jane.jpg",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    stripeCustomerId: "cus_mock_2",
    stripeSubscriptionId: "sub_mock_2",
    stripePriceId: mockPlans[0].stripePriceId,
    stripeCurrentPeriodEnd: futureDate(30),
    createdAt: randomDate(45),
    updatedAt: randomDate(2),
    lastLoginAt: randomDate(1)
  }
];

// Mock Organizations
export const mockOrganizations = [
  {
    id: "org_1",
    name: "Acme Inc",
    slug: "acme-inc",
    logo: "https://example.com/logos/acme.png",
    billingEmail: "billing@acme.com",
    ownerId: mockUsers[0].id,
    createdAt: randomDate(30),
    updatedAt: randomDate(1),
    metadata: {
      industry: "Technology",
      size: "50-100"
    }
  },
  {
    id: "org_2",
    name: "Globex Corp",
    slug: "globex-corp",
    logo: "https://example.com/logos/globex.png",
    billingEmail: "finance@globex.com",
    ownerId: mockUsers[1].id,
    createdAt: randomDate(20),
    updatedAt: randomDate(2),
    metadata: {
      industry: "Finance",
      size: "100+"
    }
  }
];

// Mock Teams
export const mockTeams = [
  {
    id: "team_1",
    name: "Frontend Team",
    description: "Team responsible for frontend development",
    ownerId: mockUsers[0].id,
    organizationId: mockOrganizations[0].id,
    createdAt: randomDate(25),
    updatedAt: randomDate(1),
    avatarUrl: "https://example.com/teams/frontend.jpg"
  },
  {
    id: "team_2",
    name: "Backend Team",
    description: "Team responsible for backend services",
    ownerId: mockUsers[1].id,
    organizationId: mockOrganizations[1].id,
    createdAt: randomDate(20),
    updatedAt: randomDate(2),
    avatarUrl: "https://example.com/teams/backend.jpg"
  }
];

// Mock Team Members
export const mockTeamMembers = [
  {
    id: "member_1",
    userId: mockUsers[0].id,
    teamId: mockTeams[0].id,
    role: "admin",
    status: "active",
    joinedAt: randomDate(25),
    createdAt: randomDate(25)
  },
  {
    id: "member_2",
    userId: mockUsers[1].id,
    teamId: mockTeams[0].id,
    role: "user",
    status: "active",
    joinedAt: randomDate(20),
    createdAt: randomDate(20)
  },
  {
    id: "member_3",
    userId: mockUsers[1].id,
    teamId: mockTeams[1].id,
    role: "admin",
    status: "active",
    joinedAt: randomDate(20),
    createdAt: randomDate(20)
  }
];

// Mock Projects
export const mockProjects = [
  {
    id: "project_1",
    name: "E-commerce Platform",
    description: "Next.js e-commerce application",
    slug: "ecommerce-platform",
    ownerId: mockUsers[0].id,
    teamId: mockTeams[0].id,
    organizationId: mockOrganizations[0].id,
    createdAt: randomDate(20),
    updatedAt: randomDate(1),
    repositoryUrl: "https://github.com/acme/ecommerce",
    framework: "nextjs",
    productionBranch: "main"
  },
  {
    id: "project_2",
    name: "API Service",
    description: "Backend API for mobile apps",
    slug: "api-service",
    ownerId: mockUsers[1].id,
    teamId: mockTeams[1].id,
    organizationId: mockOrganizations[1].id,
    createdAt: randomDate(15),
    updatedAt: randomDate(2),
    repositoryUrl: "https://github.com/globex/api-service",
    framework: "node",
    productionBranch: "main"
  }
];

// Mock Environments
export const mockEnvironments = [
  {
    id: "env_1",
    projectId: mockProjects[0].id,
    name: "Production",
    type: "production",
    envVars: {
      API_URL: "https://api.example.com",
      DB_HOST: "db-prod.example.com"
    },
    isActive: true,
    createdAt: randomDate(20),
    updatedAt: randomDate(1)
  },
  {
    id: "env_2",
    projectId: mockProjects[0].id,
    name: "Staging",
    type: "staging",
    envVars: {
      API_URL: "https://api.staging.example.com",
      DB_HOST: "db-staging.example.com"
    },
    isActive: true,
    createdAt: randomDate(18),
    updatedAt: randomDate(2)
  },
  {
    id: "env_3",
    projectId: mockProjects[1].id,
    name: "Production",
    type: "production",
    envVars: {
      API_URL: "https://api.globex.com",
      DB_HOST: "db.globex.com"
    },
    isActive: true,
    createdAt: randomDate(15),
    updatedAt: randomDate(1)
  }
];

// Mock Deployments
export const mockDeployments = [
  {
    id: "deploy_1",
    projectId: mockProjects[0].id,
    environmentId: mockEnvironments[0].id,
    status: "success",
    commitHash: "a1b2c3d4",
    commitMessage: "Update product page",
    branch: "main",
    deploymentUrl: "https://ecommerce.example.com",
    createdById: mockUsers[0].id,
    createdAt: randomDate(5),
    updatedAt: randomDate(1),
    startedAt: randomDate(5),
    completedAt: randomDate(4.9)
  },
  {
    id: "deploy_2",
    projectId: mockProjects[0].id,
    environmentId: mockEnvironments[1].id,
    status: "running",
    commitHash: "e5f6g7h8",
    commitMessage: "Add checkout functionality",
    branch: "feature/checkout",
    deploymentUrl: "https://staging.ecommerce.example.com",
    createdById: mockUsers[1].id,
    createdAt: randomDate(2),
    updatedAt: randomDate(1),
    startedAt: randomDate(2)
  },
  {
    id: "deploy_3",
    projectId: mockProjects[1].id,
    environmentId: mockEnvironments[2].id,
    status: "failed",
    commitHash: "i9j0k1l2",
    commitMessage: "Fix authentication bug",
    branch: "main",
    createdById: mockUsers[1].id,
    createdAt: randomDate(3),
    updatedAt: randomDate(2),
    startedAt: randomDate(3),
    completedAt: randomDate(2.9)
  }
];

// Mock Deployment Logs
export const mockDeploymentLogs = [
  {
    id: "log_1",
    deploymentId: mockDeployments[0].id,
    level: "info",
    message: "Deployment started",
    createdAt: mockDeployments[0].startedAt
  },
  {
    id: "log_2",
    deploymentId: mockDeployments[0].id,
    level: "info",
    message: "Building application",
    createdAt: new Date(mockDeployments[0].startedAt!.getTime() + 1000 * 60)
  },
  {
    id: "log_3",
    deploymentId: mockDeployments[0].id,
    level: "info",
    message: "Deployment completed successfully",
    createdAt: mockDeployments[0].completedAt
  },
  {
    id: "log_4",
    deploymentId: mockDeployments[2].id,
    level: "error",
    message: "Failed to connect to database",
    createdAt: mockDeployments[2].completedAt
  }
];

// Mock Metrics
export const mockMetrics = [
  {
    id: "metric_1",
    deploymentId: mockDeployments[0].id,
    cpuUsage: 25.5,
    memoryUsage: 45.2,
    responseTime: 125,
    requestCount: 1245,
    errorCount: 2,
    createdAt: mockDeployments[0].completedAt
  },
  {
    id: "metric_2",
    deploymentId: mockDeployments[2].id,
    cpuUsage: 85.7,
    memoryUsage: 92.1,
    responseTime: 850,
    requestCount: 42,
    errorCount: 42,
    createdAt: mockDeployments[2].completedAt
  }
];

// Mock Subscriptions
export const mockSubscriptions = [
  {
    id: "sub_1",
    planId: mockPlans[1].id,
    userId: mockUsers[0].id,
    organizationId: mockOrganizations[0].id,
    stripeCustomerId: mockUsers[0].stripeCustomerId,
    stripeSubscriptionId: mockUsers[0].stripeSubscriptionId,
    status: "paid",
    periodStart: randomDate(30),
    periodEnd: futureDate(30),
    cancelAtPeriodEnd: false,
    createdAt: randomDate(30),
    updatedAt: randomDate(1)
  },
  {
    id: "sub_2",
    planId: mockPlans[0].id,
    userId: mockUsers[1].id,
    organizationId: mockOrganizations[1].id,
    stripeCustomerId: mockUsers[1].stripeCustomerId,
    stripeSubscriptionId: mockUsers[1].stripeSubscriptionId,
    status: "paid",
    periodStart: randomDate(30),
    periodEnd: futureDate(30),
    cancelAtPeriodEnd: false,
    createdAt: randomDate(30),
    updatedAt: randomDate(1)
  }
];

// Mock Billing Records
export const mockBillingRecords = [
  {
    id: "bill_1",
    userId: mockUsers[0].id,
    organizationId: mockOrganizations[0].id,
    subscriptionId: mockSubscriptions[0].id,
    planId: mockPlans[1].id,
    amount: mockPlans[1].price,
    currency: "USD",
    billingPeriod: "monthly",
    paid: true,
    invoiceUrl: "https://stripe.com/invoices/mock_1",
    status: "paid",
    createdAt: mockSubscriptions[0].periodStart,
    updatedAt: mockSubscriptions[0].periodStart,
    paidAt: mockSubscriptions[0].periodStart
  },
  {
    id: "bill_2",
    userId: mockUsers[1].id,
    organizationId: mockOrganizations[1].id,
    subscriptionId: mockSubscriptions[1].id,
    planId: mockPlans[0].id,
    amount: mockPlans[0].price,
    currency: "USD",
    billingPeriod: "monthly",
    paid: true,
    invoiceUrl: "https://stripe.com/invoices/mock_2",
    status: "paid",
    createdAt: mockSubscriptions[1].periodStart,
    updatedAt: mockSubscriptions[1].periodStart,
    paidAt: mockSubscriptions[1].periodStart
  }
];

// Mock API Keys
export const mockApiKeys = [
  {
    id: "api_key_1",
    keyHash: "hash_1",
    name: "CI/CD Key",
    userId: mockUsers[0].id,
    organizationId: mockOrganizations[0].id,
    scope: "admin",
    lastUsedAt: randomDate(1),
    expiresAt: futureDate(90),
    createdAt: randomDate(10),
    description: "Used for CI/CD pipeline deployments"
  },
  {
    id: "api_key_2",
    keyHash: "hash_2",
    name: "Monitoring",
    userId: mockUsers[1].id,
    organizationId: mockOrganizations[1].id,
    scope: "read",
    lastUsedAt: randomDate(2),
    expiresAt: futureDate(60),
    createdAt: randomDate(5),
    description: "Used for monitoring services"
  }
];

// Mock Webhooks
export const mockWebhooks = [
  {
    id: "webhook_1",
    name: "Deployment Notifications",
    url: "https://hooks.slack.com/services/mock_1",
    projectId: mockProjects[0].id,
    secret: "secret_1",
    events: ["deployment_started", "deployment_success", "deployment_failed"],
    isActive: true,
    createdAt: randomDate(15),
    updatedAt: randomDate(1),
    lastTriggeredAt: randomDate(1)
  },
  {
    id: "webhook_2",
    name: "Billing Alerts",
    url: "https://hooks.slack.com/services/mock_2",
    organizationId: mockOrganizations[1].id,
    secret: "secret_2",
    events: ["billing_updated"],
    isActive: true,
    createdAt: randomDate(10),
    updatedAt: randomDate(2)
  }
];

// Mock Webhook Events
export const mockWebhookEvents = [
  {
    id: "webhook_event_1",
    webhookId: mockWebhooks[0].id,
    eventType: "deployment_success",
    source: "deployment",
    uniqueRequestId: "req_1",
    payload: {
      deploymentId: mockDeployments[0].id,
      status: "success",
      project: mockProjects[0].name
    },
    processed: true,
    responseStatus: 200,
    createdAt: mockDeployments[0].completedAt,
    processedAt: new Date(mockDeployments[0].completedAt!.getTime() + 1000)
  },
  {
    id: "webhook_event_2",
    webhookId: mockWebhooks[0].id,
    eventType: "deployment_failed",
    source: "deployment",
    uniqueRequestId: "req_2",
    payload: {
      deploymentId: mockDeployments[2].id,
      status: "failed",
      project: mockProjects[1].name,
      error: "Database connection failed"
    },
    processed: true,
    responseStatus: 200,
    createdAt: mockDeployments[2].completedAt,
    processedAt: new Date(mockDeployments[2].completedAt!.getTime() + 1000)
  }
];

// Mock Audit Logs
export const mockAuditLogs = [
  {
    id: "audit_1",
    userId: mockUsers[0].id,
    organizationId: mockOrganizations[0].id,
    action: "create",
    resourceType: "project",
    resourceId: mockProjects[0].id,
    metadata: {
      name: mockProjects[0].name
    },
    createdAt: mockProjects[0].createdAt
  },
  {
    id: "audit_2",
    userId: mockUsers[1].id,
    organizationId: mockOrganizations[1].id,
    action: "update",
    resourceType: "deployment",
    resourceId: mockDeployments[2].id,
    metadata: {
      fromStatus: "running",
      toStatus: "failed"
    },
    createdAt: mockDeployments[2].updatedAt
  }
];

// Mock UserSubscriptionPlan for the UI
export const mockUserSubscriptionPlan: UserSubscriptionPlan = {
  id: mockSubscriptions[0].id,
  title: mockPlans[1].name,
  description: mockPlans[1].description,
  stripeCustomerId: mockUsers[0].stripeCustomerId,
  isPaid: true,
  isCanceled: false,
  stripeCurrentPeriodEnd: mockUsers[0].stripeCurrentPeriodEnd,
  stripeSubscriptionId: mockUsers[0].stripeSubscriptionId,
  stripePriceId: mockUsers[0].stripePriceId
};

// Mock data for the billing page
export const mockBillingData = {
  user: mockUsers[0],
  subscription: mockSubscriptions[0],
  plan: mockPlans[1],
  billingRecords: mockBillingRecords.filter(b => b.userId === mockUsers[0].id),
  invoices: [
    {
      id: "inv_1",
      amount: mockPlans[1].price,
      currency: "USD",
      date: randomDate(30),
      status: "paid",
      pdfUrl: "https://stripe.com/invoices/mock_1"
    },
    {
      id: "inv_2",
      amount: mockPlans[1].price,
      currency: "USD",
      date: randomDate(60),
      status: "paid",
      pdfUrl: "https://stripe.com/invoices/mock_2"
    }
  ]
};

// Export all mock data
export const mockData = {
  plans: mockPlans,
  users: mockUsers,
  organizations: mockOrganizations,
  teams: mockTeams,
  teamMembers: mockTeamMembers,
  projects: mockProjects,
  environments: mockEnvironments,
  deployments: mockDeployments,
  deploymentLogs: mockDeploymentLogs,
  metrics: mockMetrics,
  subscriptions: mockSubscriptions,
  billingRecords: mockBillingRecords,
  apiKeys: mockApiKeys,
  webhooks: mockWebhooks,
  webhookEvents: mockWebhookEvents,
  auditLogs: mockAuditLogs,
  userSubscriptionPlan: mockUserSubscriptionPlan,
  billingData: mockBillingData
};
