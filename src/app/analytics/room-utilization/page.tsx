import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRoomUtilization } from "@/lib/mock-data";
import RoomUsageChart from "./room-usage-chart";
import RoomUsageTable from "./room-usage-table";

export default function RoomUtilizationPage() {
  const data = mockRoomUtilization;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Phân tích sử dụng phòng</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Tần suất sử dụng phòng học</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomUsageChart data={data} />
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Chi tiết sử dụng phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomUsageTable data={data} />
          </CardContent>
        </Card>
    </div>
  );
}
