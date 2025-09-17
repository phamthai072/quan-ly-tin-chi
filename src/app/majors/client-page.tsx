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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Major, type Faculty } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { useRenderCount } from "@/hooks/useRenderCount";

export function MajorsClientPage({
  majors: initialMajors,
  faculties: initialFaculties,
}: {
  majors: Major[];
  faculties: Faculty[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [majors, setMajors] = React.useState(initialMajors);
  const [faculties, setFaculties] = React.useState(initialFaculties);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newMajorId, setNewMajorId] = React.useState("");
  const [newMajorName, setNewMajorName] = React.useState("");
  const [newMajorFaculty, setNewMajorFaculty] = React.useState("");

  const [editingMajor, setEditingMajor] = React.useState<any | null>(null);

  const getFacultyName = (facultyId: string) => {
    return faculties.find((f) => f.ma_khoa === facultyId)?.ten_khoa || facultyId;
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT cn.*, k.ten_khoa FROM chuyen_nganh cn 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa 
                   WHERE cn.ten_chuyen_nganh LIKE N'%${searchQuery}%' 
                   OR cn.ma_chuyen_nganh LIKE N'%${searchQuery}%' 
                   OR k.ten_khoa LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setMajors(response?.result?.recordsets[0]);
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
          query: `SELECT cn.*, k.ten_khoa FROM chuyen_nganh cn 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setMajors(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch majors
      const majorsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT cn.*, k.ten_khoa FROM chuyen_nganh cn 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa`,
        },
      });

      // Fetch faculties
      const facultiesResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM khoa",
        },
      });

      console.log("majors response: ", majorsResponse);
      console.log("faculties response: ", facultiesResponse);

      if (majorsResponse?.success) {
        console.log("majors success: ", majorsResponse?.result?.recordsets[0]);
        setMajors(majorsResponse?.result?.recordsets[0]);
      } else {
        console.log("majors error: ", majorsResponse?.error);
        console.error(majorsResponse.error);
      }

      if (facultiesResponse?.success) {
        console.log("faculties success: ", facultiesResponse?.result?.recordsets[0]);
        setFaculties(facultiesResponse?.result?.recordsets[0]);
      } else {
        console.log("faculties error: ", facultiesResponse?.error);
        console.error(facultiesResponse.error);
      }
    };

    fetchData();
  }, [reload]);

  const onCreate = async () => {
    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `INSERT INTO chuyen_nganh (ma_chuyen_nganh, ten_chuyen_nganh, ma_khoa) 
                 VALUES (N'${newMajorId?.toUpperCase()?.trim()}', N'${newMajorName?.trim()}', N'${newMajorFaculty}')`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm chuyên ngành thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
      setNewMajorId("");
      setNewMajorName("");
      setNewMajorFaculty("");
    } else {
      toast({
        title: "Thêm chuyên ngành thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingMajor) {
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
        query: `UPDATE chuyen_nganh 
                 SET ten_chuyen_nganh = N'${editingMajor.ten_chuyen_nganh}', ma_khoa = N'${editingMajor.ma_khoa}' 
                 WHERE ma_chuyen_nganh = N'${editingMajor.ma_chuyen_nganh}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật chuyên ngành thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật chuyên ngành thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingMajor) {
      toast({
        title: "Vui lòng chọn chuyên ngành để xóa",
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
        query: `DELETE FROM chuyen_nganh WHERE ma_chuyen_nganh = N'${editingMajor.ma_chuyen_nganh}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa chuyên ngành thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa chuyên ngành thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý Chuyên ngành
        </h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm chuyên ngành
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm chuyên ngành..."
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
                <TableHead>Mã chuyên ngành</TableHead>
                <TableHead>Tên chuyên ngành</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : majors?.length > 0 ? (
                majors.map((major: any) => (
                  <TableRow key={major.ma_chuyen_nganh}>
                    <TableCell className="font-medium">
                      {major.ma_chuyen_nganh}
                    </TableCell>
                    <TableCell>{major.ten_chuyen_nganh}</TableCell>
                    <TableCell>
                      {major.ten_khoa || getFacultyName(major.ma_khoa)}
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
                              setEditingMajor(major);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMajor(major);
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
                    <TableCell colSpan={4} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Thêm chuyên ngành mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewMajorId("");
                setNewMajorName("");
                setNewMajorFaculty("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm chuyên ngành mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của chuyên ngành.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="major-id" className="text-right">
                    Mã chuyên ngành
                  </Label>
                  <Input
                    id="major-id"
                    value={newMajorId}
                    onChange={(e) => setNewMajorId(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="major-name" className="text-right">
                    Tên chuyên ngành
                  </Label>
                  <Input
                    id="major-name"
                    value={newMajorName}
                    onChange={(e) => setNewMajorName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="major-faculty" className="text-right">
                    Khoa
                  </Label>
                  <Select
                    value={newMajorFaculty}
                    onValueChange={setNewMajorFaculty}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn khoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.ma_khoa} value={faculty.ma_khoa}>
                          {faculty.ten_khoa}
                        </SelectItem>
                      ))}
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

          {/* Sửa thông tin chuyên ngành */}
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
                <DialogTitle>Sửa thông tin chuyên ngành</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của chuyên ngành.
                </DialogDescription>
              </DialogHeader>

              {editingMajor && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="major-id-edit" className="text-right">
                      Mã chuyên ngành
                    </Label>
                    <Input
                      id="major-id-edit"
                      disabled
                      value={editingMajor.ma_chuyen_nganh}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="major-name-edit" className="text-right">
                      Tên chuyên ngành
                    </Label>
                    <Input
                      id="major-name-edit"
                      value={editingMajor.ten_chuyen_nganh}
                      onChange={(e) =>
                        setEditingMajor({
                          ...editingMajor,
                          ten_chuyen_nganh: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="major-faculty-edit" className="text-right">
                      Khoa
                    </Label>
                    <Select
                      value={editingMajor.ma_khoa}
                      onValueChange={(value) =>
                        setEditingMajor({ ...editingMajor, ma_khoa: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn khoa" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.ma_khoa} value={faculty.ma_khoa}>
                            {faculty.ten_khoa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  className="disabled:opacity-50"
                  disabled={!editingMajor}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa chuyên ngành */}
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
                  vĩnh viễn chuyên ngành khỏi hệ thống.
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
