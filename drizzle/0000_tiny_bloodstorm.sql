CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"voteType" "voteType" NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'started' NOT NULL,
	"votingRound" integer DEFAULT 1 NOT NULL,
	"cardsOpened" boolean DEFAULT false NOT NULL,
	"password" varchar(255) NOT NULL,
	"private" boolean DEFAULT false NOT NULL,
	CONSTRAINT "rooms_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"roomId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'basic' NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"value" json NOT NULL,
	"roomId" integer NOT NULL,
	"userId" integer NOT NULL,
	"votingRound" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"values" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"roomId" integer
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_types" ADD CONSTRAINT "vote_types_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;