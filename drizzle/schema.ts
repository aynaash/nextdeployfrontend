
import { pgTable, text, timestamp, json, jsonb, boolean, integer, varchar, real, numeric, pgEnum, index, primaryKey } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

import { relations } from "drizzle-orm";
// ====================== ENUMS ======================
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER", "SUPER_ADMIN"]);
export const deploymentStatusEnum = pgEnum("deployment_status", ["PENDING", "BUILDING", "DEPLOYING", "RUNNING", "SUCCESS", "FAILED", "CANCELLED"]);
export const billingStatusEnum = pgEnum("billing_status", ["PENDING", "PAID", "FAILED", "REFUNDED"]);
export const memberStatusEnum = pgEnum("member_status", ["PENDING", "ACTIVE", "INACTIVE", "REJECTED"]);
export const envTypeEnum = pgEnum("env_type", ["DEVELOPMENT", "STAGING", "PRODUCTION"]);
export const apiKeyScopeEnum = pgEnum("api_key_scope", ["READ", "WRITE", "ADMIN"]);
export const webhookEventTypeEnum = pgEnum("webhook_event_type", [
  "DEPLOYMENT_STARTED",
  "DEPLOYMENT_SUCCESS",
  "DEPLOYMENT_FAILED",
  "BILLING_UPDATED",
  "TEAM_INVITE",
  "PROJECT_CREATED"
]);
export const deviceTypeEnum = pgEnum("device_type", ["SINGLE_DEVICE", "MULTI_DEVICE"]);
export const transportsEnum = pgEnum("transports", ["USB", "NFC", "BLE", "INTERNAL"]);
export const logLevelEnum = pgEnum("log_level", ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]);

// ====================== TABLES ======================
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  firstName: text("first_name", { length: 100 }),
  lastName: text("last_name", { length: 100 }),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("USER"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tenantId: text("tenant_id"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  lastLoginAt: timestamp("last_login_at"),
  preferredLanguage: text("preferred_language").default("en"),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  tokenType: text("token_type"),
  sessionState: text("session_state"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  tenantId: text("tenant_id"),
});

export const userAccounts = pgTable("user_account", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().references(() => accounts.id),
  tenantId: text("tenant_id"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
  tenantId: text("tenant_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  impersonatedBy: text("impersonated_by"),
});

export const verificationTokens = pgTable("verification_token", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  tenantId: text("tenant_id"),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
}));

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  secret: text("secret").notNull(),
  backupCodes: json("backup_codes").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const passkeys = pgTable("passkey", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  credentialID: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull(),
  deviceType: deviceTypeEnum("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: transportsEnum("transports").array(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

export const organizations = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
  billingEmail: text("billing_email"),
  ownerId: text("owner_id").references(() => users.id),
});

export const teams = pgTable("team", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  ownerId: text("owner_id").notNull().references(() => users.id),
  organizationId: text("organization_id").references(() => organizations.id),
  isDeleted: boolean("is_deleted").default(false),
  tenantId: text("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  avatarUrl: text("avatar_url"),
});

export const teamMembers = pgTable("team_member", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  teamId: text("team_id").notNull().references(() => teams.id),
  role: userRoleEnum("role").default("USER"),
  invitedById: text("invited_by_id").references(() => users.id),
  status: memberStatusEnum("status").notNull().default("PENDING"),
  joinedAt: timestamp("joined_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (tm) => ({
  uniqueUserTeam: primaryKey({ columns: [tm.userId, tm.teamId] })
}));

export const projects = pgTable("project", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").unique().notNull(),
  tenantId: text("tenant_id").notNull(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  repositoryUrl: text("repository_url"),
  framework: text("framework"),
  productionBranch: text("production_branch").default("main"),
});

export const projectEnvironments = pgTable("project_environment", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: envTypeEnum("type").notNull().default("DEVELOPMENT"),
  envVars: jsonb("env_vars").notNull(),
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (pe) => ({
  projectEnvIdx: index("project_env_idx").on(pe.projectId, pe.name),
}));

export const deployments = pgTable("deployment", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  projectId: text("project_id").notNull().references(() => projects.id),
  environmentId: text("environment_id").references(() => projectEnvironments.id),
  status: deploymentStatusEnum("status").notNull().default("PENDING"),
  commitHash: text("commit_hash"),
  commitMessage: text("commit_message"),
  branch: text("branch"),
  imageUrl: text("image_url"),
  buildLogs: text("build_logs"),
  deploymentUrl: text("deployment_url"),
  tenantId: text("tenant_id").notNull(),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
}, (d) => ({
  projectStatusIdx: index("deployment_project_status_idx").on(d.projectId, d.status),
  createdAtIdx: index("deployment_created_at_idx").on(d.createdAt),
}));

