import { pgTable, serial, text, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    createdAt: text('created_at').default(new Date().toISOString()),
});

export const quranProgress = pgTable('quran_progress', {
    id: serial('id').primaryKey(),
    userId: integer('user_id'),
    day: integer('day').notNull(),
    fromPage: integer('from_page'),
    toPage: integer('to_page'),
    updatedAt: text('updated_at').default(new Date().toISOString()),
});

export const dailyTasks = pgTable('daily_tasks', {
    id: serial('id').primaryKey(),
    userId: integer('user_id'),
    day: integer('day').notNull(),
    taskIndex: integer('task_index').notNull(),
    isCompleted: boolean('is_completed').default(false),
    updatedAt: text('updated_at').default(new Date().toISOString()),
});
