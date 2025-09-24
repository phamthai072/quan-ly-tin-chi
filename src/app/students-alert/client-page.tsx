"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import * as React from "react";

// Type cho thống kê sinh viên
type StudentStats = {
  ma_sv: string;
  ho_ten_sv: string;
  diem_tb_tich_luy: number | null;
  tong_tc_truot: number;
};

export function StudentsAlertClientPage() {
  const [students, setStudents] = React.useState<StudentStats[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { apiCall } = useApi();

  // Tải thống kê danh sách sinh viên
  const loadStudents = async () => {
    setLoading(true);
    try {
      let whereClause = "";
      if (searchQuery.trim()) {
        whereClause = `AND (sv.ma_sv LIKE N'%${searchQuery}%' OR sv.ho_ten_sv LIKE N'%${searchQuery}%')`;
      }

      const query = `
        SELECT 
          sv.ma_sv,
          sv.ho_ten_sv,
          -- Điểm trung bình tích lũy
          CAST((
            SELECT SUM(kq.diem * mh.so_tin_chi * 1.0) / NULLIF(SUM(mh.so_tin_chi), 0)
            FROM ket_qua kq
            INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
            INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
            WHERE kq.ma_sv = sv.ma_sv AND kq.diem >= 4.0
          ) AS DECIMAL(5,2)) AS diem_tb_tich_luy,
          -- Tổng tín chỉ trượt
          ISNULL((
            SELECT SUM(mh2.so_tin_chi)
            FROM mon_hoc mh2
            WHERE mh2.ma_chuyen_nganh = sv.ma_chuyen_nganh
              AND NOT EXISTS (
                SELECT 1
                FROM ket_qua kq2
                INNER JOIN lop_hoc_phan lhp2 ON kq2.ma_lop_hp = lhp2.ma_lop_hp
                WHERE kq2.ma_sv = sv.ma_sv 
                  AND lhp2.ma_mh = mh2.ma_mh
                  AND kq2.diem >= 4.0
              )
          ), 0) AS tong_tc_truot
        FROM sinh_vien sv
        WHERE 1=1 ${whereClause}
        ORDER BY sv.ho_ten_sv ASC
      `;

      const result = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: { query },
      });

      if (result?.success) {
        setStudents(result.result.recordsets[0] || []);
        toast({
          title: "Tải dữ liệu thành công",
          description: `Tìm thấy ${
            result.result.recordsets[0]?.length || 0
          } sinh viên`,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sinh viên:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tải dữ liệu sinh viên",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải dữ liệu khi component mount
  React.useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cảnh báo sinh viên
          </h1>
          <p className="text-muted-foreground">
            Thông tin cảnh báo học tập đối với các sinh viên có điểm trung bình
            tích lũy dưới ngưỡng (2.0), <br />
            hoặc có tổng số tín chỉ chưa qua môn (≥ 5).
            <br /> Điều kiện qua môn hoặc không qua môn dựa trên điểm tổng kết
            cuối kỳ của sinh viên cho mỗi môn học tại mỗi lần học.
          </p>
        </div>
      </div>

      {/* Tìm kiếm */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm sinh viên</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Tìm theo mã sinh viên hoặc tên</Label>
            <Input
              id="search"
              placeholder="Nhập mã sinh viên hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  loadStudents();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={loadStudents} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* Danh sách sinh viên cảnh báo */}
      <Card>
        <CardHeader>
          {/* <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Danh sách thống kê sinh viên
          </CardTitle> */}
          <CardDescription>
            Tổng cộng: {students.length} sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy sinh viên nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead className="text-center">GPA</TableHead>
                  <TableHead className="text-center">TC trượt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.ma_sv}>
                    <TableCell className="font-mono">{student.ma_sv}</TableCell>
                    <TableCell className="font-medium">
                      {student.ho_ten_sv}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          student.diem_tb_tich_luy === null
                            ? "bg-gray-100 text-gray-800"
                            : student.diem_tb_tich_luy < 1.0
                            ? "bg-red-100 text-red-800"
                            : student.diem_tb_tich_luy < 1.5
                            ? "bg-orange-100 text-orange-800"
                            : student.diem_tb_tich_luy < 2.0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.diem_tb_tich_luy?.toFixed(2) ?? "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          student.tong_tc_truot >= 10
                            ? "bg-red-100 text-red-800"
                            : student.tong_tc_truot >= 7
                            ? "bg-orange-100 text-orange-800"
                            : student.tong_tc_truot >= 5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.tong_tc_truot}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
