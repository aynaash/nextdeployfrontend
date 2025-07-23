import {
  pgTable,
  text,
  timestamp,
  json,
  jsonb,
  boolean,
  integer,
  varchar,
  real,
  numeric,
  pgEnum,
  index,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
// ====================== ENUMS ======================
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'super_admin']);
export const deploymentStatusEnum = pgEnum('deployment_status', [
  'pending',
  'building',
  'deploying',
  'running',
  'success',
  'failed',
  'cancelled',
]);
export const billingStatusEnum = pgEnum('billing_status', [
  'pending',
  'paid',
  'failed',
  'refunded',
]);
export const memberStatusEnum = pgEnum('member_status', [
  'pending',
  'active',
  'inactive',
  'rejected',
]);
export const envTypeEnum = pgEnum('env_type', ['development', 'staging', 'production']);
export const apiKeyScopeEnum = pgEnum('api_key_scope', ['read', 'write', 'admin']);
export const webhookEventTypeEnum = pgEnum('webhook_event_type', [
  'deployment_started',
  'deployment_success',
  'deployment_failed',
  'billing_updated',
  'team_invite',
  'project_created',
]);
export const deviceTypeEnum = pgEnum('device_type', ['single_device', 'multi_device']);
export const transportsEnum = pgEnum('transports', ['usb', 'nfc', 'ble', 'internal']);
export const logLevelEnum = pgEnum('log_level', ['debug', 'info', 'warn', 'error', 'fatal']);

// ====================== TABLES ======================

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Core BetterAuth fields
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  // Your additional fields
  firstName: text('first_name'),
  lastName: text('last_name'),
  password: text('password'),
  role: userRoleEnum('role').default('user'),

  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),

  tenantId: text('tenant_id'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  lastLoginAt: timestamp('last_login_at'),
  preferredLanguage: text('preferred_language').default('en'),
});
export const account = pgTable('account', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  accountId: text('accountId').notNull(), // ✅ Required by BetterAuth
  providerId: text('providerId').notNull(), // ✅ Required by BetterAuth

  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

  scope: text('scope'),
  idToken: text('id_token'),
  tokenType: text('token_type'),
  sessionState: text('session_state'),

  password: text('password'), // Used for email/password login

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  tenantId: text('tenant_id'),
});
export const userAccount = pgTable('user_account', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accountId: text('account_id')
    .notNull()
    .references(() => account.id),
  tenantId: text('tenant_id'),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const session = pgTable('session', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Core BetterAuth required fields
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  // Optional metadata
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  // Custom business-specific extensions (optional, just keep them clean)
  tenantId: text('tenant_id'), // optional; BetterAuth doesn't care
  activeOrganizationId: text('active_organization_id'),
  impersonatedBy: text('impersonated_by'),
});

export const verificationToken = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    value: text('value'),
    expires: timestamp('expires').notNull(),
    tenantId: text('tenant_id'),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const twoFactor = pgTable('two_factor', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  secret: text('secret').notNull(),
  backupCodes: json('backup_codes').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const passkey = pgTable('passkey', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  credentialID: text('credential_id').notNull().unique(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  deviceType: deviceTypeEnum('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: transportsEnum('transports').array(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
});

export const organization = pgTable('organization', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  metadata: jsonb('metadata'),
  billingEmail: text('billing_email'),
  ownerId: text('owner_id').references(() => user.id),
});

export const team = pgTable('team', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id),
  organizationId: text('organization_id').references(() => organization.id),
  isDeleted: boolean('is_deleted').default(false),
  tenantId: text('tenant_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  avatarUrl: text('avatar_url'),
});

export const teamMember = pgTable(
  'team_member',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    teamId: text('team_id')
      .notNull()
      .references(() => team.id),
    role: userRoleEnum('role').default('user'),
    invitedById: text('invited_by_id').references(() => user.id),
    status: memberStatusEnum('status').notNull().default('pending'),
    joinedAt: timestamp('joined_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (tm) => [uniqueIndex('unique_user_team_index').on(tm.userId, tm.teamId)]
);

export const project = pgTable('project', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').unique().notNull(),
  tenantId: text('tenant_id').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id),
  teamId: text('team_id').references(() => team.id),
  organizationId: text('organization_id').references(() => organization.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  repositoryUrl: text('repository_url'),
  framework: text('framework'),
  productionBranch: text('production_branch').default('main'),
});

