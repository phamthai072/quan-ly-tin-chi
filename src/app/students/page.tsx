import { mockStudents } from '@/lib/mock-data';
import { StudentsClientPage } from './client-page';

export default function StudentsPage() {
  const students = mockStudents;
  return <StudentsClientPage students={students} />;
}
