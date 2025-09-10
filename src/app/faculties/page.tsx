import { mockFaculties } from '@/lib/mock-data';
import { FacultiesClientPage } from './client-page';

export default function FacultiesPage() {
  const faculties = mockFaculties;
  return <FacultiesClientPage faculties={faculties} />;
}
