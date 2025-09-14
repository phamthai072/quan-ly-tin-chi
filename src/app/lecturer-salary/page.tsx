import { mockLecturers, mockSemesters, mockCourseSections, mockSubjects } from "@/lib/mock-data";
import { LecturerSalaryClientPage } from "./client-page";

export default function LecturerSalaryPage() {
    const lecturers = mockLecturers;
    const semesters = mockSemesters;
    const courseSections = mockCourseSections;
    const subjects = mockSubjects;

    return (
        <LecturerSalaryClientPage 
            lecturers={lecturers}
            semesters={semesters}
            courseSections={courseSections}
            subjects={subjects}
        />
    )
}