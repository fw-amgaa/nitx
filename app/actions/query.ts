"use server";

import { db } from "../db/client";

export type Award = Awaited<ReturnType<typeof awardsList>>[number];

export const awardsList = async () => {
  const awards = await db.query.awards.findMany();
  return awards;
};
