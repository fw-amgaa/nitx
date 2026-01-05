import "dotenv/config";
import { db } from "@/app/db/client";
import { sql } from "drizzle-orm";

export async function getDuplicateAwardsCount() {
  const result = await db.execute(sql`
    SELECT COUNT(*) AS duplicate_count
    FROM awards a
    WHERE EXISTS (
      SELECT 1
      FROM awards b
      WHERE
        a.register = b.register
        AND a.award_name = b.award_name
        AND a.date = b.date
        AND a.id > b.id
    );
  `);

  return Number(result[0].duplicate_count);
}

export async function deleteDuplicateAwards(): Promise<number> {
  const result = await db.execute(sql`
    DELETE FROM awards a
    USING awards b
    WHERE
      a.register = b.register
      AND a.award_name = b.award_name
      AND a.date = b.date
      AND a.id > b.id
    RETURNING a.id;
  `);

  return result.length;
}

getDuplicateAwardsCount()
  .then((r) => {
    console.log("Deleted awards count:", r);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
