"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { Edit, MoreHorizontal, Search } from "lucide-react";
import * as React from "react";

// Type cho dữ liệu từ view vw_thong_ke_sv
type StudentStatistics = {
  ma_sv: string;
  ho_ten_sv: string;
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
  ten_khoa: string;
  ma_khoa_hoc: string;
  ten_khoa_hoc: string;
  ma_hoc_ky: string;
  diem_tb_hk: number | null;
  diem_tb_tich_luy: number | null;
  tong_mon_hoc: number;
  tong_tc_no: number | null;
};

// Type cho form sửa điểm
type ScoreEditForm = {
  ma_sv: string;
  ma_lop_hp: string;
  diem: number;
};

type ResultsClientPageProps = {
  initialData?: StudentStatistics[];
};

export function ResultsClientPage({
  initialData = [],
}: ResultsClientPageProps) {
  const [studentStats, setStudentStats] =
    React.useState<StudentStatistics[]>(initialData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = React.useState("");
  const [selectedSemester, setSelectedSemester] = React.useState<string>("all");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] =
    React.useState<StudentStatistics | null>(null);
  const [scoreForm, setScoreForm] = React.useState<ScoreEditForm>({
    ma_sv: "",
    ma_lop_hp: "",
    diem: 0,
  });
  const [classSections, setClassSections] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // State cho dữ liệu bộ lọc
  const [semesters, setSemesters] = React.useState<any[]>([]);
  const [majors, setMajors] = React.useState<any[]>([]);
  const [students, setStudents] = React.useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = React.useState<string>("all");

  const { apiCall } = useApi();

  // Function xử lý tìm kiếm
  const handleSearch = () => {
    setSubmittedSearchQuery(searchQuery);
  };

  // Lấy danh sách học kỳ
  const fetchSemesters = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query:
            "SELECT DISTINCT ma_hk, ten_hk FROM hoc_ky ORDER BY ma_hk DESC",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setSemesters(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học kỳ:", error);
    }
  }, [apiCall]);

  // Lấy danh sách chuyên ngành
  const fetchMajors = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query:
            "SELECT ma_chuyen_nganh, ten_chuyen_nganh FROM chuyen_nganh ORDER BY ten_chuyen_nganh",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setMajors(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên ngành:", error);
    }
  }, [apiCall]);

  // Lấy danh sách sinh viên
  const fetchStudents = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: "SELECT ma_sv, ho_ten_sv FROM sinh_vien ORDER BY ho_ten_sv",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setStudents(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
    }
  }, [apiCall]);

  // Lấy dữ liệu thống kê sinh viên
  const fetchStudentStatistics = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query:
            "SELECT * FROM vw_thong_ke_sv ORDER BY tong_mon_hoc DESC, tong_tc_no ASC",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setStudentStats(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê sinh viên:", error);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Lấy danh sách lớp học phần của sinh viên
  const fetchClassSections = React.useCallback(
    async (ma_sv: string, ma_hk: string) => {
      try {
        const query = `
        SELECT DISTINCT lhp.ma_lop_hp, mh.ten_mh, kq.diem
        FROM lop_hoc_phan lhp
        INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
        LEFT JOIN ket_qua kq ON lhp.ma_lop_hp = kq.ma_lop_hp AND kq.ma_sv = '${ma_sv}'
        WHERE lhp.ma_hk = '${ma_hk}'
        ORDER BY mh.ten_mh
      `;

        const result = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: { query },
        });

        if (result && Array.isArray(result?.result?.recordset)) {
          setClassSections(result?.result?.recordset);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học phần:", error);
      }
    },
    [apiCall]
  );

  // Lưu điểm
  const handleSaveScore = async () => {
    if (!scoreForm.ma_sv || !scoreForm.ma_lop_hp) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Kiểm tra xem đã có điểm chưa
      const checkQuery = `
        SELECT COUNT(*) as count 
        FROM ket_qua 
        WHERE ma_sv = '${scoreForm.ma_sv}' AND ma_lop_hp = '${scoreForm.ma_lop_hp}'
      `;

      const checkResult = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: { query: checkQuery },
      });

      let query = "";
      if (checkResult && checkResult[0]?.count > 0) {
        // Cập nhật điểm
        query = `
          UPDATE ket_qua 
          SET diem = ${scoreForm.diem}
          WHERE ma_sv = '${scoreForm.ma_sv}' AND ma_lop_hp = '${scoreForm.ma_lop_hp}'
        `;
      } else {
        // Thêm điểm mới
        query = `
          INSERT INTO ket_qua (ma_sv, ma_lop_hp, diem)
          VALUES ('${scoreForm.ma_sv}', '${scoreForm.ma_lop_hp}', ${scoreForm.diem})
        `;
      }

      await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: { query },
      });

      alert("Lưu điểm thành công!");
      setIsEditDialogOpen(false);
      fetchStudentStatistics(); // Refresh data
    } catch (error) {
      console.error("Lỗi khi lưu điểm:", error);
      alert("Có lỗi xảy ra khi lưu điểm");
    }
  };

  // Load data on mount
  React.useEffect(() => {
    fetchSemesters();
    fetchMajors();
    fetchStudents();

    if (initialData.length === 0) {
      fetchStudentStatistics();
    }
  }, [
    fetchStudentStatistics,
    fetchSemesters,
    fetchMajors,
    fetchStudents,
    initialData.length,
  ]);

  const handleEditScore = (student: StudentStatistics) => {
    setEditingStudent(student);
    setScoreForm({
      ma_sv: student.ma_sv,
      ma_lop_hp: "",
      diem: 0,
    });
    fetchClassSections(student.ma_sv, student.ma_hoc_ky);
    setIsEditDialogOpen(true);
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Thống kê kết quả học tập
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Học kỳ</Label>
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semesters.map((s) => (
                  <SelectItem key={s.ma_hk} value={s.ma_hk}>
                    {s.ma_hk} - {s.ten_hk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chuyên ngành</Label>
            <Select value={selectedMajor} onValueChange={setSelectedMajor}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên ngành</SelectItem>
                {majors.map((m) => (
                  <SelectItem key={m.ma_chuyen_nganh} value={m.ma_chuyen_nganh}>
                    {m.ten_chuyen_nganh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sinh viên</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn sinh viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sinh viên</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.ma_sv} value={s.ma_sv}>
                    {s.ho_ten_sv} ({s.ma_sv})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-end">
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê sinh viên</CardTitle>
          <CardDescription>
            Danh sách thống kê điểm trung bình và tín chỉ của sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Chuyên ngành</TableHead>
                  <TableHead>Khoa</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Học kỳ</TableHead>
                  <TableHead className="text-center">ĐTB HK</TableHead>
                  <TableHead className="text-center">ĐTB tích lũy</TableHead>
                  <TableHead className="text-center">Số môn học</TableHead>
                  <TableHead className="text-center">TC nợ</TableHead>
                  <TableHead>
                    <span className="sr-only">Thao tác</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentStats.map((student) => (
                  <TableRow key={`${student.ma_sv}-${student.ma_hoc_ky}`}>
                    <TableCell className="font-medium">
                      {student.ma_sv}
                    </TableCell>
                    <TableCell>{student.ho_ten_sv}</TableCell>
                    <TableCell>{student.ten_chuyen_nganh}</TableCell>
                    <TableCell>{student.ten_khoa}</TableCell>
                    <TableCell>{student.ten_khoa_hoc}</TableCell>
                    <TableCell>{student.ma_hoc_ky}</TableCell>
                    <TableCell className="text-center">
                      {student.diem_tb_hk?.toFixed(2) ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.diem_tb_tich_luy?.toFixed(2) ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.tong_mon_hoc}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.tong_tc_no ?? 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditScore(student)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa điểm
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog sửa điểm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sửa điểm sinh viên</DialogTitle>
            <DialogDescription>
              Chỉnh sửa điểm cuối kỳ cho sinh viên trong lớp học phần
            </DialogDescription>
          </DialogHeader>

          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Sinh viên:</Label>
                <div className="col-span-3 text-sm">
                  {editingStudent.ho_ten_sv} ({editingStudent.ma_sv})
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Học kỳ:</Label>
                <div className="col-span-3 text-sm">
                  {editingStudent.ma_hoc_ky}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class-section" className="text-right">
                  Lớp học phần:
                </Label>
                <Select
                  value={scoreForm.ma_lop_hp}
                  onValueChange={(value) => {
                    const selectedClass = classSections.find(
                      (c) => c.ma_lop_hp === value
                    );
                    setScoreForm({
                      ...scoreForm,
                      ma_lop_hp: value,
                      diem: selectedClass?.diem || 0,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn lớp học phần" />
                  </SelectTrigger>
                  <SelectContent>
                    {classSections.map((cls) => (
                      <SelectItem key={cls.ma_lop_hp} value={cls.ma_lop_hp}>
                        {cls.ten_mh} ({cls.ma_lop_hp}) - Điểm hiện tại:{" "}
                        {cls.diem ?? "Chưa có"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="score" className="text-right">
                  Điểm cuối kỳ:
                </Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scoreForm.diem}
                  onChange={(e) =>
                    setScoreForm({
                      ...scoreForm,
                      diem: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveScore}>Lưu điểm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
