"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";

// Types for database data
type Student = {
  ma_sv: string;
  ho_ten_sv: string;
  ten_chuyen_nganh: string;
  ten_khoa_hoc: string;
};

type Semester = {
  ma_hk: string;
  ten_hk: string;
  nam_hoc: string;
};

type ScheduleItem = {
  ma_lop_hp: string;
  ten_mh: string;
  ho_ten_gv: string;
  thu: number;
  tiet_bat_dau: number;
  tiet_ket_thuc: number;
  ten_phong: string;
  so_tin_chi: number;
};

const daysOfWeek = [
  { value: 2, label: "Thứ 2" },
  { value: 3, label: "Thứ 3" },
  { value: 4, label: "Thứ 4" },
  { value: 5, label: "Thứ 5" },
  { value: 6, label: "Thứ 6" },
  { value: 7, label: "Thứ 7" },
  { value: 8, label: "Chủ nhật" },
];

export function SchedulesClientPage() {
  const { apiCall, isLoading } = useApi();
  
  // State
  const [students, setStudents] = React.useState<Student[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([]);
  
  const [selectedStudent, setSelectedStudent] = React.useState("");
  const [selectedSemester, setSelectedSemester] = React.useState("");
  const [studentSearchQuery, setStudentSearchQuery] = React.useState("");
  
  // Load initial data
  React.useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch students
      const studentsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT sv.ma_sv, sv.ho_ten_sv, cn.ten_chuyen_nganh, kh.ten_khoa_hoc
                   FROM sinh_vien sv 
                   INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc
                   ORDER BY sv.ho_ten_sv`,
        },
      });

      if (studentsResponse?.success) {
        setStudents(studentsResponse?.result?.recordsets[0] || []);
      }

      // Fetch semesters
      const semestersResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM hoc_ky ORDER BY nam_hoc DESC, ten_hk",
        },
      });

      if (semestersResponse?.success) {
        setSemesters(semestersResponse?.result?.recordsets[0] || []);
      }
    };

    fetchInitialData();
  }, []);

  // Filter students based on search
  const filteredStudents = React.useMemo(() => {
    if (!studentSearchQuery) return students;
    return students.filter(
      (student) =>
        student.ho_ten_sv.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.ma_sv.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [students, studentSearchQuery]);

  // Fetch schedule when student and semester are selected
  const fetchSchedule = async () => {
    if (!selectedStudent || !selectedSemester) {
      toast({
        title: "Vui lòng chọn sinh viên và học kỳ",
        description: "Cần chọn cả sinh viên và học kỳ để xem lịch học",
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
        query: `SELECT DISTINCT 
                  lhp.ma_lop_hp,
                  mh.ten_mh,
                  gv.ho_ten_gv,
                  lh.thu,
                  lh.tiet_bat_dau,
                  lh.tiet_ket_thuc,
                  ph.ten_phong,
                  mh.so_tin_chi
                FROM ket_qua kq
                INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
                INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
                INNER JOIN giang_vien gv ON lhp.ma_gv = gv.ma_gv
                INNER JOIN lich_hoc lh ON lhp.ma_lop_hp = lh.ma_lop_hp
                INNER JOIN phong_hoc ph ON lh.ma_phong = ph.ma_phong
                WHERE kq.ma_sv = N'${selectedStudent}' 
                AND lhp.ma_hoc_ky = N'${selectedSemester}'
                ORDER BY lh.thu, lh.tiet_bat_dau`,
      },
    });

    console.log("Schedule response: ", response);
    if (response?.success) {
      setSchedules(response?.result?.recordsets[0] || []);
      if (response?.result?.recordsets[0]?.length === 0) {
        toast({
          title: "Không có lịch học",
          description: "Sinh viên này chưa đăng ký môn học nào trong học kỳ đã chọn",
        });
      }
    } else {
      toast({
        title: "Lỗi khi tải lịch học",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  // Group schedules by day
  const scheduleByDay = React.useMemo(() => {
    const grouped: { [key: number]: ScheduleItem[] } = {};
    schedules.forEach((item) => {
      if (!grouped[item.thu]) {
        grouped[item.thu] = [];
      }
      grouped[item.thu].push(item);
    });
    return grouped;
  }, [schedules]);

  // Get time slot display
  const getTimeSlot = (start: number, end: number) => {
    const startTime = 6 + (start - 1) * 0.75; // Assuming each period is 45 minutes starting from 6:00 AM
    const endTime = 6 + (end - 1) * 0.75;
    
    const formatTime = (time: number) => {
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const selectedStudentInfo = students.find(s => s.ma_sv === selectedStudent);
  const selectedSemesterInfo = semesters.find(s => s.ma_hk === selectedSemester);

  return (
    <div className="space-y-8">

      {/* Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn Sinh viên và Học kỳ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selection */}
            <div className="space-y-4">
                <Label htmlFor="student-select">Chọn Sinh viên</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sinh viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.ma_sv} value={student.ma_sv}>
                        {student.ma_sv} - {student.ho_ten_sv} ({student.ten_chuyen_nganh})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            {/* Semester Selection */}
            <div className="space-y-4">
              <Label htmlFor="semester-select">Chọn Học kỳ</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học kỳ" />
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
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={fetchSchedule} 
              disabled={!selectedStudent || !selectedSemester || isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? "Đang tải..." : "Xem Lịch học"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Info Display */}
      {selectedStudentInfo && selectedSemesterInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">Thông tin Sinh viên</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Mã SV:</strong> {selectedStudentInfo.ma_sv}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Họ tên:</strong> {selectedStudentInfo.ho_ten_sv}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Chuyên ngành:</strong> {selectedStudentInfo.ten_chuyen_nganh}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Khóa học:</strong> {selectedStudentInfo.ten_khoa_hoc}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Thông tin Học kỳ</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Học kỳ:</strong> {selectedSemesterInfo.ten_hk}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Năm học:</strong> {selectedSemesterInfo.nam_hoc}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Tổng môn học:</strong> {schedules.length} môn
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Tổng tín chỉ:</strong> {schedules.reduce((total, item) => total + item.so_tin_chi, 0)} tín chỉ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Display */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch học chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {daysOfWeek.map((day) => {
                const daySchedules = scheduleByDay[day.value] || [];
                
                return (
                  <div key={day.value} className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Badge variant="outline">{day.label}</Badge>
                      {daySchedules.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ({daySchedules.length} môn học)
                        </span>
                      )}
                    </h3>
                    
                    {daySchedules.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tiết học</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Môn học</TableHead>
                            <TableHead>Giảng viên</TableHead>
                            <TableHead>Phòng học</TableHead>
                            <TableHead>Tín chỉ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {daySchedules
                            .sort((a, b) => a.tiet_bat_dau - b.tiet_bat_dau)
                            .map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  Tiết {item.tiet_bat_dau} - {item.tiet_ket_thuc}
                                </TableCell>
                                <TableCell>
                                  {getTimeSlot(item.tiet_bat_dau, item.tiet_ket_thuc)}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{item.ten_mh}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {item.ma_lop_hp}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{item.ho_ten_gv}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{item.ten_phong}</Badge>
                                </TableCell>
                                <TableCell>{item.so_tin_chi}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Không có lịch học vào {day.label.toLowerCase()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {schedules.length === 0 && selectedStudent && selectedSemester && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Chưa có lịch học</h3>
              <p className="text-muted-foreground">
                Sinh viên này chưa đăng ký môn học nào trong học kỳ đã chọn.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
