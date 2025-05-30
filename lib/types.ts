export type UserRole = "admin" | "user" | "super_admin";
export type DeploymentStatus = "pending" | "building" | "deploying" | "running" | "success" | "failed" | "cancelled";
export type BillingStatus = "pending" | "paid" | "failed" | "refunded";
export type MemberStatus = "pending" | "active" | "inactive" | "rejected";
export type EnvType = "development" | "staging" | "production";
export type ApiKeyScope = "read" | "write" | "admin";
export type WebhookEventType = 
  | "deployment_started"
  | "deployment_success"
  | "deployment_failed"
  | "billing_updated"
  | "team_invite"
  | "project_created";
export type DeviceType = "single_device" | "multi_device";
export type Transports = "usb" | "nfc" | "ble" | "internal";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Base interface with common fields
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
}

// User types
export interface User extends BaseEntity {
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role: UserRole;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  banned: boolean;
  banReason?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  preferredLanguage: string;
}

export interface Account extends BaseEntity {
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  tokenType?: string;
  sessionState?: string;
  password?: string;
}

export interface UserAccount extends BaseEntity {
  userId: string;
  accountId: string;
  isPrimary: boolean;
}

export interface Session extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  activeOrganizationId?: string;
  impersonatedBy?: string;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  value?: string;
  expires: Date;
  tenantId?: string;
}

export interface TwoFactor extends BaseEntity {
  secret: string;
  backupCodes: any; // Consider defining a more specific type for backup codes
  userId: string;
}

export interface Passkey extends BaseEntity {
  name?: string;
  credentialID: string;
  publicKey: string;
  counter: number;
  deviceType: DeviceType;
  backedUp: boolean;
  transports?: Transports[];
  userId: string;
  lastUsedAt?: Date;
}

// Organization types
export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, any>;
  billingEmail?: string;
  ownerId?: string;
}

// Team types
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  ownerId: string;
  organizationId?: string;
  isDeleted: boolean;
  avatarUrl?: string;
}

export interface TeamMember extends BaseEntity {
  userId: string;
  teamId: string;
  role: UserRole;
  invitedById?: string;
  status: MemberStatus;
  joinedAt?: Date;
}

// Project types
export interface Project extends BaseEntity {
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  teamId?: string;
  organizationId?: string;
  isActive: boolean;
  repositoryUrl?: string;
  framework?: string;
  productionBranch: string;
}

export interface ProjectEnvironment extends BaseEntity {
  projectId: string;
  name: string;
  type: EnvType;
  envVars: Record<string, any>;
  isActive: boolean;
  deletedAt?: Date;
}

// Deployment types
export interface Deployment extends BaseEntity {
  projectId: string;
  environmentId?: string;
  status: DeploymentStatus;
  commitHash?: string;
  commitMessage?: string;
  branch?: string;
  imageUrl?: string;
  buildLogs?: string;
  deploymentUrl?: string;
  createdById?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface DeploymentLog extends BaseEntity {
  deploymentId: string;
  serviceName?: string;
  containerName?: string;
  daemon?: string;
  requestId?: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export interface Metric extends BaseEntity {
  deploymentId: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage?: number;
  networkIn?: number;
  networkOut?: number;
  uptime?: number;
  responseTime?: number;
  requestCount?: number;
  errorCount?: number;
}

// Billing types
export interface Plan extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  interval: string;
  stripePriceId: string;
  features: Record<string, any>;
  featureList?: any[];
  maxProjects: number;
  maxDeployments: number;
  maxTeamMembers: number;
  maxEnvironments: number;
  isTrial: boolean;
  trialDays: number;
  isActive: boolean;
}

export interface Subscription extends BaseEntity {
  planId: string;
  userId?: string;
  teamId?: string;
  organizationId?: string;
  referenceId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: BillingStatus;
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  seats: number;
  trialStart?: Date;
  trialEnd?: Date;
}

export interface Billing extends BaseEntity {
  userId: string;
  teamId?: string;
  organizationId?: string;
  subscriptionId?: string;
  planId: string;
  amount: number;
  currency: string;
  billingPeriod: string;
  paid: boolean;
  invoiceUrl?: string;
  provider: string;
  status: BillingStatus;
  dueAt?: Date;
  paidAt?: Date;
}

// API and Webhook types
export interface ApiKey extends BaseEntity {
  keyHash: string;
  name?: string;
  userId?: string;
  teamId?: string;
  organizationId?: string;
  scope: ApiKeyScope;
  lastUsedAt?: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  isRevoked: boolean;
  description?: string;
}

export interface Webhook extends BaseEntity {
  name: string;
  url: string;
  projectId?: string;
  teamId?: string;
  organizationId?: string;
  secret?: string;
  events: WebhookEventType[];
  isActive: boolean;
  lastTriggeredAt?: Date;
}

export interface WebhookEvent extends BaseEntity {
  webhookId?: string;
  source: string;
  eventType: WebhookEventType;
  uniqueRequestId: string;
  payload: Record<string, any>;
  processed: boolean;
  responseStatus?: number;
  responseBody?: string;
  retryCount: number;
  receivedAt: Date;
  processedAt?: Date;
}

// Audit log type
export interface AuditLog extends BaseEntity {
  userId: string;
  teamId?: string;
  organizationId?: string;
  projectId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  location?: string;
}

// Rate limit type
export interface RateLimit {
  identifier: string;
  tokens: number;
  lastRefill: Date;
  expiresAt?: Date;
}

// UI-specific types
export interface UserSubscriptionPlan {
  id: string;
  title: string;
  description: string;
  stripeCustomerId?: string;
  isPaid: boolean;
  isCanceled: boolean;
  stripeCurrentPeriodEnd?: Date;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
}

export interface BillingData {
  user: User;
  subscription: Subscription;
  plan: Plan;
  billingRecords: Billing[];
  invoices: {
    id: string;
    amount: number;
    currency: string;
    date: Date;
    status: string;
    pdfUrl: string;
  }[];
}

// Complete mock data type
export interface MockData {
  plans: Plan[];
  users: User[];
  organizations: Organization[];
  teams: Team[];
  teamMembers: TeamMember[];
  projects: Project[];
  environments: ProjectEnvironment[];
  deployments: Deployment[];
  deploymentLogs: DeploymentLog[];
  metrics: Metric[];
  subscriptions: Subscription[];
  billingRecords: Billing[];
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  webhookEvents: WebhookEvent[];
  auditLogs: AuditLog[];
  userSubscriptionPlan: UserSubscriptionPlan;
  billingData: BillingData;
}
