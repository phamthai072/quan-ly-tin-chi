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
import { Search } from "lucide-react";
import * as React from "react";

// Type cho dữ liệu từ view vw_thong_ke_sv cải tiến
type StudentStatistics = {
  ma_sv: string;
  ho_ten_sv: string;
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
  ma_khoa: string;
  ten_khoa: string;
  ma_khoa_hoc: string;
  ten_khoa_hoc: string;
  ma_hoc_ky: string;
  ten_hoc_ky: string;
  ma_lop_hp: string;
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
  const [selectedSemester, setSelectedSemester] = React.useState<string>("all");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("all");
  const [selectedFaculty, setSelectedFaculty] = React.useState<string>("all");
  const [selectedCohort, setSelectedCohort] = React.useState<string>("all");
  const [selectedClassSection, setSelectedClassSection] =
    React.useState<string>("all");
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
  const [faculties, setFaculties] = React.useState<any[]>([]);
  const [cohorts, setCohorts] = React.useState<any[]>([]);
  const [allClassSections, setAllClassSections] = React.useState<any[]>([]);

  const { apiCall } = useApi();

  // Function xử lý tìm kiếm và áp dụng bộ lọc
  const handleSearch = async () => {
    setLoading(true);
    try {
      let whereConditions: string[] = [];

      if (selectedSemester !== "all") {
        whereConditions.push(`stats.ma_hoc_ky = N'${selectedSemester}'`);
      }

      if (selectedFaculty !== "all") {
        whereConditions.push(`stats.ma_khoa = N'${selectedFaculty}'`);
      }

      if (selectedMajor !== "all") {
        whereConditions.push(`stats.ma_chuyen_nganh = N'${selectedMajor}'`);
      }

      if (selectedCohort !== "all") {
        whereConditions.push(`stats.ma_khoa_hoc = N'${selectedCohort}'`);
      }

      if (selectedClassSection !== "all") {
        whereConditions.push(`stats.ma_lop_hp = N'${selectedClassSection}'`);
      }

      if (searchQuery.trim()) {
        whereConditions.push(
          `(stats.ma_sv LIKE N'%${searchQuery}%' OR stats.ho_ten_sv LIKE N'%${searchQuery}%')`
        );
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const query = `
        SELECT 
          stats.ma_sv,
          stats.ho_ten_sv,
          stats.ma_chuyen_nganh,
          stats.ten_chuyen_nganh,
          stats.ma_khoa,
          stats.ten_khoa,
          stats.ma_khoa_hoc,
          stats.ten_khoa_hoc,
          stats.ma_hoc_ky,
          hk.ten_hk as ten_hoc_ky,
          stats.ma_lop_hp,
          stats.diem_tb_hk,
          stats.diem_tb_tich_luy,
          stats.tong_mon_hoc,
          stats.tong_tc_no
        FROM (
          SELECT 
            sv.ma_sv,
            sv.ho_ten_sv,
            sv.ma_chuyen_nganh,
            cn.ten_chuyen_nganh,
            k.ma_khoa,
            k.ten_khoa,
            sv.ma_khoa_hoc,
            kh.ten_khoa_hoc,
            lhp.ma_hoc_ky,
            lhp.ma_lop_hp,
            -- Điểm trung bình học kỳ
            (
              SELECT AVG(CAST(kq_hk.diem AS DECIMAL(5,2)))
              FROM ket_qua kq_hk
              INNER JOIN lop_hoc_phan lhp_hk ON kq_hk.ma_lop_hp = lhp_hk.ma_lop_hp
              WHERE kq_hk.ma_sv = sv.ma_sv AND lhp_hk.ma_hoc_ky = lhp.ma_hoc_ky
            ) AS diem_tb_hk,
            -- Điểm trung bình tích lũy 
            (
              SELECT SUM(kq2.diem * mh2.so_tin_chi * 1.0) / NULLIF(SUM(mh2.so_tin_chi), 0)
              FROM ket_qua kq2
              INNER JOIN lop_hoc_phan lhp2 ON kq2.ma_lop_hp = lhp2.ma_lop_hp
              INNER JOIN mon_hoc mh2 ON lhp2.ma_mh = mh2.ma_mh
              WHERE kq2.ma_sv = sv.ma_sv AND kq2.diem >= 4.0
            ) AS diem_tb_tich_luy,
            -- Tổng số môn đã học (distinct môn)
            (
              SELECT COUNT(DISTINCT mh3.ma_mh)
              FROM ket_qua kq3
              INNER JOIN lop_hoc_phan lhp3 ON kq3.ma_lop_hp = lhp3.ma_lop_hp
              INNER JOIN mon_hoc mh3 ON lhp3.ma_mh = mh3.ma_mh
              WHERE kq3.ma_sv = sv.ma_sv
            ) AS tong_mon_hoc,
            -- Tổng tín chỉ nợ (môn chưa qua hoặc chưa có lần học lại qua)
            (
              SELECT ISNULL(SUM(mh4.so_tin_chi), 0)
              FROM mon_hoc mh4
              WHERE mh4.ma_chuyen_nganh = sv.ma_chuyen_nganh
                AND NOT EXISTS (
                  SELECT 1
                  FROM ket_qua kq4
                  INNER JOIN lop_hoc_phan lhp4 ON kq4.ma_lop_hp = lhp4.ma_lop_hp
                  WHERE kq4.ma_sv = sv.ma_sv 
                    AND lhp4.ma_mh = mh4.ma_mh
                    AND kq4.diem >= 4.0
                )
            ) AS tong_tc_no
          FROM sinh_vien sv
          INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
          INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
          INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
          INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
          INNER JOIN khoa k ON cn.ma_khoa = k.ma_khoa
          INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc
          GROUP BY sv.ma_sv, sv.ho_ten_sv, sv.ma_chuyen_nganh, cn.ten_chuyen_nganh, 
                   k.ma_khoa, k.ten_khoa, sv.ma_khoa_hoc, kh.ten_khoa_hoc, 
                   lhp.ma_hoc_ky, lhp.ma_lop_hp
        ) stats
        INNER JOIN hoc_ky hk ON stats.ma_hoc_ky = hk.ma_hk
        ${whereClause}
        ORDER BY stats.tong_mon_hoc DESC, stats.tong_tc_no ASC, stats.ho_ten_sv ASC
      `;

      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: { query },
      });

      if (result?.success) {
        setStudentStats(result.result.recordsets[0] || []);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
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

  // Lấy danh sách khoa
  const fetchFaculties = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: "SELECT ma_khoa, ten_khoa FROM khoa ORDER BY ten_khoa",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setFaculties(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
    }
  }, [apiCall]);

  // Lấy danh sách khóa học
  const fetchCohorts = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query:
            "SELECT ma_khoa_hoc, ten_khoa_hoc FROM khoa_hoc ORDER BY nam_bat_dau DESC",
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setCohorts(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
    }
  }, [apiCall]);

  // Lấy danh sách lớp học phần
  const fetchAllClassSections = React.useCallback(async () => {
    try {
      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: `
            SELECT lhp.ma_lop_hp, mh.ten_mh, hk.ten_hk
            FROM lop_hoc_phan lhp
            INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
            INNER JOIN hoc_ky hk ON lhp.ma_hoc_ky = hk.ma_hk
            ORDER BY hk.ma_hk DESC, mh.ten_mh
          `,
        },
      });

      if (result && Array.isArray(result?.result?.recordset)) {
        setAllClassSections(result?.result?.recordset);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp học phần:", error);
    }
  }, [apiCall]);

  // Lấy danh sách lớp học phần của sinh viên cho dialog sửa điểm
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
      handleSearch(); // Refresh data với bộ lọc hiện tại
    } catch (error) {
      console.error("Lỗi khi lưu điểm:", error);
      alert("Có lỗi xảy ra khi lưu điểm");
    }
  };

  // Load data on mount
  React.useEffect(() => {
    fetchSemesters();
    fetchMajors();
    fetchFaculties();
    fetchCohorts();
    fetchAllClassSections();

    if (initialData.length === 0) {
      handleSearch(); // Load initial data
    }
  }, [
    fetchSemesters,
    fetchMajors,
    fetchFaculties,
    fetchCohorts,
    fetchAllClassSections,
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
          <CardTitle>Bộ lọc thống kê</CardTitle>
          <CardDescription>
            Lọc theo khoa, khóa học, học kỳ, lớp học phần hoặc tìm kiếm sinh
            viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Khoa</Label>
              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khoa</SelectItem>
                  {faculties.map((f: any) => (
                    <SelectItem key={f.ma_khoa} value={f.ma_khoa}>
                      {f.ten_khoa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Khóa học</Label>
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khóa học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khóa</SelectItem>
                  {cohorts.map((c: any) => (
                    <SelectItem key={c.ma_khoa_hoc} value={c.ma_khoa_hoc}>
                      {c.ten_khoa_hoc}
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
                  {majors.map((m: any) => (
                    <SelectItem
                      key={m.ma_chuyen_nganh}
                      value={m.ma_chuyen_nganh}
                    >
                      {m.ten_chuyen_nganh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  {semesters.map((s: any) => (
                    <SelectItem key={s.ma_hk} value={s.ma_hk}>
                      {s.ma_hk} - {s.ten_hk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lớp học phần</Label>
              <Select
                value={selectedClassSection}
                onValueChange={setSelectedClassSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp HP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp HP</SelectItem>
                  {allClassSections.map((cls: any) => (
                    <SelectItem key={cls.ma_lop_hp} value={cls.ma_lop_hp}>
                      {cls.ma_lop_hp} - {cls.ten_mh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>Tìm kiếm sinh viên (Mã SV hoặc Tên)</Label>
              <Input
                placeholder="Nhập mã sinh viên hoặc tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê kết quả học tập sinh viên</CardTitle>
          <CardDescription>
            Danh sách thống kê điểm trung bình và tín chỉ của sinh viên, sắp xếp
            theo tổng số môn học và tín chỉ nợ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : studentStats.length === 0 ? (
            <div className="text-center py-8">
              Không có dữ liệu phù hợp với bộ lọc
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Tìm thấy {studentStats.length} kết quả
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead>Khóa</TableHead>
                    <TableHead>Chuyên ngành</TableHead>
                    <TableHead>Lớp HP</TableHead>
                    <TableHead>Học kỳ</TableHead>
                    {/* <TableHead className="text-center">ĐTB HK</TableHead> */}
                    <TableHead className="text-center">ĐTB tích lũy</TableHead>
                    <TableHead className="text-center">Tổng môn</TableHead>
                    <TableHead className="text-center">TC nợ</TableHead>
                    {/* <TableHead>
                      <span className="sr-only">Thao tác</span>
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentStats.map((student, index) => (
                    <TableRow
                      key={`${student.ma_sv}-${student.ma_hoc_ky}-${student.ma_lop_hp}-${index}`}
                    >
                      <TableCell className="font-mono text-sm">
                        {student.ma_sv}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.ho_ten_sv}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.ten_khoa}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.ten_khoa_hoc}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.ten_chuyen_nganh}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.ma_lop_hp}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.ten_hoc_ky}
                      </TableCell>
                      {/* <TableCell className="text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            student.diem_tb_hk !== null
                              ? student.diem_tb_hk >= 8
                                ? "bg-green-100 text-green-800"
                                : student.diem_tb_hk >= 6.5
                                ? "bg-blue-100 text-blue-800"
                                : student.diem_tb_hk >= 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.diem_tb_hk?.toFixed(2) ?? "N/A"}
                        </span>
                      </TableCell> */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            student.diem_tb_tich_luy !== null
                              ? student.diem_tb_tich_luy >= 8
                                ? "bg-green-100 text-green-800"
                                : student.diem_tb_tich_luy >= 6.5
                                ? "bg-blue-100 text-blue-800"
                                : student.diem_tb_tich_luy >= 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.diem_tb_tich_luy?.toFixed(2) ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {student.tong_mon_hoc}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-sm font-medium ${
                            (student.tong_tc_no ?? 0) === 0
                              ? "bg-green-100 text-green-800"
                              : (student.tong_tc_no ?? 0) <= 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.tong_tc_no ?? 0}
                        </span>
                      </TableCell>
                      {/* <TableCell>
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
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
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