export const projectEnvironment = pgTable(
  'project_environment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: envTypeEnum('type').notNull().default('development'),
    envVars: jsonb('env_vars').notNull(),
    isActive: boolean('is_active').default(true),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (pe) => ({
    projectEnvIdx: index('project_env_idx').on(pe.projectId, pe.name),
  })
);

export const deployment = pgTable(
  'deployment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    projectId: text('project_id')
      .notNull()
      .references(() => project.id),
    environmentId: text('environment_id').references(() => projectEnvironment.id),
    status: deploymentStatusEnum('status').notNull().default('pending'),
    commitHash: text('commit_hash'),
    commitMessage: text('commit_message'),
    branch: text('branch'),
    imageUrl: text('image_url'),
    buildLogs: text('build_logs'),
    deploymentUrl: text('deployment_url'),
    tenantId: text('tenant_id').notNull(),
    createdById: text('created_by_id').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
  },
  (d) => ({
    projectStatusIdx: index('deployment_project_status_idx').on(d.projectId, d.status),
    createdAtIdx: index('deployment_created_at_idx').on(d.createdAt),
  })
);

export const deploymentLog = pgTable(
  'deployment_log',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    deploymentId: text('deployment_id')
      .notNull()
      .references(() => deployment.id, { onDelete: 'cascade' }),
    serviceName: varchar('service_name', { length: 100 }),
    containerName: varchar('container_name', { length: 100 }),
    daemon: varchar('daemon', { length: 100 }),
    requestId: text('request_id'),
    level: logLevelEnum('level').default('info'),
    message: text('message').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (dl) => ({
    deploymentIdIdx: index('log_deployment_idx').on(dl.deploymentId),
    createdAtIdx: index('log_created_at_idx').on(dl.createdAt),
    requestIdIdx: index('log_request_id_idx').on(dl.requestId),
  })
);

export const metric = pgTable(
  'metric',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    deploymentId: text('deployment_id')
      .notNull()
      .references(() => deployment.id, { onDelete: 'cascade' }),
    cpuUsage: real('cpu_usage').notNull(),
    memoryUsage: real('memory_usage').notNull(),
    diskUsage: real('disk_usage'),
    networkIn: real('network_in'),
    networkOut: real('network_out'),
    uptime: real('uptime'),
    responseTime: real('response_time'),
    requestCount: integer('request_count'),
    errorCount: integer('error_count'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (m) => ({
    deploymentIdx: index('metric_deployment_idx').on(m.deploymentId),
  })
);

export const plan = pgTable(
  'plan',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull().unique(),
    description: text('description'),
    price: real('price').notNull(),
    interval: text('interval').default('monthly'),
    stripePriceId: text('stripe_price_id').notNull(),
    features: jsonb('features').notNull(),
    featureList: jsonb('feature_list'),
    maxProjects: integer('max_projects').notNull().default(1),
    maxDeployments: integer('max_deployments').notNull().default(5),
    maxTeamMembers: integer('max_team_members').notNull().default(1),
    maxEnvironments: integer('max_environments').notNull().default(3),
    isTrial: boolean('is_trial').default(false),
    trialDays: integer('trial_days').default(14),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (p) => ({
    priceIdx: index('plan_price_idx').on(p.price),
  })
);

export const subscription = pgTable(
  'subscription',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    planId: text('plan_id')
      .notNull()
      .references(() => plan.id),
    userId: text('user_id').references(() => user.id),
    teamId: text('team_id').references(() => team.id),
    organizationId: text('organization_id').references(() => organization.id),
    referenceId: text('reference_id').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    status: billingStatusEnum('status').default('pending'),
    periodStart: timestamp('period_start'),
    periodEnd: timestamp('period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    seats: integer('seats').default(1),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end'),
  },
  (s) => ({
    statusIdx: index('subscription_status_idx').on(s.status),
    stripeIdx: index('subscription_stripe_idx').on(s.stripeSubscriptionId),
  })
);

export const billing = pgTable(
  'billing',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    teamId: text('team_id').references(() => team.id),
    organizationId: text('organization_id').references(() => organization.id),
    subscriptionId: text('subscription_id').references(() => subscription.id),
    planId: text('plan_id')
      .notNull()
      .references(() => plan.id),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('USD').notNull(),
    billingPeriod: text('billing_period').default('monthly'),
    paid: boolean('paid').default(false).notNull(),
    invoiceUrl: text('invoice_url'),
    provider: text('provider').default('stripe'),
    status: billingStatusEnum('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    dueAt: timestamp('due_at'),
    paidAt: timestamp('paid_at'),
  },
  (b) => ({
    userStatusIdx: index('billing_user_status_idx').on(b.userId, b.status),
  })
);

