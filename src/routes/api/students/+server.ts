import { db } from '$lib/server/db';
import { students, grades, enrollmentHistory } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm'; // Import the eq function

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const data = await db.select().from(students);
    return json({ data: data });
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { firstName, lastName, birthdate, email, gender, course, year, block } = await request.json();

        await db.insert(students).values({
            firstName,
            lastName,
            birthdate,
            email,
            gender,
            course,
            year,
            block
        });

        return json({ success: true, message: 'Student added successfully' });
    } catch (error) {
        return json({ error: 'Failed to add student' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { id, firstName, lastName, birthdate, email, gender, course, year, block } = await request.json();

        if (!id || !firstName || !lastName) {
            return json({ error: 'Missing required fields (id, firstName, lastName)' }, { status: 400 });
        }

        // Perform the update operation
        const updatedStudent = await db
            .update(students)
            .set({
                firstName,
                lastName,
                birthdate,
                email,
                gender,
                course,
                year,
                block,
            })
            .where(eq(students.id, id)); // Use eq to compare the id

        // Check if the update affected any rows
        if (updatedStudent?.rowsAffected === 0) {
            return json({ error: 'Student not found' }, { status: 404 });
        }

        return json({ success: true, message: 'Student updated successfully' });
    } catch (error) {
        return json({ error: 'Failed to update student' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return json({ error: 'Missing student ID' }, { status: 400 });
        }

        // Start a transaction to ensure all operations succeed or fail together
        await db.transaction(async (tx) => {
            // Delete related grades first
            await tx.delete(grades)
                .where(eq(grades.studentId, id));

            // Delete related enrollment history
            await tx.delete(enrollmentHistory)
                .where(eq(enrollmentHistory.studentId, id));

            // Finally, delete the student
            const result = await tx.delete(students)
                .where(eq(students.id, id));

            if (!result) {
                throw new Error('Student not found');
            }
        });

        return json({ success: true, message: 'Student and related records deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return json({ 
            error: 'Failed to delete student and related records',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
};