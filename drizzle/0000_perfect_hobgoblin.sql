CREATE TABLE "contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"input" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"duration" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"isOk" boolean DEFAULT false,
	"type" varchar(20) DEFAULT 'CHAT',
	"author" varchar(255) NOT NULL,
	"idClerk" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "contents_id_unique" UNIQUE("id")
);
