import { integer } from 'drizzle-orm/pg-core';
import { pgTable, boolean, serial, varchar, jsonb, json, text } from 'drizzle-orm/pg-core';
export const USER_TABLE = pgTable('users', {
  id: serial('id').primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull().unique(),
  isMember: boolean().default(false),
});

export const STUDY_MATERIAL_TABLE = pgTable('study_materials', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  diffcultyLevel: varchar().default('Easy'),
  courseLayout: json(),
  createBy: varchar().notNull(),
  status: varchar().default('Generating'),
});

export const Chapter_Notes_TABLE = pgTable('chapter_notes', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: integer().notNull(),
  notes: text(),
});

export const STUDY_TYPE_CONTENT_TABLE = pgTable('study_type_content', {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  type: varchar().notNull(),
  content: json(),
  status: varchar().default('Generating'),
});
