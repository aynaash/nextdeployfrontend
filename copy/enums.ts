import {pgEnum} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("UserRole", ["ADMIN", "USER"]);

export const deploymentStatusEnum = pgEnum("DeploymentStatus", [
  "PENDING",
  "RUNNING",
  "SUCCESS",
  "FAILED",
]);

export const billingStatusEnum = pgEnum("billingStatus", [
  "PENDING",
  "PAID",
  "FAILED",
])
