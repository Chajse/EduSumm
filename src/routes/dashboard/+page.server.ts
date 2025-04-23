import { db } from '$lib/server/db';
import { grades, students, subjects } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    try {
        // Fetch all grades with student and subject information
        const gradesData = await db
            .select({
                grade: grades,
                student: students,
                subject: subjects
            })
            .from(grades)
            .leftJoin(students, eq(grades.studentId, students.id))
            .leftJoin(subjects, eq(grades.subjectId, subjects.id));

        // Calculate statistics
        const totalStudents = new Set(gradesData.map(g => g.grade.studentId)).size;
        
        // Calculate average grade
        const allGrades = gradesData.flatMap(g => [
            g.grade.midtermGrade || 0,
            g.grade.finalGrade || 0
        ]).filter(grade => grade > 0);
        
        const averageGrade = allGrades.length > 0
            ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
            : 0;

        // Calculate grade distribution
        const gradeDistribution = {
            midterm: calculateGradeDistribution(gradesData.map(g => g.grade.midtermGrade)),
            finals: calculateGradeDistribution(gradesData.map(g => g.grade.finalGrade))
        };

        // Get recent activities
        const recentGrades = gradesData
            .slice(-5)
            .map(g => ({
                action: `Grade recorded for ${g.student?.firstName} ${g.student?.lastName} in ${g.subject?.subjectName}`,
                time: 'Recently',
                type: 'grades'
            }));

        return {
            stats: {
                totalStudents,
                averageGrade,
                enrollmentRate: totalStudents > 0 ? 100 : 0 // Placeholder for now
            },
            gradeDistribution,
            recentActivities: recentGrades
        };
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        return {
            stats: {
                totalStudents: 0,
                averageGrade: 0,
                enrollmentRate: 0
            },
            gradeDistribution: {
                midterm: defaultGradeDistribution(),
                finals: defaultGradeDistribution()
            },
            recentActivities: []
        };
    }
};

function calculateGradeDistribution(grades: (number | null | undefined)[]) {
    const distribution = defaultGradeDistribution();
    
    grades.forEach(grade => {
        if (grade === null || grade === undefined) return;
        
        if (grade >= 90) distribution['90-100']++;
        else if (grade >= 80) distribution['80-89']++;
        else if (grade >= 70) distribution['70-79']++;
        else if (grade >= 60) distribution['60-69']++;
        else distribution['Below 60']++;
    });
    
    return distribution;
}

function defaultGradeDistribution() {
    return {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        'Below 60': 0
    };
} 