import { OverviewStats } from './overview-stats';
import GpaChart from './gpa-chart';
import { mockStudents, mockGpaDistribution } from '@/lib/mock-data';
import StudentRankingTable from './student-ranking-table';
import PerformanceAlerts from './performance-alerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Phân tích Hiệu suất</h1>
      </div>

      <OverviewStats />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Phân bố GPA</CardTitle>
            <CardDescription>
              Phân bố điểm GPA của sinh viên trong học kỳ này.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <GpaChart data={mockGpaDistribution} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Cảnh báo học tập</CardTitle>
            <CardDescription>
              Sinh viên có kết quả học tập không đạt yêu cầu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceAlerts students={mockStudents} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Xếp hạng sinh viên</CardTitle>
          <CardDescription>Top sinh viên có GPA cao nhất.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentRankingTable students={mockStudents} />
        </CardContent>
      </Card>
    </div>
  );
}
