CREATE TYPE "public"."api_key_scope" AS ENUM('read', 'write', 'admin');--> statement-breakpoint
CREATE TYPE "public"."billing_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."deployment_status" AS ENUM('pending', 'building', 'deploying', 'running', 'success', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('single_device', 'multi_device');--> statement-breakpoint
CREATE TYPE "public"."env_type" AS ENUM('development', 'staging', 'production');--> statement-breakpoint
CREATE TYPE "public"."log_level" AS ENUM('debug', 'info', 'warn', 'error', 'fatal');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('pending', 'active', 'inactive', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."transports" AS ENUM('usb', 'nfc', 'ble', 'internal');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."webhook_event_type" AS ENUM('deployment_started', 'deployment_success', 'deployment_failed', 'billing_updated', 'team_invite', 'project_created');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"token_type" text,
	"session_state" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tenant_id" text
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" text PRIMARY KEY NOT NULL,
	"key_hash" text NOT NULL,
	"name" varchar(100),
	"user_id" text,
	"team_id" text,
	"organization_id" text,
	"scope" "api_key_scope" DEFAULT 'read' NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text,
	"organization_id" text,
	"project_id" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"metadata" jsonb,
	"tenant_id" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"location" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "billing" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text,
	"organization_id" text,
	"subscription_id" text,
	"plan_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"billing_period" text DEFAULT 'monthly',
	"paid" boolean DEFAULT false NOT NULL,
	"invoice_url" text,
	"provider" text DEFAULT 'stripe',
	"status" "billing_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"due_at" timestamp,
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "deployment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"environment_id" text,
	"status" "deployment_status" DEFAULT 'pending' NOT NULL,
	"commit_hash" text,
	"commit_message" text,
	"branch" text,
	"image_url" text,
	"build_logs" text,
	"deployment_url" text,
	"tenant_id" text NOT NULL,
	"created_by_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "deployment_log" (
	"id" text PRIMARY KEY NOT NULL,
	"deployment_id" text NOT NULL,
	"service_name" varchar(100),
	"container_name" varchar(100),
	"daemon" varchar(100),
	"request_id" text,
	"level" "log_level" DEFAULT 'info',
	"message" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "metric" (
	"id" text PRIMARY KEY NOT NULL,
	"deployment_id" text NOT NULL,
	"cpu_usage" real NOT NULL,
	"memory_usage" real NOT NULL,
	"disk_usage" real,
	"network_in" real,
	"network_out" real,
	"uptime" real,
	"response_time" real,
	"request_count" integer,
	"error_count" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"billing_email" text,
	"owner_id" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" "device_type" NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" "transports"[],
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	CONSTRAINT "passkey_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" real NOT NULL,
	"interval" text DEFAULT 'monthly',
	"stripe_price_id" text NOT NULL,
	"features" jsonb NOT NULL,
	"feature_list" jsonb,
	"max_projects" integer DEFAULT 1 NOT NULL,
	"max_deployments" integer DEFAULT 5 NOT NULL,
	"max_team_members" integer DEFAULT 1 NOT NULL,
	"max_environments" integer DEFAULT 3 NOT NULL,
	"is_trial" boolean DEFAULT false,
	"trial_days" integer DEFAULT 14,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plan_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"tenant_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"team_id" text,
	"organization_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"repository_url" text,
	"framework" text,
	"production_branch" text DEFAULT 'main',
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_environment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "env_type" DEFAULT 'development' NOT NULL,
	"env_vars" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"identifier" text PRIMARY KEY NOT NULL,
	"tokens" integer NOT NULL,
	"last_refill" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"tenant_id" text,
	"active_organization_id" text,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"user_id" text,
	"team_id" text,
	"organization_id" text,
	"reference_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" "billing_status" DEFAULT 'pending',
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"seats" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"trial_start" timestamp,
	"trial_end" timestamp
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"organization_id" text,
	"is_deleted" boolean DEFAULT false,
	"tenant_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"avatar_url" text
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"role" "user_role" DEFAULT 'user',
	"invited_by_id" text,
	"status" "member_status" DEFAULT 'pending' NOT NULL,
	"joined_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" json NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" text,
	"last_name" text,
	"password" text,
	"role" "user_role" DEFAULT 'user',
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"stripe_current_period_end" timestamp,
	"tenant_id" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"two_factor_enabled" boolean DEFAULT false,
	"last_login_at" timestamp,
	"preferred_language" text DEFAULT 'en',
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "user_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "user_account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"tenant_id" text,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"value" text,
	"expires" timestamp NOT NULL,
	"tenant_id" text,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token"),
	CONSTRAINT "verification_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "webhook" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"project_id" text,
	"team_id" text,
	"organization_id" text,
	"secret" text,
	"events" "webhook_event_type"[] NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_triggered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "webhook_event" (
	"id" text PRIMARY KEY NOT NULL,
	"webhook_id" text,
	"tenant_id" text NOT NULL,
	"source" text NOT NULL,
	"event_type" "webhook_event_type" NOT NULL,
	"unique_request_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"processed" boolean DEFAULT false,
	"response_status" integer,
	"response_body" text,
	"retry_count" integer DEFAULT 0,
	"received_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing" ADD CONSTRAINT "billing_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment" ADD CONSTRAINT "deployment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment" ADD CONSTRAINT "deployment_environment_id_project_environment_id_fk" FOREIGN KEY ("environment_id") REFERENCES "public"."project_environment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment" ADD CONSTRAINT "deployment_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment_log" ADD CONSTRAINT "deployment_log_deployment_id_deployment_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric" ADD CONSTRAINT "metric_deployment_id_deployment_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_environment" ADD CONSTRAINT "project_environment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_invited_by_id_user_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_event_webhook_id_webhook_id_fk" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhook"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_key_hash_idx" ON "api_key" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "auditlog_user_idx" ON "audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auditlog_tenant_idx" ON "audit_log" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "auditlog_resource_idx" ON "audit_log" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "billing_user_status_idx" ON "billing" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "deployment_project_status_idx" ON "deployment" USING btree ("project_id","status");--> statement-breakpoint
CREATE INDEX "deployment_created_at_idx" ON "deployment" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "log_deployment_idx" ON "deployment_log" USING btree ("deployment_id");--> statement-breakpoint
CREATE INDEX "log_created_at_idx" ON "deployment_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "log_request_id_idx" ON "deployment_log" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "metric_deployment_idx" ON "metric" USING btree ("deployment_id");--> statement-breakpoint
CREATE INDEX "plan_price_idx" ON "plan" USING btree ("price");--> statement-breakpoint
CREATE INDEX "project_env_idx" ON "project_environment" USING btree ("project_id","name");--> statement-breakpoint
CREATE INDEX "idx_rate_limits_identifier" ON "rate_limit" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "subscription_status_idx" ON "subscription" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscription_stripe_idx" ON "subscription" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_team_index" ON "team_member" USING btree ("user_id","team_id");--> statement-breakpoint
CREATE INDEX "webhook_url_idx" ON "webhook" USING btree ("url");--> statement-breakpoint
CREATE INDEX "webhook_source_idx" ON "webhook_event" USING btree ("source");--> statement-breakpoint
CREATE INDEX "webhook_request_idx" ON "webhook_event" USING btree ("unique_request_id");--> statement-breakpoint
CREATE INDEX "webhook_processed_idx" ON "webhook_event" USING btree ("processed");