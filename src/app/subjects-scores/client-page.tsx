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
import { type Semester } from "@/lib/mock-data";
import { Edit, Search } from "lucide-react";
import * as React from "react";

type SubjectScoresClientPageProps = {
  // No props needed as we'll fetch data from API
};

type Student = {
  id: string;
  name: string;
  ma_chuyen_nganh: string;
  ma_khoa_hoc: string;
  he_dao_tao: string;
};

type SubjectScore = {
  ma_lop_hp: string;
  ten_mh: string;
  so_tin_chi: number;
  diem: number | null;
  ma_gv: string;
  ho_ten_gv: string;
  thu: number;
  tiet_bat_dau: number;
  tiet_ket_thuc: number;
};

export function SubjectScoresClientPage({}: SubjectScoresClientPageProps) {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedStudentId, setSelectedStudentId] = React.useState<
    string | undefined
  >();
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<
    string | undefined
  >();
  const [subjectScores, setSubjectScores] = React.useState<SubjectScore[]>([]);
  const [editingScore, setEditingScore] = React.useState<{
    ma_lop_hp: string;
    diem: number | null;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(true);

  const { apiCall } = useApi();

  // Fetch students and semesters data
  React.useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch students
        const studentsResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_sv as id, ho_ten_sv as name, ma_chuyen_nganh, ma_khoa_hoc, he_dao_tao FROM sinh_vien ORDER BY ho_ten_sv",
          },
        });

        if (studentsResponse?.success) {
          setStudents(studentsResponse.result.recordsets[0] || []);
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

  const handleFetchScores = async () => {
    if (!selectedStudentId || !selectedSemesterId) {
      setSubjectScores([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch subject scores for the student in the selected semester using view
      const scoresResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: `
            SELECT * FROM vw_ds_lhp_sinh_vien 
            WHERE ma_sv = N'${selectedStudentId}' AND ma_hoc_ky = N'${selectedSemesterId}'
            ORDER BY ten_mh
          `,
        },
      });

      if (scoresResponse?.success) {
        setSubjectScores(scoresResponse.result.recordsets[0] || []);
        toast({
          title: "Tải dữ liệu thành công",
          description: `Đã tải điểm môn học cho sinh viên trong học kỳ được chọn`,
        });
      } else {
        toast({
          title: "Không có dữ liệu",
          description:
            "Không tìm thấy dữ liệu điểm cho sinh viên trong học kỳ này",
          variant: "destructive",
        });
        setSubjectScores([]);
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tải điểm, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = async (ma_lop_hp: string, diem: number | null) => {
    if (!selectedStudentId) return;

    try {
      // Insert or update score
      const updateResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        body: {
          query: `
            IF EXISTS (SELECT 1 FROM ket_qua WHERE ma_lop_hp = N'${ma_lop_hp}' AND ma_sv = N'${selectedStudentId}')
            BEGIN
              UPDATE ket_qua 
              SET diem = ${diem !== null ? diem : "NULL"}
              WHERE ma_lop_hp = N'${ma_lop_hp}' AND ma_sv = N'${selectedStudentId}'
            END
            ELSE
            BEGIN
              INSERT INTO ket_qua (ma_lop_hp, ma_sv, diem)
              VALUES (N'${ma_lop_hp}', N'${selectedStudentId}', ${
            diem !== null ? diem : "NULL"
          })
            END
          `,
        },
      });

      if (updateResponse?.success) {
        // Update local state
        setSubjectScores((prev) =>
          prev.map((score) =>
            score.ma_lop_hp === ma_lop_hp ? { ...score, diem } : score
          )
        );
        setEditingScore(null);
        toast({
          title: "Cập nhật thành công",
          description: "Điểm đã được cập nhật",
        });
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật điểm",
        variant: "destructive",
      });
    }
  };

  // Auto fetch scores when student and semester are selected
  React.useEffect(() => {
    handleFetchScores();
  }, [selectedStudentId, selectedSemesterId]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Điểm môn học</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chọn thông tin</CardTitle>
          <CardDescription>
            Chọn sinh viên và học kỳ để xem điểm môn học.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Sinh viên</label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              disabled={dataLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={dataLoading ? "Đang tải..." : "Chọn sinh viên"}
                />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} - {s.id}
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
            onClick={handleFetchScores}
            disabled={
              !selectedStudentId ||
              !selectedSemesterId ||
              loading ||
              dataLoading
            }
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Đang tải..." : "Xem điểm"}
          </Button>
        </CardFooter>
      </Card>

      {subjectScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Điểm môn học</CardTitle>
            <CardDescription>
              Bảng điểm chi tiết của sinh viên{" "}
              {students.find((s) => s.id === selectedStudentId)?.name ||
                selectedStudentId}{" "}
              trong học kỳ{" "}
              {semesters.find((s) => s.id === selectedSemesterId)?.name ||
                selectedSemesterId}{" "}
              năm học{" "}
              {semesters.find((s) => s.id === selectedSemesterId)?.schoolYear ||
                ""}
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lớp HP</TableHead>
                  <TableHead>Tên môn học</TableHead>
                  <TableHead>Số tín chỉ</TableHead>
                  <TableHead>Giảng viên</TableHead>
                  <TableHead>Lịch học</TableHead>
                  <TableHead className="text-center">Điểm</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectScores.map((score) => (
                  <TableRow key={score.ma_lop_hp}>
                    <TableCell>{score.ma_lop_hp}</TableCell>
                    <TableCell className="font-medium">
                      {score.ten_mh}
                    </TableCell>
                    <TableCell>{score.so_tin_chi}</TableCell>
                    <TableCell>{score.ho_ten_gv}</TableCell>
                    <TableCell className="text-sm">{`Thứ ${score.thu}, Tiết ${score.tiet_bat_dau}-${score.tiet_ket_thuc}`}</TableCell>
                    <TableCell className="text-center">
                      {editingScore?.ma_lop_hp === score.ma_lop_hp ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="w-16 px-2 py-1 text-center border rounded"
                            defaultValue={editingScore.diem?.toString() || ""}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const value = (e.target as HTMLInputElement)
                                  .value;
                                const diem = value ? parseFloat(value) : null;
                                if (diem !== null && (diem < 0 || diem > 10)) {
                                  toast({
                                    title: "Điểm không hợp lệ",
                                    description: "Điểm phải từ 0 đến 10",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                handleUpdateScore(score.ma_lop_hp, diem);
                              } else if (e.key === "Escape") {
                                setEditingScore(null);
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          {score.diem !== null ? (
                            <Badge
                              variant={
                                score.diem >= 8
                                  ? "default"
                                  : score.diem >= 6.5
                                  ? "secondary"
                                  : score.diem >= 5
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {score.diem.toFixed(1)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              Chưa có
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingScore?.ma_lop_hp === score.ma_lop_hp ? (
                        <div className="flex justify-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector(
                                `input[type="number"]`
                              ) as HTMLInputElement;
                              const value = input?.value;
                              const diem = value ? parseFloat(value) : null;
                              if (diem !== null && (diem < 0 || diem > 10)) {
                                toast({
                                  title: "Điểm không hợp lệ",
                                  description: "Điểm phải từ 0 đến 10",
                                  variant: "destructive",
                                });
                                return;
                              }
                              handleUpdateScore(score.ma_lop_hp, diem);
                            }}
                          >
                            Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingScore(null)}
                          >
                            Hủy
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditingScore({
                              ma_lop_hp: score.ma_lop_hp,
                              diem: score.diem,
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
