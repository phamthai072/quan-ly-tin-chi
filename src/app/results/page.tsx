import { mockResults, mockSemesters, mockStudents, mockSubjects } from "@/lib/mock-data";
import { ResultsClientPage } from "./client-page";

export default function ResultsPage() {

    const resultsWithDetails = mockResults.map(result => {
        const student = mockStudents.find(s => s.id === result.studentId);
        const subject = mockSubjects.find(s => s.id === result.subjectId);
        const semester = mockSemesters.find(s => s.id === result.semesterId);

        return {
            ...result,
            studentName: student?.name || 'N/A',
            subjectName: subject?.name || 'N/A',
            semesterName: `${semester?.name} - ${semester?.schoolYear}` || 'N/A',
        }
    })

    return (
        <ResultsClientPage 
            results={resultsWithDetails}
            students={mockStudents}
            semesters={mockSemesters}
            subjects={mockSubjects}
        />
    );
}
