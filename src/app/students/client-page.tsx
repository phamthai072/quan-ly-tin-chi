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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { useRenderCount } from "@/hooks/useRenderCount";

// Type for database student data
type StudentDB = {
  ma_sv: string;
  ho_ten_sv: string;
  ten_chuyen_nganh: string;
  ten_khoa_hoc: string;
  he_dao_tao: string;
  ma_chuyen_nganh: string;
  ma_khoa_hoc: string;
};

export function StudentsClientPage({
  students: initialStudents,
}: {
  students: any[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [students, setStudents] = React.useState(initialStudents);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Form states for creating new student
  const [newStudentId, setNewStudentId] = React.useState("");
  const [newStudentName, setNewStudentName] = React.useState("");
  const [newStudentMajor, setNewStudentMajor] = React.useState("");
  const [newStudentCohort, setNewStudentCohort] = React.useState("");
  const [newStudentProgram, setNewStudentProgram] = React.useState("");

  const [editingStudent, setEditingStudent] = React.useState<StudentDB | null>(
    null
  );

  // Static data options
  const [majors, setMajors] = React.useState<any[]>([]);
  const [cohorts, setCohorts] = React.useState<any[]>([]);

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT sv.ma_sv, sv.ho_ten_sv, cn.ten_chuyen_nganh, kh.ten_khoa_hoc, sv.he_dao_tao, sv.ma_chuyen_nganh, sv.ma_khoa_hoc
                   FROM sinh_vien sv 
                   INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc
                   WHERE sv.ho_ten_sv LIKE N'%${searchQuery}%' 
                   OR sv.ma_sv LIKE N'%${searchQuery}%' 
                   OR cn.ten_chuyen_nganh LIKE N'%${searchQuery}%'
                   OR kh.ten_khoa_hoc LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setStudents(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
      }
    } else {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT sv.ma_sv, sv.ho_ten_sv, cn.ten_chuyen_nganh, kh.ten_khoa_hoc, sv.he_dao_tao, sv.ma_chuyen_nganh, sv.ma_khoa_hoc
                   FROM sinh_vien sv 
                   INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setStudents(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch students
      const studentsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT sv.ma_sv, sv.ho_ten_sv, cn.ten_chuyen_nganh, kh.ten_khoa_hoc, sv.he_dao_tao, sv.ma_chuyen_nganh, sv.ma_khoa_hoc
                   FROM sinh_vien sv 
                   INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc`,
        },
      });

      if (studentsResponse?.success) {
        setStudents(studentsResponse?.result?.recordsets[0]);
      }

      // Fetch majors
      const majorsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM chuyen_nganh",
        },
      });

      if (majorsResponse?.success) {
        setMajors(majorsResponse?.result?.recordsets[0]);
      }

      // Fetch cohorts
      const cohortsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM khoa_hoc",
        },
      });

      if (cohortsResponse?.success) {
        setCohorts(cohortsResponse?.result?.recordsets[0]);
      }
    };

    fetchData();
  }, [reload]);

  const onCreate = async () => {
    if (
      !newStudentName ||
      !newStudentMajor ||
      !newStudentCohort ||
      !newStudentProgram
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
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
        query: `INSERT INTO sinh_vien (ho_ten_sv, ma_chuyen_nganh, ma_khoa_hoc, he_dao_tao) 
                 VALUES (N'${newStudentName?.trim()}', 
                         N'${newStudentMajor?.trim()}', 
                         N'${newStudentCohort?.trim()}', 
                         N'${newStudentProgram?.trim()}')`,
      },
    });

    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm sinh viên thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
    } else {
      toast({
        title: "Thêm sinh viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingStudent) {
      toast({
        title: "Chưa có thay đổi",
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
        query: `UPDATE sinh_vien 
                 SET ho_ten_sv = N'${editingStudent.ho_ten_sv}', 
                     he_dao_tao = N'${editingStudent.he_dao_tao}' 
                 WHERE ma_sv = N'${editingStudent.ma_sv}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật sinh viên thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật sinh viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingStudent) {
      toast({
        title: "Vui lòng chọn sinh viên để xóa",
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
        query: `DELETE FROM sinh_vien WHERE ma_sv = N'${editingStudent.ma_sv}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa sinh viên thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa sinh viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Sinh viên</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm sinh viên
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sinh viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-[280px]"
          />
        </div>
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Chuyên ngành</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Hệ đào tạo</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : students?.length > 0 ? (
                students.map((student: StudentDB) => (
                  <TableRow key={student.ma_sv}>
                    <TableCell className="font-medium">
                      {student.ma_sv}
                    </TableCell>
                    <TableCell>{student.ho_ten_sv}</TableCell>
                    <TableCell>{student.ten_chuyen_nganh}</TableCell>
                    <TableCell>{student.ten_khoa_hoc}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.he_dao_tao}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStudent(student);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStudent(student);
                              setDialog2(true);
                            }}
                            className="text-destructive"
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {renderCount < 1 && (
                    <TableCell colSpan={6} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Thêm sinh viên mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewStudentId("");
                setNewStudentName("");
                setNewStudentMajor("");
                setNewStudentCohort("");
                setNewStudentProgram("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm sinh viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của sinh viên.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-id" className="text-right">
                    Mã SV
                  </Label>
                  <Input
                    disabled
                    id="student-id"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="col-span-3"
                  />
                </div> */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-name" className="text-right">
                    Họ và tên
                  </Label>
                  <Input
                    id="student-name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-major" className="text-right">
                    Chuyên ngành
                  </Label>
                  <Select
                    value={newStudentMajor}
                    onValueChange={setNewStudentMajor}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn chuyên ngành" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors?.map((major: any) => (
                        <SelectItem key={major.ma_chuyen_nganh} value={major.ma_chuyen_nganh}>
                          {major.ten_chuyen_nganh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-cohort" className="text-right">
                    Khóa học
                  </Label>
                  <Select
                    value={newStudentCohort}
                    onValueChange={setNewStudentCohort}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                      {cohorts?.map((cohort: any) => (
                        <SelectItem key={cohort.ma_khoa_hoc} value={cohort.ma_khoa_hoc}>
                          {cohort.ten_khoa_hoc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-program" className="text-right">
                    Hệ đào tạo
                  </Label>
                  <Select
                    value={newStudentProgram}
                    onValueChange={setNewStudentProgram}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn hệ đào tạo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cao đẳng">Cao đẳng</SelectItem>
                      <SelectItem value="đại học">Đại học</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onCreate}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sửa thông tin sinh viên */}
          <Dialog
            open={dialog1}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog1(m);
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sửa thông tin sinh viên</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của sinh viên.
                </DialogDescription>
              </DialogHeader>

              {editingStudent && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-id-edit" className="text-right">
                      Mã SV
                    </Label>
                    <Input
                      id="student-id-edit"
                      disabled
                      value={editingStudent.ma_sv}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-name-edit" className="text-right">
                      Họ và tên
                    </Label>
                    <Input
                      id="student-name-edit"
                      value={editingStudent.ho_ten_sv}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          ho_ten_sv: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-major-edit" className="text-right">
                      Chuyên ngành
                    </Label>
                    <Input
                      id="student-major-edit"
                      disabled
                      value={editingStudent.ten_chuyen_nganh}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-cohort-edit" className="text-right">
                      Khóa học
                    </Label>
                    <Input
                      id="student-cohort-edit"
                      disabled
                      value={editingStudent.ten_khoa_hoc}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-program-edit" className="text-right">
                      Hệ đào tạo
                    </Label>
                    <Select disabled
                      value={editingStudent.he_dao_tao}
                      onValueChange={(value) =>
                        setEditingStudent({
                          ...editingStudent,
                          he_dao_tao: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn hệ đào tạo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cao đẳng">Cao đẳng</SelectItem>
                        <SelectItem value="đại học">Đại học</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  className="disabled:opacity-50"
                  disabled={!editingStudent}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa sinh viên */}
          <AlertDialog
            open={dialog2}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog2(m);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể được hoàn tác. Thao tác này sẽ xóa
                  vĩnh viễn sinh viên khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
