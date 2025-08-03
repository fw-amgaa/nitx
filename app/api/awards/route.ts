import { NextRequest, NextResponse } from "next/server";
import { and, ilike } from "drizzle-orm";
import { awards } from "@/app/db/schema";
import { db } from "@/app/db/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const register = searchParams.get("register");

    const conditions = [];

    if (firstName) {
      conditions.push(ilike(awards.firstName, `%${firstName}%`));
    }

    if (lastName) {
      conditions.push(ilike(awards.lastName, `%${lastName}%`));
    }

    if (register) {
      conditions.push(ilike(awards.register, `%${register}%`));
    }

    const files = await db.query.files.findMany();

    const result = await db
      .select()
      .from(awards)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(100);

    result.forEach((award) => {
      const file = files.find((file) => file.nitxCode === award.nitxCode);
      if (file) {
        award.url = file.url;
      }
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to fetch awards:", error);
    return NextResponse.json(
      { success: false, message: "Шагналын мэдээлэл татаж чадсангүй." },
      { status: 500 }
    );
  }
}