export const apiKey = pgTable(
  'api_key',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    keyHash: text('key_hash').notNull(),
    name: varchar('name', { length: 100 }),
    userId: text('user_id').references(() => user.id),
    teamId: text('team_id').references(() => team.id),
    organizationId: text('organization_id').references(() => organization.id),
    scope: apiKeyScopeEnum('scope').notNull().default('read'),
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'),
    revokedAt: timestamp('revoked_at'),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    description: text('description'),
  },
  (ak) => ({
    keyHashIdx: index('api_key_hash_idx').on(ak.keyHash),
  })
);

export const webhook = pgTable(
  'webhook',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    url: text('url').notNull(),
    projectId: text('project_id').references(() => project.id),
    teamId: text('team_id').references(() => team.id),
    organizationId: text('organization_id').references(() => organization.id),
    secret: text('secret'),
    events: webhookEventTypeEnum('events').array().notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    lastTriggeredAt: timestamp('last_triggered_at'),
  },
  (w) => ({
    urlIdx: index('webhook_url_idx').on(w.url),
  })
);

export const webhookEvent = pgTable(
  'webhook_event',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    webhookId: text('webhook_id').references(() => webhook.id),
    tenantId: text('tenant_id').notNull(),
    source: text('source').notNull(),
    eventType: webhookEventTypeEnum('event_type').notNull(),
    uniqueRequestId: text('unique_request_id').notNull(),
    payload: jsonb('payload').notNull(),
    processed: boolean('processed').default(false),
    responseStatus: integer('response_status'),
    responseBody: text('response_body'),
    retryCount: integer('retry_count').default(0),
    receivedAt: timestamp('received_at').defaultNow(),
    processedAt: timestamp('processed_at'),
  },
  (we) => ({
    sourceIdx: index('webhook_source_idx').on(we.source),
    requestIdx: index('webhook_request_idx').on(we.uniqueRequestId),
    processedIdx: index('webhook_processed_idx').on(we.processed),
  })
);

export const auditLog = pgTable(
  'audit_log',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    teamId: text('team_id').references(() => team.id),
    organizationId: text('organization_id').references(() => organization.id),
    projectId: text('project_id').references(() => project.id),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    metadata: jsonb('metadata'),
    tenantId: text('tenant_id').notNull(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    location: text('location'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (al) => ({
    userIdx: index('auditlog_user_idx').on(al.userId),
    tenantIdx: index('auditlog_tenant_idx').on(al.tenantId),
    resourceIdx: index('auditlog_resource_idx').on(al.resourceType, al.resourceId),
  })
);

export const rateLimit = pgTable(
  'rate_limit',
  {
    identifier: text('identifier').notNull().primaryKey(),
    tokens: integer('tokens').notNull(),
    lastRefill: timestamp('last_refill', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
  },
  (rl) => ({
    identifierIdx: index('idx_rate_limits_identifier').on(rl.identifier),
  })
);

export const secretAccessLog = pgTable('secret_access_log', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  secretId: text('secret_id')
    .notNull()
    .references(() => secret.id),
  userId: text('user_id').references(() => user.id),
  accessType: text('access_type').notNull(), // "read", "write", "delete"
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  accessedAt: timestamp('accessed_at').defaultNow(),
});
export const secretVersion = pgTable('secret_version', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  secretId: text('secret_id')
    .notNull()
    .references(() => secret.id, { onDelete: 'cascade' }),
  encryptedValue: text('encrypted_value').notNull(),
  version: integer('version').notNull(),
  createdById: text('created_by_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
});
export const secret = pgTable(
  'secret',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    projectEnvironmentId: text('project_environment_id')
      .notNull()
      .references(() => projectEnvironment.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    encryptedValue: text('encrypted_value').notNull(),
    version: integer('version').default(1),
    createdById: text('created_by_id').references(() => user.id),
    tenantId: text('tenant_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (s) => ({
    projectEnvKeyIdx: uniqueIndex('unique_env_key').on(s.projectEnvironmentId, s.key),
  })
);
// ====================== RELATIONS ======================
export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  twoFactor: many(twoFactor),
  passkeys: many(passkey),
  teamMemberships: many(teamMember, { relationName: 'teamMemberUser' }),
  ownedTeams: many(team, { relationName: 'teamOwner' }),
  invitedMembers: many(teamMember, { relationName: 'teamMemberInvitedBy' }),
  ownedOrganizations: many(organization, { relationName: 'organizationOwner' }),
  projects: many(project),
  deploymentsCreated: many(deployment, { relationName: 'deploymentCreator' }),
  apiKeys: many(apiKey),
  auditLogs: many(auditLog),
  subscriptions: many(subscription),
  billings: many(billing),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many, one }) => ({
  owner: one(user, {
    fields: [organization.ownerId],
    references: [user.id],
    relationName: 'organizationOwner',
  }),
  teams: many(team),
  projects: many(project),
  subscriptions: many(subscription),
  billings: many(billing),
  apiKeys: many(apiKey),
}));

