CREATE TYPE "public"."device_type" AS ENUM('singleDevice', 'multiDevice');--> statement-breakpoint
CREATE TYPE "public"."transports" AS ENUM('usb', 'nfc', 'ble', 'internal');--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credential_id" text NOT NULL,
	"user_id" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"credential_public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"credential_device_type" "device_type" NOT NULL,
	"credential_backed_up" boolean NOT NULL,
	"transports" text[],
	CONSTRAINT "authenticators_user_id_credential_id_pk" PRIMARY KEY("user_id","credential_id"),
	CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;