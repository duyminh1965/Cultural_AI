"use server";
import { db } from "@/database/drizzle";
import { contents } from "@/database/schema";
import { eq, asc, and, desc } from "drizzle-orm";

export const addContent = async (
    params: messageAi) => {
        try {
            const response = await db.insert(contents).values({...params}).returning();
            console.log("Content added successfully:", response);
            return true;
        } catch (error) {
            console.error("Error adding content:", error);
            return false;
            
        }
    }

export const getQueueContent = async (): Promise<messageAi[]> => {
    const type = "IMAGE";
    try {
        const dataContent = await db.select().from(contents).where(eq(contents.type, type)).orderBy(desc(contents.date)).limit(4) as messageAi[];
        console.log("Queue content:", dataContent);
        return dataContent;
    } catch (error) {
        console.error("Error fetching queue content:", error);
        return [] as messageAi[];

    }
}

export const getContent = async ({ type, idClerk, date }: ContentProps): Promise<messageAi[]> => {
    try {
        const dataContent = await db.select().from(contents).where(and(eq(contents.type, type), eq(contents.idClerk, idClerk))) as messageAi[];
        // console.log("Queue content:", dataContent, "type:", type, "idClerk:", idClerk, "date:", date);
        return dataContent;
    } catch (error) {
        console.error("Error fetching queue content:", error);
        return [] as messageAi[];

    }
}