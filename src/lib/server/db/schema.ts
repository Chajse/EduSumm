import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age').notNull(),
	name: text('name').notNull(),
	email: text('email').notNull()
});

export const grades = sqliteTable('grades', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	studentId: text('student_id').notNull(),
	subjectId: text('subject_id').notNull(),
	midtermGrade: real('midterm_grade').notNull(),
	finalGrade: real('final_grade').notNull(),
	semester: text('semester').notNull(),
	year: integer('year').notNull(),
	createdAt: text('created_at').notNull()
});
