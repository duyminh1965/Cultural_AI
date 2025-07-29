ALTER TABLE "culturalProfile" ALTER COLUMN "userId" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "preferences" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "preferences" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "tasteMap" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "tasteMap" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "personalityTraits" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "personalityTraits" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "culturalAffinities" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "culturalProfile" ALTER COLUMN "culturalAffinities" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "culturalProfile" ADD COLUMN "tasteData" jsonb DEFAULT '[]'::jsonb;