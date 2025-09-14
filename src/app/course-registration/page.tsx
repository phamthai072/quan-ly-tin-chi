import { mockSubjects, mockSemesters, mockFaculties, mockLecturers, mockStudents } from '@/lib/mock-data';
import { CourseRegistrationClientPage } from './client-page';

export default function CourseRegistrationPage() {
  const subjects = mockSubjects;
  const semesters = mockSemesters;
  const faculties = mockFaculties;
  const lecturers = mockLecturers;
  const students = mockStudents;

  // In a real app, you would probably fetch available course sections instead of all subjects
  const courseSections = subjects.map(subject => ({
      id: `${subject.id}-01`,
      subjectId: subject.id,
      subjectName: subject.name,
      credits: subject.credits,
      maxStudents: 100,
      currentStudents: Math.floor(Math.random() * 100),
      lecturerName: lecturers.find(l => subject.lecturerIds.includes(l.id))?.name || 'N/A',
      schedule: 'Thứ 2, Tiết 1-3, P.301-A2',
      facultyId: subject.facultyId,
      semesterId: semesters[0].id, // Assume all are for the first semester for now
  }));

  return (
    <CourseRegistrationClientPage 
      sections={courseSections} 
      semesters={semesters}
      faculties={faculties}
      students={students}
    />
  );
}
