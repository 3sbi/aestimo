CREATE TYPE "public"."room_status" AS ENUM('started', 'finished');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'basic');--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"vote_values" json NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "room_status" DEFAULT 'started' NOT NULL,
	"round" integer DEFAULT 1 NOT NULL,
	"password" varchar(255),
	"private" boolean DEFAULT false NOT NULL,
	CONSTRAINT "rooms_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(256) NOT NULL,
	"room_id" integer NOT NULL,
	"role" "role" DEFAULT 'basic' NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"value" json NOT NULL,
	"room_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"round" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;