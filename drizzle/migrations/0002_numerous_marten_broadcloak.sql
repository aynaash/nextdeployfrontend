CREATE TYPE "public"."member_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."api_key_scope" AS ENUM('read', 'write', 'admin');--> statement-breakpoint
CREATE TYPE "public"."env_type" AS ENUM('development', 'staging', 'production');--> statement-breakpoint
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "metrics" DROP CONSTRAINT "metrics_deployment_id_deployments_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "invited_by_user_id" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "status" "member_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "tenant_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "key_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "team_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "scope" "api_key_scope" DEFAULT 'read' NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "last_used_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "is_revoked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "disk_usage" real;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "network_in" real;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "network_out" real;--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "uptime" real;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "feature_list" jsonb;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "max_projects" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "max_deployments" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "max_team_members" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "is_trial" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "trial_days" integer DEFAULT 14;--> statement-breakpoint
ALTER TABLE "project_environments" ADD COLUMN "type" "env_type" DEFAULT 'development' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_environments" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "project_environments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "event_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "unique_request_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "response_status" integer;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "processed_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_deployment_id_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "webhook_request_idx" ON "webhook_events" USING btree ("unique_request_id");--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "revoked";