import { mockClassrooms } from '@/lib/mock-data';
import { ClassroomsClientPage } from './client-page';

export default function ClassroomsPage() {
  const classrooms = mockClassrooms;
  return <ClassroomsClientPage classrooms={classrooms} />;
}
