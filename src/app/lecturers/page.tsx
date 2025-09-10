import { mockLecturers } from '@/lib/mock-data';
import { LecturersClientPage } from './client-page';

export default function LecturersPage() {
  const lecturers = mockLecturers;
  return <LecturersClientPage lecturers={lecturers} />;
}
