import { varchar, uuid, pgTable as table, timestamp, boolean, jsonb, text} from "drizzle-orm/pg-core";

export const culturalProfile = table( "culturalProfile",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    userId: varchar({ length: 255 }).default(""),
    preferences: jsonb("preferences").default({}),
    tasteMap: jsonb("tasteMap").default([]),
    tasteData: jsonb("tasteData").default([]),
    personalityTraits: jsonb("personalityTraits").default([]),
    culturalAffinities: jsonb("culturalAffinities").default([]),
    completedOnboarding: boolean("completedOnboarding").default(false),
    lastUpdated: timestamp("lastUpdated", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("createdAt", {withTimezone: true}).defaultNow(), 
  } 
);

export const destination = table( "destination",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    userId: varchar({ length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).default(""),
    country: varchar("country", { length: 100 }).default(""),
    description: text("description").default(""),
    imageUrl: varchar("imageUrl", { length: 500 }).default(""),
    highlights: jsonb("highlights").default([]),
    recommendations: jsonb("recommendations").default([]),
    coordinates: jsonb("coordinates").default({}),
    culturalTags: jsonb("culturalTags").default([]),
    isActive: boolean("isActive").default(true),
    lastUpdated: timestamp("lastUpdated", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("createdAt", {withTimezone: true}).defaultNow(), 
  } 
);