export const teamRelations = relations(team, ({ many, one }) => ({
  owner: one(user, {
    fields: [team.ownerId],
    references: [user.id],
    relationName: 'teamOwner',
  }),
  members: many(teamMember),
  projects: many(project),
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  apiKeys: many(apiKey),
  webhooks: many(webhook),
  subscriptions: many(subscription),
  auditLogs: many(auditLog),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  member: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
    relationName: 'teamMemberUser',
  }),
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  invitedBy: one(user, {
    fields: [teamMember.invitedById],
    references: [user.id],
    relationName: 'teamMemberInvitedBy',
  }),
}));

export const projectRelations = relations(project, ({ many, one }) => ({
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [project.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
  deployments: many(deployment),
  environments: many(projectEnvironment),
  webhooks: many(webhook),
}));

export const projectEnvironmentRelations = relations(projectEnvironment, ({ one }) => ({
  project: one(project, {
    fields: [projectEnvironment.projectId],
    references: [project.id],
  }),
}));

export const deploymentRelations = relations(deployment, ({ one, many }) => ({
  project: one(project, {
    fields: [deployment.projectId],
    references: [project.id],
  }),
  environment: one(projectEnvironment, {
    fields: [deployment.environmentId],
    references: [projectEnvironment.id],
  }),
  createdBy: one(user, {
    fields: [deployment.createdById],
    references: [user.id],
    relationName: 'deploymentCreator',
  }),
  logs: many(deploymentLog),
  metrics: many(metric),
}));

export const deploymentLogRelations = relations(deploymentLog, ({ one }) => ({
  deployment: one(deployment, {
    fields: [deploymentLog.deploymentId],
    references: [deployment.id],
  }),
}));

export const metricRelations = relations(metric, ({ one }) => ({
  deployment: one(deployment, {
    fields: [metric.deploymentId],
    references: [deployment.id],
  }),
}));

export const planRelations = relations(plan, ({ many }) => ({
  subscriptions: many(subscription),
  billings: many(billing),
}));

export const subscriptionRelations = relations(subscription, ({ one, many }) => ({
  plan: one(plan, {
    fields: [subscription.planId],
    references: [plan.id],
  }),
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [subscription.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [subscription.organizationId],
    references: [organization.id],
  }),
  billings: many(billing),
}));

export const billingRelations = relations(billing, ({ one }) => ({
  user: one(user, {
    fields: [billing.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [billing.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [billing.organizationId],
    references: [organization.id],
  }),
  subscription: one(subscription, {
    fields: [billing.subscriptionId],
    references: [subscription.id],
  }),
  plan: one(plan, {
    fields: [billing.planId],
    references: [plan.id],
  }),
}));

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  user: one(user, {
    fields: [apiKey.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [apiKey.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [apiKey.organizationId],
    references: [organization.id],
  }),
}));

export const webhookRelations = relations(webhook, ({ one, many }) => ({
  project: one(project, {
    fields: [webhook.projectId],
    references: [project.id],
  }),
  team: one(team, {
    fields: [webhook.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [webhook.organizationId],
    references: [organization.id],
  }),
  events: many(webhookEvent),
}));

export const webhookEventRelations = relations(webhookEvent, ({ one }) => ({
  webhook: one(webhook, {
    fields: [webhookEvent.webhookId],
    references: [webhook.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [auditLog.teamId],
    references: [team.id],
  }),
  organization: one(organization, {
    fields: [auditLog.organizationId],
    references: [organization.id],
  }),
  project: one(project, {
    fields: [auditLog.projectId],
    references: [project.id],
  }),
}));
