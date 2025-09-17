"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import RoomUsageChart from "./room-usage-chart";
import RoomUsageTable from "./room-usage-table";

// Types for database data
type Semester = {
  ma_hk: string;
  ten_hk: string;
  nam_hoc: string;
};

type RoomUsageData = {
  ma_phong: string;
  ten_phong: string;
  suc_chua: number;
  so_gio_su_dung: number;
  so_lop_hoc_phan: number;
  ti_le_su_dung: number;
};

export function RoomUtilizationClientPage() {
  const { apiCall, isLoading } = useApi();
  
  // State
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState("");
  const [roomUsageData, setRoomUsageData] = React.useState<RoomUsageData[]>([]);
  const [hasData, setHasData] = React.useState(false);

  // Load semesters on mount
  React.useEffect(() => {
    const fetchSemesters = async () => {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM hoc_ky ORDER BY nam_hoc DESC, ten_hk",
        },
      });

      if (response?.success) {
        setSemesters(response?.result?.recordsets[0] || []);
      }
    };

    fetchSemesters();
  }, []);

  // Fetch room utilization data
  const fetchRoomUtilization = async () => {
    if (!selectedSemester) {
      toast({
        title: "Vui lòng chọn học kỳ",
        description: "Cần chọn học kỳ để xem thống kê sử dụng phòng học",
      });
      return;
    }

    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `SELECT *  FROM vw_thong_ke_su_dung_phong
                WHERE ma_hoc_ky = '${selectedSemester}'
                ORDER BY so_gio_su_dung DESC, ten_phong`,
      },
    });

    console.log("Room utilization response: ", response);
    if (response?.success) {
      const data = response?.result?.recordsets[0] || [];
      setRoomUsageData(data);
      setHasData(true);
      
      if (data.length === 0) {
        toast({
          title: "Không có dữ liệu",
          description: "Không có dữ liệu sử dụng phòng học cho học kỳ này",
        });
      }
    } else {
      toast({
        title: "Lỗi khi tải thống kê",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  // Transform data for chart
  const chartData = React.useMemo(() => {
    return roomUsageData.map(room => ({
      name: room.ten_phong,
      usage: Math.round(room.so_gio_su_dung * 10) / 10, // Round to 1 decimal place
      utilization: room.ti_le_su_dung,
    }));
  }, [roomUsageData]);

  // Transform data for table
  const tableData = React.useMemo(() => {
    return roomUsageData.map(room => ({
      id: room.ma_phong,
      name: room.ten_phong,
      capacity: room.suc_chua,
      usage: Math.round(room.so_gio_su_dung * 10) / 10,
      classCount: room.so_lop_hoc_phan,
      utilization: room.ti_le_su_dung,
    }));
  }, [roomUsageData]);

  const selectedSemesterInfo = semesters.find(s => s.ma_hk === selectedSemester);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Thống kê sử dụng Phòng học</h1>

      {/* Semester Selection */}
      <Card>
       
        <CardContent className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="semester-select">Học kỳ</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học kỳ để phân tích" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.ma_hk} value={semester.ma_hk}>
                      {semester.ten_hk} - {semester.nam_hoc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                onClick={fetchRoomUtilization} 
                disabled={!selectedSemester || isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? "Đang phân tích..." : "Phân tích sử dụng"}
              </Button>
            </div>
          </div>
          
          {/* {selectedSemesterInfo && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Đang phân tích học kỳ:</h3>
              <p className="text-sm text-muted-foreground">
                {selectedSemesterInfo.ten_hk} - {selectedSemesterInfo.nam_hoc}
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      {hasData && roomUsageData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số phòng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roomUsageData.length}</div>
              <p className="text-xs text-muted-foreground">
                phòng học trong hệ thống
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phòng được sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roomUsageData.filter(room => room.so_gio_su_dung > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                phòng có lịch học
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng giờ sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(roomUsageData.reduce((sum, room) => sum + room.so_gio_su_dung, 0) * 10) / 10}
              </div>
              <p className="text-xs text-muted-foreground">
                giờ học trong học kỳ
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỉ lệ sử dụng TB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (roomUsageData.reduce((sum, room) => sum + room.ti_le_su_dung, 0) / roomUsageData.length) * 10
                ) / 10}%
              </div>
              <p className="text-xs text-muted-foreground">
                tỉ lệ sử dụng trung bình
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      {hasData && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ tần suất sử dụng phòng học</CardTitle>
            <p className="text-sm text-muted-foreground">
              Số giờ sử dụng của từng phòng học trong học kỳ đã chọn (sắp xếp theo thứ tự giảm dần)
            </p>
          </CardHeader>
          <CardContent>
            <RoomUsageChart data={chartData} />
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {hasData && tableData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết sử dụng phòng học</CardTitle>
            <p className="text-sm text-muted-foreground">
              Thông tin chi tiết về việc sử dụng từng phòng học
            </p>
          </CardHeader>
          <CardContent>
            <RoomUsageTable data={tableData} />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {hasData && roomUsageData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Không có dữ liệu</h3>
              <p className="text-muted-foreground">
                Không có dữ liệu sử dụng phòng học cho học kỳ này.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
