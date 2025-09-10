import { mockSemesters } from '@/lib/mock-data';
import { SemestersClientPage } from './client-page';

export default function SemestersPage() {
  const semesters = mockSemesters;
  return <SemestersClientPage semesters={semesters} />;
}
