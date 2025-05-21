import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  userAccounts,
  sessions,
  verificationTokens,
  projects,
  deployments,
  billings,
  teams,
  teamMembers,
  auditLogs,
  webhooks,
  apiKeys,
  metrics,
} from "./tables"; // Adjust import path based on your project structure

// Users
export const usersRelations = relations(users, ({ many }) => ({
  userAccounts: many(userAccounts),
  projects: many(projects),
  billings: many(billings),
  sessions: many(sessions),
  teamMemberships: many(teamMembers),
  auditLogs: many(auditLogs),
  apiKeys: many(apiKeys),
}));

// Accounts
export const accountsRelations = relations(accounts, ({ many }) => ({
  userAccounts: many(userAccounts),
}));

// UserAccount (pivot)
export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, { fields: [userAccounts.userId], references: [users.id] }),
  account: one(accounts, {
    fields: [userAccounts.accountId],
    references: [accounts.id],
  }),
}));

// Sessions
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Projects
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  deployments: many(deployments),
  webhooks: many(webhooks),
}));

// Deployments
export const deploymentsRelations = relations(deployments, ({ one }) => ({
  project: one(projects, {
    fields: [deployments.projectId],
    references: [projects.id],
  }),
}));

// Billings
export const billingsRelations = relations(billings, ({ one }) => ({
  user: one(users, { fields: [billings.userId], references: [users.id] }),
}));

// Teams
export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  auditLogs: many(auditLogs),
  apiKeys: many(apiKeys),
}));

// TeamMembers (pivot)
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
}));

// AuditLogs
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
  team: one(teams, { fields: [auditLogs.teamId], references: [teams.id] }),
}));

// ApiKeys
export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
  team: one(teams, { fields: [apiKeys.teamId], references: [teams.id] }),
}));

// Webhooks
export const webhooksRelations = relations(webhooks, ({ one }) => ({
  project: one(projects, {
    fields: [webhooks.projectId],
    references: [projects.id],
  }),
}));

// Metrics
export const metricsRelations = relations(metrics, ({ one }) => ({
  project: one(projects, {
    fields: [metrics.projectId],
    references: [projects.id],
  }),
}));
