CREATE TABLE "culturalProfile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"preferences" jsonb NOT NULL,
	"tasteMap" jsonb NOT NULL,
	"personalityTraits" jsonb NOT NULL,
	"culturalAffinities" jsonb NOT NULL,
	"completedOnboarding" boolean DEFAULT false,
	"lastUpdated" timestamp with time zone DEFAULT now(),
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "culturalProfile_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "destination" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) DEFAULT '',
	"country" varchar(100) DEFAULT '',
	"description" text DEFAULT '',
	"imageUrl" varchar(500) DEFAULT '',
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"coordinates" jsonb DEFAULT '{}'::jsonb,
	"culturalTags" jsonb DEFAULT '[]'::jsonb,
	"isActive" boolean DEFAULT true,
	"lastUpdated" timestamp with time zone DEFAULT now(),
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "destination_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DROP TABLE "contents" CASCADE;