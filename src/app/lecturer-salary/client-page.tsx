"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "@/hooks/use-toast";
import { type Semester } from "@/lib/mock-data";
import { AlertTriangle, DollarSign, Wallet } from "lucide-react";
import * as React from "react";

type LecturerSalaryClientPageProps = {
  // No props needed as we'll fetch data from API
};

type LecturerSalaryData = {
  ma_gv: string;
  ho_ten_gv: string;
  ma_khoa: string;
  ten_khoa: string;
  don_gia: number;
  so_lop: number;
  tong_tiet: number;
  luong_thang: number;
  is_warning: boolean;
};

export function LecturerSalaryClientPage({}: LecturerSalaryClientPageProps) {
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<
    string | undefined
  >();
  const [lecturerSalaries, setLecturerSalaries] = React.useState<
    LecturerSalaryData[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [minHours, setMinHours] = React.useState<number>(48);

  const { apiCall } = useApi();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Fetch semesters and config data
  React.useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch semesters
        const semestersResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_hk as id, ten_hk as name, nam_hoc as schoolYear, ngay_bat_dau as startDate, ngay_ket_thuc as endDate FROM hoc_ky ORDER BY ngay_bat_dau DESC",
          },
        });

        if (semestersResponse?.success) {
          setSemesters(semestersResponse.result.recordsets[0] || []);
        }

        // Fetch minimum hours config
        const configResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT gia_tri FROM cau_hinh WHERE ten = N'GV_ToiThieu_Tiet'",
          },
        });

        if (
          configResponse?.success &&
          configResponse.result.recordsets[0]?.length > 0
        ) {
          setMinHours(parseInt(configResponse.result.recordsets[0][0].gia_tri));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Có lỗi xảy ra",
          description: "Không thể tải dữ liệu từ server",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadSalaries = async () => {
    if (!selectedSemesterId) {
      setLecturerSalaries([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: `
            SELECT 
              gv.ma_gv,
              gv.ho_ten_gv,
              gv.ma_khoa,
              k.ten_khoa,
              gv.don_gia,
              ISNULL(salary_data.so_lop, 0) as so_lop,
              ISNULL(salary_data.tong_tiet, 0) as tong_tiet,
              ISNULL(salary_data.luong_thang, 0) as luong_thang,
              CASE 
                WHEN ISNULL(salary_data.tong_tiet, 0) < ${minHours} THEN 1
                ELSE 0
              END as is_warning
            FROM giang_vien gv
            LEFT JOIN khoa k ON gv.ma_khoa = k.ma_khoa
            LEFT JOIN (
              SELECT 
                gv.ma_gv,
                COUNT(DISTINCT lhp.ma_lop_hp) AS so_lop,
                SUM((lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 16) AS tong_tiet,
                CAST(SUM((lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 16) * gv.don_gia / 4.0 AS DECIMAL(18, 2)) AS luong_thang
              FROM giang_vien gv
              INNER JOIN lop_hoc_phan lhp ON lhp.ma_gv = gv.ma_gv
              INNER JOIN lich_hoc lh ON lh.ma_lop_hp = lhp.ma_lop_hp
              WHERE lhp.ma_hoc_ky = N'${selectedSemesterId}'
              GROUP BY gv.ma_gv, gv.don_gia
            ) salary_data ON gv.ma_gv = salary_data.ma_gv
            ORDER BY gv.ho_ten_gv
          `,
        },
      });

      if (response?.success) {
        setLecturerSalaries(response.result.recordsets[0] || []);
        toast({
          title: "Tải dữ liệu thành công",
          description: `Đã tải thông tin lương cho ${
            response.result.recordsets[0]?.length || 0
          } giảng viên`,
        });
      }
    } catch (error) {
      console.error("Error loading salaries:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tải dữ liệu lương, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const warningCount = lecturerSalaries.filter((l) => l.is_warning).length;
  const totalLecturers = lecturerSalaries.length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Lương giảng viên theo học kỳ
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chọn học kỳ</CardTitle>
          <CardDescription>
            Chọn học kỳ để xem danh sách lương các giảng viên và cảnh báo số giờ
            dạy không đủ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Học kỳ</label>
            <Select
              value={selectedSemesterId}
              onValueChange={setSelectedSemesterId}
              disabled={dataLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={dataLoading ? "Đang tải..." : "Chọn học kỳ"}
                />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} - {s.schoolYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLoadSalaries}
              disabled={!selectedSemesterId || loading || dataLoading}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              {loading ? "Đang tải..." : "Xem danh sách lương"}
            </Button>
            {selectedSemesterId && (
              <div className="text-sm text-muted-foreground">
                Ngưỡng cảnh báo: {minHours} tiết/học kỳ
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {lecturerSalaries.length > 0 && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số giảng viên
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLecturers}</div>
                <p className="text-xs text-muted-foreground">
                  Trong học kỳ đã chọn
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  GV có lương {">"}0
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lecturerSalaries.filter((l) => l.luong_thang > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Đã có lớp dạy</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  GV cần cảnh báo
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{warningCount}</div>
                <p className="text-xs text-muted-foreground">
                  Không đủ {minHours} tiết
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lecturers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lương giảng viên</CardTitle>
              <CardDescription>
                Học kỳ:{" "}
                {semesters.find((s) => s.id === selectedSemesterId)?.name} -{" "}
                {semesters.find((s) => s.id === selectedSemesterId)?.schoolYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã GV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead className="text-center">Số lớp</TableHead>
                    <TableHead className="text-center">Tổng tiết</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Lương tháng</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lecturerSalaries.map((lecturer) => (
                    <TableRow key={lecturer.ma_gv}>
                      <TableCell className="font-mono">
                        {lecturer.ma_gv}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lecturer.ho_ten_gv}
                      </TableCell>
                      <TableCell>{lecturer.ten_khoa}</TableCell>
                      <TableCell className="text-center">
                        {lecturer.so_lop}
                      </TableCell>
                      <TableCell className="text-center">
                        {lecturer.tong_tiet}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(lecturer.don_gia)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lecturer.luong_thang)}
                      </TableCell>
                      <TableCell className="text-center">
                        {lecturer.is_warning ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Thiếu giờ
                          </Badge>
                        ) : lecturer.tong_tiet > 0 ? (
                          <Badge variant="default">Đủ giờ</Badge>
                        ) : (
                          <Badge variant="secondary">Không dạy</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
