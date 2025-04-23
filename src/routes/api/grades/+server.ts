import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { grades } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        
        // Validate the data
        if (!data.studentId || !data.subjectId || !data.midtermGrade || !data.finalGrade || !data.semester || !data.year) {
            return json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Insert the grade into the database
        const result = await db.insert(grades).values({
            studentId: data.studentId,
            subjectId: data.subjectId,
            midtermGrade: data.midtermGrade,
            finalGrade: data.finalGrade,
            semester: data.semester,
            year: data.year,
            createdAt: new Date()
        });

        return json({ success: true, data: result });
    } catch (error) {
        console.error('Error submitting grade:', error);
        return json({ success: false, error: 'Failed to submit grade' }, { status: 500 });
    }
}; 