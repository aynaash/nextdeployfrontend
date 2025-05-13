CREATE TABLE "team_members" (
	"id" text,
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"key" varchar(255) NOT NULL,
	"label" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"revoked" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "deployment_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"deployment_id" text NOT NULL,
	"message" text NOT NULL,
	"level" text DEFAULT 'info',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"deployment_id" text NOT NULL,
	"cpu_usage" real NOT NULL,
	"memory_usage" real NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"interval" text DEFAULT 'monthly',
	"stripe_price_id" text NOT NULL,
	"features" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project_environments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"env_vars" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp DEFAULT now(),
	"processed" boolean DEFAULT false,
	"tenant_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment_logs" ADD CONSTRAINT "deployment_logs_deployment_id_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_deployment_id_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_environments" ADD CONSTRAINT "project_environments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "log_deployment_idx" ON "deployment_logs" USING btree ("deployment_id");--> statement-breakpoint
CREATE INDEX "plan_price_idx" ON "plans" USING btree ("price");--> statement-breakpoint
CREATE INDEX "env_project_idx" ON "project_environments" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "webhook_source_idx" ON "webhook_events" USING btree ("source");