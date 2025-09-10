import { mockSubjects, mockFaculties, mockLecturers } from '@/lib/mock-data';
import { SubjectsClientPage } from './client-page';

export default function SubjectsPage() {
  const subjects = mockSubjects;
  const faculties = mockFaculties;
  const lecturers = mockLecturers;
  return <SubjectsClientPage subjects={subjects} faculties={faculties} allSubjects={subjects} lecturers={lecturers} />;
}
