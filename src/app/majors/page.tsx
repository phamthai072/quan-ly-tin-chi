import { mockMajors, mockFaculties } from '@/lib/mock-data';
import { MajorsClientPage } from './client-page';

export default function MajorsPage() {
  const majors = mockMajors;
  const faculties = mockFaculties;
  return <MajorsClientPage majors={majors} faculties={faculties} />;
}
