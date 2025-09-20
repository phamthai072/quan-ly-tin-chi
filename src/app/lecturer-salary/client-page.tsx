"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { type Lecturer, type Semester } from "@/lib/mock-data";
import { Wallet } from "lucide-react";
import * as React from "react";

type LecturerSalaryClientPageProps = {
  // No props needed as we'll fetch data from API
};

type SalaryResult = {
  ma_gv: string;
  ho_ten_gv: string;
  ma_hoc_ky: string;
  so_lop: number;
  tong_tiet: number;
  don_gia: number;
  luong_thang: number;
};

type ClassDetail = {
  ma_lop_hp: string;
  ten_mh: string;
  lich_hoc: string;
  so_tiet: number;
};

export function LecturerSalaryClientPage({}: LecturerSalaryClientPageProps) {
  const [lecturers, setLecturers] = React.useState<Lecturer[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = React.useState<
    string | undefined
  >();
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<
    string | undefined
  >();
  const [salaryResult, setSalaryResult] = React.useState<SalaryResult | null>(
    null
  );
  const [classDetails, setClassDetails] = React.useState<ClassDetail[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(true);

  const { apiCall } = useApi();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Fetch lecturers and semesters data
  React.useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch lecturers
        const lecturersResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_gv as id, ho_ten_gv as name, ma_khoa as facultyId, don_gia as unitPrice FROM giang_vien ORDER BY ho_ten_gv",
          },
        });

        if (lecturersResponse?.success) {
          setLecturers(lecturersResponse.result.recordsets[0] || []);
        }

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

  const handleCalculateSalary = async () => {
    if (!selectedLecturerId || !selectedSemesterId) {
      setSalaryResult(null);
      setClassDetails([]);
      return;
    }

    setLoading(true);
    try {
      // Call stored procedure to calculate salary
      const salaryResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: `EXEC proc_tinh_luong_gv N'${selectedLecturerId}', N'${selectedSemesterId}'`,
        },
      });

      if (
        salaryResponse?.success &&
        salaryResponse.result.recordsets.length > 0 &&
        salaryResponse.result.recordsets[0].length > 0
      ) {
        // Get salary data from first recordset
        const salaryData = salaryResponse.result.recordsets[0][0];
        setSalaryResult(salaryData);

        // Fetch class details separately
        const classDetailsResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query: `
              SELECT 
                lhp.ma_lop_hp,
                mh.ten_mh,
                CONCAT(
                  CASE lh.thu 
                    WHEN 2 THEN N'Thứ 2'
                    WHEN 3 THEN N'Thứ 3'
                    WHEN 4 THEN N'Thứ 4'
                    WHEN 5 THEN N'Thứ 5'
                    WHEN 6 THEN N'Thứ 6'
                    WHEN 7 THEN N'Thứ 7'
                    WHEN 8 THEN N'Chủ nhật'
                  END,
                  ', Tiết ', lh.tiet_bat_dau, '-', lh.tiet_ket_thuc
                ) as lich_hoc,
                (mh.so_tiet_lt + mh.so_tiet_th) as so_tiet
              FROM lop_hoc_phan lhp
              LEFT JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
              LEFT JOIN lich_hoc lh ON lhp.ma_lop_hp = lh.ma_lop_hp
              WHERE lhp.ma_gv = N'${selectedLecturerId}' 
                AND lhp.ma_hoc_ky = N'${selectedSemesterId}'
              ORDER BY lhp.ma_lop_hp
            `,
          },
        });

        if (classDetailsResponse?.success) {
          setClassDetails(classDetailsResponse.result.recordsets[0] || []);
        }

        toast({
          title: "Tính lương thành công",
          description: `Đã tính lương cho giảng viên ${salaryData.ho_ten_gv}`,
        });
      } else {
        toast({
          title: "Không có dữ liệu",
          description: "Giảng viên không có lớp nào trong học kỳ này",
          variant: "destructive",
        });
        setSalaryResult(null);
        setClassDetails([]);
      }
    } catch (error) {
      console.error("Error calculating salary:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tính lương, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Tính lương giảng viên
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chọn thông tin</CardTitle>
          <CardDescription>
            Chọn giảng viên và học kỳ để tính toán lương.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Giảng viên</label>
            <Select
              value={selectedLecturerId}
              onValueChange={setSelectedLecturerId}
              disabled={dataLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={dataLoading ? "Đang tải..." : "Chọn giảng viên"}
                />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} - {l.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCalculateSalary}
            disabled={
              !selectedLecturerId ||
              !selectedSemesterId ||
              loading ||
              dataLoading
            }
          >
            <Wallet className="mr-2 h-4 w-4" />
            {loading ? "Đang tính..." : "Tính lương"}
          </Button>
        </CardFooter>
      </Card>

      {salaryResult && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả tính lương</CardTitle>
            <CardDescription>
              Bảng lương chi tiết cho giảng viên {salaryResult.ho_ten_gv} trong
              học kỳ{" "}
              {semesters.find((s) => s.id === salaryResult.ma_hoc_ky)?.name ||
                salaryResult.ma_hoc_ky}{" "}
              năm học{" "}
              {semesters.find((s) => s.id === salaryResult.ma_hoc_ky)
                ?.schoolYear || ""}
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng số lớp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {salaryResult.so_lop}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {salaryResult.so_lop > 8 ? (
                      <Badge variant="destructive">Vượt quá 8 lớp</Badge>
                    ) : (
                      "Trong giới hạn"
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng số tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {salaryResult.tong_tiet}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đơn giá/tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(salaryResult.don_gia)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng thu nhập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      salaryResult.tong_tiet * salaryResult.don_gia
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lương tháng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(salaryResult.luong_thang)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {classDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Chi tiết các lớp đã dạy
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã lớp HP</TableHead>
                      <TableHead>Tên môn học</TableHead>
                      <TableHead>Lịch học</TableHead>
                      <TableHead className="text-right">Số tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classDetails.map((classDetail) => (
                      <TableRow key={classDetail.ma_lop_hp}>
                        <TableCell>{classDetail.ma_lop_hp}</TableCell>
                        <TableCell>{classDetail.ten_mh}</TableCell>
                        <TableCell>{classDetail.lich_hoc}</TableCell>
                        <TableCell className="text-right">
                          {classDetail.so_tiet}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
