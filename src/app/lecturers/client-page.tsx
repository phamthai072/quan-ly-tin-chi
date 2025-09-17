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

// Type for database lecturer data
type LecturerDB = {
  ma_gv: string;
  ho_ten_gv: string;
  ten_khoa: string;
  don_gia: number;
};

export function LecturersClientPage({
  lecturers: initialLecturers,
}: {
  lecturers: any[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [lecturers, setLecturers] = React.useState(initialLecturers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newLecturerId, setNewLecturerId] = React.useState("");
  const [newLecturerName, setNewLecturerName] = React.useState("");
  const [newLecturerFaculty, setNewLecturerFaculty] = React.useState("");
  const [newLecturerUnitPrice, setNewLecturerUnitPrice] = React.useState<
    number | ""
  >("");

  const [editingLecturer, setEditingLecturer] = React.useState<LecturerDB | null>(
    null
  );

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT gv.ma_gv, gv.ho_ten_gv, k.ten_khoa, gv.don_gia 
                   FROM giang_vien gv 
                   INNER JOIN khoa k ON gv.ma_khoa = k.ma_khoa 
                   WHERE gv.ho_ten_gv LIKE N'%${searchQuery}%' 
                   OR gv.ma_gv LIKE N'%${searchQuery}%' 
                   OR k.ten_khoa LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setLecturers(response?.result?.recordsets[0]);
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
          query: `SELECT gv.ma_gv, gv.ho_ten_gv, k.ten_khoa, gv.don_gia 
                   FROM giang_vien gv 
                   INNER JOIN khoa k ON gv.ma_khoa = k.ma_khoa`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setLecturers(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT gv.ma_gv, gv.ho_ten_gv, k.ten_khoa, gv.don_gia 
                   FROM giang_vien gv 
                   INNER JOIN khoa k ON gv.ma_khoa = k.ma_khoa`,
        },
      });

      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setLecturers(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
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
        query: `INSERT INTO giang_vien (ma_gv, ho_ten_gv, ma_khoa, don_gia) 
                 VALUES (N'${newLecturerId?.toUpperCase()?.trim()}', 
                         N'${newLecturerName?.trim()}', 
                         N'${newLecturerFaculty?.trim()}', 
                         ${newLecturerUnitPrice})`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm giảng viên thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
    } else {
      toast({
        title: "Thêm giảng viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingLecturer) {
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
        query: `UPDATE giang_vien 
                 SET ho_ten_gv = N'${editingLecturer.ho_ten_gv}', 
                     don_gia = ${editingLecturer.don_gia} 
                 WHERE ma_gv = N'${editingLecturer.ma_gv}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật giảng viên thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật giảng viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingLecturer) {
      toast({
        title: "Vui lòng chọn giảng viên để xóa",
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
        query: `DELETE FROM giang_vien WHERE ma_gv = N'${editingLecturer.ma_gv}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa giảng viên thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa giảng viên thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Giảng viên</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm giảng viên
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm giảng viên..."
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
                <TableHead>Mã GV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : lecturers?.length > 0 ? (
                lecturers.map((lecturer: LecturerDB) => (
                  <TableRow key={lecturer.ma_gv}>
                    <TableCell className="font-medium">
                      {lecturer.ma_gv}
                    </TableCell>
                    <TableCell>{lecturer.ho_ten_gv}</TableCell>
                    <TableCell>{lecturer.ten_khoa}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(lecturer.don_gia)}
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
                              setEditingLecturer(lecturer);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingLecturer(lecturer);
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
                    <TableCell colSpan={5} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Thêm giảng viên mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewLecturerId("");
                setNewLecturerName("");
                setNewLecturerFaculty("");
                setNewLecturerUnitPrice("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm giảng viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của giảng viên.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer-id" className="text-right">
                    Mã GV
                  </Label>
                  <Input
                    id="lecturer-id"
                    value={newLecturerId}
                    onChange={(e) => setNewLecturerId(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer-name" className="text-right">
                    Họ và tên
                  </Label>
                  <Input
                    id="lecturer-name"
                    value={newLecturerName}
                    onChange={(e) => setNewLecturerName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer-faculty" className="text-right">
                    Khoa
                  </Label>
                  <Select
                    onValueChange={setNewLecturerFaculty}
                    value={newLecturerFaculty}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn khoa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                      <SelectItem value="ATTT">An toàn thông tin</SelectItem>
                      <SelectItem value="VT">Viễn thông</SelectItem>
                      <SelectItem value="DT">Điện tử</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer-unit-price" className="text-right">
                    Đơn giá
                  </Label>
                  <Input
                    id="lecturer-unit-price"
                    type="number"
                    value={newLecturerUnitPrice}
                    onChange={(e) =>
                      setNewLecturerUnitPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onCreate}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sửa thông tin giảng viên */}
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
                <DialogTitle>Sửa thông tin giảng viên</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của giảng viên.
                </DialogDescription>
              </DialogHeader>

              {editingLecturer && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lecturer-id-edit" className="text-right">
                      Mã GV
                    </Label>
                    <Input
                      id="lecturer-id-edit"
                      disabled
                      value={editingLecturer.ma_gv}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lecturer-name-edit" className="text-right">
                      Họ và tên
                    </Label>
                    <Input
                      id="lecturer-name-edit"
                      value={editingLecturer.ho_ten_gv}
                      onChange={(e) =>
                        setEditingLecturer({
                          ...editingLecturer,
                          ho_ten_gv: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lecturer-faculty-edit" className="text-right">
                      Khoa
                    </Label>
                    <Input
                      id="lecturer-faculty-edit"
                      disabled
                      value={editingLecturer.ten_khoa}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lecturer-unit-price-edit" className="text-right">
                      Đơn giá
                    </Label>
                    <Input
                      id="lecturer-unit-price-edit"
                      type="number"
                      value={editingLecturer.don_gia}
                      onChange={(e) =>
                        setEditingLecturer({
                          ...editingLecturer,
                          don_gia: Number(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  className="disabled:opacity-50"
                  disabled={!editingLecturer}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa giảng viên */}
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
                  vĩnh viễn giảng viên khỏi hệ thống.
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
