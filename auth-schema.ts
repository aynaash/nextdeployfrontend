import { postgresqlTable, text, timestamp, boolean, integer } from "drizzle-orm/postgresql-core";

export const user = postgresqlTable("user", {
					id: text('id').primaryKey(),
					name: undefined.notNull(),
 email: undefined.notNull().unique(),
 emailVerified: undefined.$defaultFn(() => false).notNull(),
 image: undefined,
 createdAt: undefined.$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: undefined.$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 twoFactorEnabled: undefined,
 role: undefined,
 banned: undefined,
 banReason: undefined,
 banExpires: undefined,
 stripeCustomerId: undefined
				});

export const session = postgresqlTable("session", {
					id: text('id').primaryKey(),
					expiresAt: undefined.notNull(),
 token: undefined.notNull().unique(),
 createdAt: undefined.notNull(),
 updatedAt: undefined.notNull(),
 ipAddress: undefined,
 userAgent: undefined,
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 activeOrganizationId: undefined,
 impersonatedBy: undefined
				});

export const account = postgresqlTable("account", {
					id: text('id').primaryKey(),
					accountId: undefined.notNull(),
 providerId: undefined.notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: undefined,
 refreshToken: undefined,
 idToken: undefined,
 accessTokenExpiresAt: undefined,
 refreshTokenExpiresAt: undefined,
 scope: undefined,
 password: undefined,
 createdAt: undefined.notNull(),
 updatedAt: undefined.notNull()
				});

export const verification = postgresqlTable("verification", {
					id: text('id').primaryKey(),
					identifier: undefined.notNull(),
 value: undefined.notNull(),
 expiresAt: undefined.notNull(),
 createdAt: undefined.$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: undefined.$defaultFn(() => /* @__PURE__ */ new Date())
				});

export const twoFactor = postgresqlTable("two_factor", {
					id: text('id').primaryKey(),
					secret: undefined.notNull(),
 backupCodes: undefined.notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const passkey = postgresqlTable("passkey", {
					id: text('id').primaryKey(),
					name: undefined,
 publicKey: undefined.notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 credentialID: undefined.notNull(),
 counter: undefined.notNull(),
 deviceType: undefined.notNull(),
 backedUp: undefined.notNull(),
 transports: undefined,
 createdAt: undefined
				});

export const organization = postgresqlTable("organization", {
					id: text('id').primaryKey(),
					name: undefined.notNull(),
 slug: undefined.unique(),
 logo: undefined,
 createdAt: undefined.notNull(),
 metadata: undefined
				});

export const member = postgresqlTable("member", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 role: undefined.default(member).notNull(),
 createdAt: undefined.notNull()
				});

export const invitation = postgresqlTable("invitation", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 email: undefined.notNull(),
 role: undefined,
 status: undefined.default(pending).notNull(),
 expiresAt: undefined.notNull(),
 inviterId: text('inviter_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const subscription = postgresqlTable("subscription", {
					id: text('id').primaryKey(),
					plan: undefined.notNull(),
 referenceId: undefined.notNull(),
 stripeCustomerId: undefined,
 stripeSubscriptionId: undefined,
 status: undefined.default(incomplete),
 periodStart: undefined,
 periodEnd: undefined,
 cancelAtPeriodEnd: undefined,
 seats: undefined
				});
