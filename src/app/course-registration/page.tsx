import { mockSubjects, mockSemesters, mockFaculties, mockLecturers, mockStudents, mockCourseSections } from '@/lib/mock-data';
import { CourseRegistrationClientPage } from './client-page';

export default function CourseRegistrationPage() {
  const semesters = mockSemesters;
  const faculties = mockFaculties;
  const students = mockStudents;
  const courseSections = mockCourseSections;

  const sectionsWithDetails = courseSections.map(section => {
    const subject = mockSubjects.find(s => s.id === section.subjectId);
    const lecturer = mockLecturers.find(l => l.id === section.lecturerId);
    return {
      ...section,
      subjectName: subject?.name || 'N/A',
      credits: subject?.credits || 0,
      currentStudents: Math.floor(Math.random() * section.maxStudents),
      lecturerName: lecturer?.name || 'N/A',
      facultyId: subject?.facultyId || 'N/A',
    }
  });


  return (
    <CourseRegistrationClientPage 
      sections={sectionsWithDetails} 
      semesters={semesters}
      faculties={faculties}
      students={students}
    />
  );
}
