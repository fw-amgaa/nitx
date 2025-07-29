import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  register: text("register").notNull(),
  awardName: text("award_name").notNull(),
  nitxCode: varchar("nitx_code", { length: 3 }).notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  url: text("url"),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),

  url: text("url").notNull(),
  nitxCode: varchar("nitx_code", { length: 3 }).notNull(),
});
