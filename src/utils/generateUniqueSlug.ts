import "server-only";

import { db, roomsTable } from "@/server/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function generateUniqueSlug(
  prefix: string = "",
  length: number = 6
): Promise<string> {
  let slug: string;
  let isUnique = false;

  while (!isUnique) {
    slug = prefix ? prefix + "-" + nanoid(length) : nanoid(length);
    const existing = await db
      .select({ slug: roomsTable.slug })
      .from(roomsTable)
      .where(eq(roomsTable.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      isUnique = true;
    }
  }

  return slug!;
}