export const deploymentLogs = pgTable("deployment_log", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  deploymentId: text("deployment_id").notNull().references(() => deployments.id, { onDelete: "cascade" }),
  serviceName: varchar("service_name", { length: 100 }),
  containerName: varchar("container_name", { length: 100 }),
  daemon: varchar("daemon", { length: 100 }),
  requestId: text("request_id"),
  level: logLevelEnum("level").default("INFO"),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (dl) => ({
  deploymentIdIdx: index("log_deployment_idx").on(dl.deploymentId),
  createdAtIdx: index("log_created_at_idx").on(dl.createdAt),
  requestIdIdx: index("log_request_id_idx").on(dl.requestId),
}));

export const metrics = pgTable("metric", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  deploymentId: text("deployment_id").notNull().references(() => deployments.id, { onDelete: "cascade" }),
  cpuUsage: real("cpu_usage").notNull(),
  memoryUsage: real("memory_usage").notNull(),
  diskUsage: real("disk_usage"),
  networkIn: real("network_in"),
  networkOut: real("network_out"),
  uptime: real("uptime"),
  responseTime: real("response_time"),
  requestCount: integer("request_count"),
  errorCount: integer("error_count"),
  createdAt: timestamp("created_at").defaultNow(),
}, (m) => ({
  deploymentIdx: index("metric_deployment_idx").on(m.deploymentId),
}));

export const plans = pgTable("plan", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  interval: text("interval").default("monthly"),
  stripePriceId: text("stripe_price_id").notNull(),
  features: jsonb("features").notNull(),
  featureList: jsonb("feature_list"),
  maxProjects: integer("max_projects").notNull().default(1),
  maxDeployments: integer("max_deployments").notNull().default(5),
  maxTeamMembers: integer("max_team_members").notNull().default(1),
  maxEnvironments: integer("max_environments").notNull().default(3),
  isTrial: boolean("is_trial").default(false),
  trialDays: integer("trial_days").default(14),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (p) => ({
  priceIdx: index("plan_price_idx").on(p.price),
}));

export const subscriptions = pgTable("subscription", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  planId: text("plan_id").notNull().references(() => plans.id),
  userId: text("user_id").references(() => users.id),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: billingStatusEnum("status").default("PENDING"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  seats: integer("seats").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
}, (s) => ({
  statusIdx: index("subscription_status_idx").on(s.status),
  stripeIdx: index("subscription_stripe_idx").on(s.stripeSubscriptionId),
}));

export const billings = pgTable("billing", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  planId: text("plan_id").notNull().references(() => plans.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  billingPeriod: text("billing_period").default("monthly"),
  paid: boolean("paid").default(false).notNull(),
  invoiceUrl: text("invoice_url"),
  provider: text("provider").default("stripe"),
  status: billingStatusEnum("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  dueAt: timestamp("due_at"),
  paidAt: timestamp("paid_at"),
}, (b) => ({
  userStatusIdx: index("billing_user_status_idx").on(b.userId, b.status),
}));

export const apiKeys = pgTable("api_key", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  keyHash: text("key_hash").notNull(),
  name: varchar("name", { length: 100 }),
  userId: text("user_id").references(() => users.id),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  scope: apiKeyScopeEnum("scope").notNull().default("READ"),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"),
  isRevoked: boolean("is_revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
}, (ak) => ({
  keyHashIdx: index("api_key_hash_idx").on(ak.keyHash),
}));

export const webhooks = pgTable("webhook", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  url: text("url").notNull(),
  projectId: text("project_id").references(() => projects.id),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  secret: text("secret"),
  events: webhookEventTypeEnum("events").array().notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastTriggeredAt: timestamp("last_triggered_at"),
}, (w) => ({
  urlIdx: index("webhook_url_idx").on(w.url),
}));

export const webhookEvents = pgTable("webhook_event", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  webhookId: text("webhook_id").references(() => webhooks.id),
  tenantId: text("tenant_id").notNull(),
  source: text("source").notNull(),
  eventType: webhookEventTypeEnum("event_type").notNull(),
  uniqueRequestId: text("unique_request_id").notNull(),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").default(false),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  retryCount: integer("retry_count").default(0),
  receivedAt: timestamp("received_at").defaultNow(),
  processedAt: timestamp("processed_at"),
}, (we) => ({
  sourceIdx: index("webhook_source_idx").on(we.source),
  requestIdx: index("webhook_request_idx").on(we.uniqueRequestId),
  processedIdx: index("webhook_processed_idx").on(we.processed),
}));

