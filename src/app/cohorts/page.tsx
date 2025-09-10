import { mockCohorts } from '@/lib/mock-data';
import { CohortsClientPage } from './client-page';

export default function CohortsPage() {
  const cohorts = mockCohorts;
  return <CohortsClientPage cohorts={cohorts} />;
}
