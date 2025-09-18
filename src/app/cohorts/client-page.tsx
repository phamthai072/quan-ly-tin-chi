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
import { type Cohort } from "@/lib/mock-data";
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
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { useRenderCount } from "@/hooks/useRenderCount";

export function CohortsClientPage({
  cohorts: initialCohorts,
}: {
  cohorts: Cohort[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [cohorts, setCohorts] = React.useState(initialCohorts);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newCohortId, setNewCohortId] = React.useState("");
  const [newCohortName, setNewCohortName] = React.useState("");
  const [newCohortYear, setNewCohortYear] = React.useState<number | "">("");

  const [editingCohort, setEditingCohort] = React.useState<any | null>(null);

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT * FROM khoa_hoc WHERE ten_khoa_hoc LIKE N'%${searchQuery}%' 
                   OR ma_khoa_hoc LIKE N'%${searchQuery}%' 
                   OR CAST(nam_bat_dau AS NVARCHAR) LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setCohorts(response?.result?.recordsets[0]);
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
          query: `SELECT * FROM khoa_hoc`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setCohorts(response?.result?.recordsets[0]);
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
          query: "SELECT * FROM khoa_hoc ORDER BY nam_bat_dau DESC",
        },
      });

      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setCohorts(response?.result?.recordsets[0]);
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
        query: `INSERT INTO khoa_hoc (ma_khoa_hoc, ten_khoa_hoc, nam_bat_dau) 
                 VALUES (N'${newCohortId?.toUpperCase()?.trim()}', N'${newCohortName?.trim()}', ${newCohortYear})`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm khóa học thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
      setNewCohortId("");
      setNewCohortName("");
      setNewCohortYear("");
    } else {
      toast({
        title: "Thêm khóa học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingCohort) {
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
        query: `UPDATE khoa_hoc 
                 SET ten_khoa_hoc = N'${editingCohort.ten_khoa_hoc}', nam_bat_dau = ${editingCohort.nam_bat_dau} 
                 WHERE ma_khoa_hoc = N'${editingCohort.ma_khoa_hoc}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật khóa học thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật khóa học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingCohort) {
      toast({
        title: "Vui lòng chọn khóa học để xóa",
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
        query: `DELETE FROM khoa_hoc WHERE ma_khoa_hoc = N'${editingCohort.ma_khoa_hoc}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa khóa học thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa khóa học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Khóa học</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm khóa học
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm khóa học..."
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
                <TableHead>Mã khóa học</TableHead>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Năm bắt đầu</TableHead>
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
              ) : cohorts?.length > 0 ? (
                cohorts.map((cohort: any) => (
                  <TableRow key={cohort.ma_khoa_hoc}>
                    <TableCell className="font-medium">
                      {cohort.ma_khoa_hoc}
                    </TableCell>
                    <TableCell>{cohort.ten_khoa_hoc}</TableCell>
                    <TableCell>{cohort.nam_bat_dau}</TableCell>
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
                              setEditingCohort(cohort);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCohort(cohort);
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

          {/* Thêm khóa học mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewCohortId("");
                setNewCohortName("");
                setNewCohortYear("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm khóa học mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của khóa học.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cohort-id" className="text-right">
                    Mã khóa học
                  </Label>
                  <Input
                    id="cohort-id"
                    value={newCohortId}
                    onChange={(e) => setNewCohortId(e.target.value?.toUpperCase())}
                    className="col-span-3"
                    placeholder="VD: K2024"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cohort-name" className="text-right">
                    Tên khóa học
                  </Label>
                  <Input
                    id="cohort-name"
                    value={newCohortName}
                    onChange={(e) => setNewCohortName(e.target.value)}
                    className="col-span-3"
                    placeholder="VD: Khóa 2024-2028"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cohort-year" className="text-right">
                    Năm bắt đầu
                  </Label>
                  <Input
                    id="cohort-year"
                    type="number"
                    value={newCohortYear}
                    onChange={(e) =>
                      setNewCohortYear(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3"
                    placeholder="2024"
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

          {/* Sửa thông tin khóa học */}
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
                <DialogTitle>Sửa thông tin khóa học</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của khóa học.
                </DialogDescription>
              </DialogHeader>

              {editingCohort && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cohort-id-edit" className="text-right">
                      Mã khóa học
                    </Label>
                    <Input
                      id="cohort-id-edit"
                      disabled
                      value={editingCohort.ma_khoa_hoc}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cohort-name-edit" className="text-right">
                      Tên khóa học
                    </Label>
                    <Input
                      id="cohort-name-edit"
                      value={editingCohort.ten_khoa_hoc}
                      onChange={(e) =>
                        setEditingCohort({
                          ...editingCohort,
                          ten_khoa_hoc: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cohort-year-edit" className="text-right">
                      Năm bắt đầu
                    </Label>
                    <Input
                      id="cohort-year-edit"
                      type="number"
                      value={editingCohort.nam_bat_dau}
                      onChange={(e) =>
                        setEditingCohort({
                          ...editingCohort,
                          nam_bat_dau: Number(e.target.value),
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
                  disabled={!editingCohort}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa khóa học */}
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
                  vĩnh viễn khóa học khỏi hệ thống.
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