export const auditLogs = pgTable("audit_log", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  teamId: text("team_id").references(() => teams.id),
  organizationId: text("organization_id").references(() => organizations.id),
  projectId: text("project_id").references(() => projects.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  metadata: jsonb("metadata"),
  tenantId: text("tenant_id").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
}, (al) => ({
  userIdx: index("auditlog_user_idx").on(al.userId),
  tenantIdx: index("auditlog_tenant_idx").on(al.tenantId),
  resourceIdx: index("auditlog_resource_idx").on(al.resourceType, al.resourceId),
}));

export const rateLimits = pgTable("rate_limit", {
  identifier: text("identifier").notNull().primaryKey(),
  tokens: integer("tokens").notNull(),
  lastRefill: timestamp("last_refill", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
}, (rl) => ({
  identifierIdx: index("idx_rate_limits_identifier").on(rl.identifier),
}));

// ====================== RELATIONS ======================
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  teams: many(teamMembers),
  ownedTeams: many(teams, { relationName: "teamOwner" }),
  projects: many(projects),
  createdDeployments: many(deployments, { relationName: "deploymentCreator" }),
  twoFactor: many(twoFactor),
  passkeys: many(passkeys),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
  subscriptions: many(subscriptions),
  billings: many(billings),
  ownedOrganizations: many(organizations, { relationName: "organizationOwner" }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(users, {
    fields: [twoFactor.userId],
    references: [users.id],
  }),
}));

export const passkeysRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
    relationName: "organizationOwner"
  }),
  teams: many(teams),
  projects: many(projects),
  subscriptions: many(subscriptions),
  billings: many(billings),
  apiKeys: many(apiKeys),
}));

export const teamsRelations = relations(teams, ({ many, one }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
    relationName: "teamOwner"
  }),
  members: many(teamMembers),
  projects: many(projects),
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.id],
  }),
  apiKeys: many(apiKeys),
  webhooks: many(webhooks),
  subscriptions: many(subscriptions),
  auditLogs: many(auditLogs),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [teamMembers.invitedById],
    references: [users.id],
    relationName: "invitedByUser"
  }),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  deployments: many(deployments),
  environments: many(projectEnvironments),
  webhooks: many(webhooks),
}));

export const projectEnvironmentsRelations = relations(projectEnvironments, ({ one }) => ({
  project: one(projects, {
    fields: [projectEnvironments.projectId],
    references: [projects.id],
  }),
}));

export const deploymentsRelations = relations(deployments, ({ one, many }) => ({
  project: one(projects, {
    fields: [deployments.projectId],
    references: [projects.id],
  }),
  environment: one(projectEnvironments, {
    fields: [deployments.environmentId],
    references: [projectEnvironments.id],
  }),
  createdBy: one(users, {
    fields: [deployments.createdById],
    references: [users.id],
    relationName: "deploymentCreator"
  }),
  logs: many(deploymentLogs),
  metrics: many(metrics),
}));

export const deploymentLogsRelations = relations(deploymentLogs, ({ one }) => ({
  deployment: one(deployments, {
    fields: [deploymentLogs.deploymentId],
    references: [deployments.id],
  }),
}));

export const metricsRelations = relations(metrics, ({ one }) => ({
  deployment: one(deployments, {
    fields: [metrics.deploymentId],
    references: [deployments.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
  billings: many(billings),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [subscriptions.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
  billings: many(billings),
}));

export const billingsRelations = relations(billings, ({ one }) => ({
  user: one(users, {
    fields: [billings.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [billings.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [billings.organizationId],
    references: [organizations.id],
  }),
  subscription: one(subscriptions, {
    fields: [billings.subscriptionId],
    references: [subscriptions.id],
  }),
  plan: one(plans, {
    fields: [billings.planId],
    references: [plans.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [apiKeys.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [apiKeys.organizationId],
    references: [organizations.id],
  }),
}));

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  project: one(projects, {
    fields: [webhooks.projectId],
    references: [projects.id],
  }),
  team: one(teams, {
    fields: [webhooks.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [webhooks.organizationId],
    references: [organizations.id],
  }),
  events: many(webhookEvents),
}));

export const webhookEventsRelations = relations(webhookEvents, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [webhookEvents.webhookId],
    references: [webhooks.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [auditLogs.teamId],
    references: [teams.id],
  }),
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [auditLogs.projectId],
    references: [projects.id],
  }),
}));
