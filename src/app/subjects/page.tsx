import { mockSubjects, mockFaculties } from '@/lib/mock-data';
import { SubjectsClientPage } from './client-page';

export default function SubjectsPage() {
  const subjects = mockSubjects;
  const faculties = mockFaculties;
  return <SubjectsClientPage subjects={subjects} faculties={faculties} allSubjects={subjects} />;
}