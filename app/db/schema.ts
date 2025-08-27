import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  register: text("register").notNull(),
  awardName: text("award_name").notNull(),
  date: text("date").notNull(),
  awardOrder: text("award_order"),
  nitxCode: varchar("nitx_code").notNull(),
  status: text("status").notNull(),
  url: text("url"),
  awardedDate: text("awarded_date"),
  medalNumber: text("medal_number"),
  pageNumber: text("page_number"),
  pageUrl: text("page_url"),
  details: text("details"),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  nitxCode: varchar("nitx_code").notNull(),

  key: text("key").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const pageFiles = pgTable("page_files", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  nitxCode: varchar("nitx_code").notNull(),
  pageNumber: text("page_number").notNull(),

  key: text("key").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});
