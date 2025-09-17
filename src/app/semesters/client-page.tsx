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
import {
  Calendar as CalendarIcon,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Semester } from "@/lib/mock-data";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { useRenderCount } from "@/hooks/useRenderCount";

export function SemestersClientPage({
  semesters: initialSemesters,
}: {
  semesters: Semester[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [semesters, setSemesters] = React.useState(initialSemesters);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [newSemesterId, setNewSemesterId] = React.useState("");
  const [newSemesterName, setNewSemesterName] = React.useState("");
  const [newSemesterSchoolYear, setNewSemesterSchoolYear] = React.useState("");
  const [newSemesterStartDate, setNewSemesterStartDate] = React.useState<
    Date | undefined
  >();
  const [newSemesterEndDate, setNewSemesterEndDate] = React.useState<
    Date | undefined
  >();

  const [editingSemester, setEditingSemester] = React.useState<any | null>(null);

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT * FROM hoc_ky WHERE ten_hk LIKE N'%${searchQuery}%' 
                   OR ma_hk LIKE N'%${searchQuery}%' 
                   OR nam_hoc LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setSemesters(response?.result?.recordsets[0]);
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
          query: `SELECT * FROM hoc_ky ORDER BY ngay_bat_dau DESC`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setSemesters(response?.result?.recordsets[0]);
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
          query: "SELECT * FROM hoc_ky ORDER BY ngay_bat_dau DESC",
        },
      });

      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setSemesters(response?.result?.recordsets[0]);
      } else {
        console.log("error: ", response?.error);
        console.error(response.error);
      }
    };

    fetchData();
  }, [reload]);

  const onCreate = async () => {
    if (!newSemesterStartDate || !newSemesterEndDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
      });
      return;
    }

    const formatDateForSQL = (date: Date) => {
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    };

    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `INSERT INTO hoc_ky (ma_hk, ten_hk, nam_hoc, ngay_bat_dau, ngay_ket_thuc) 
                 VALUES (N'${newSemesterId?.toUpperCase()?.trim()}', N'${newSemesterName?.trim()}', N'${newSemesterSchoolYear?.trim()}', '${formatDateForSQL(newSemesterStartDate)}', '${formatDateForSQL(newSemesterEndDate)}')`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm học kỳ thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
      setNewSemesterId("");
      setNewSemesterName("");
      setNewSemesterSchoolYear("");
      setNewSemesterStartDate(undefined);
      setNewSemesterEndDate(undefined);
    } else {
      toast({
        title: "Thêm học kỳ thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingSemester) {
      toast({
        title: "Chưa có thay đổi",
      });
      return;
    }

    if (!editingSemester.ngay_bat_dau || !editingSemester.ngay_ket_thuc) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
      });
      return;
    }

    const formatDateForSQL = (date: Date | string) => {
      if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    };

    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `UPDATE hoc_ky 
                 SET ten_hk = N'${editingSemester.ten_hk}', nam_hoc = N'${editingSemester.nam_hoc}', ngay_bat_dau = '${formatDateForSQL(editingSemester.ngay_bat_dau)}', ngay_ket_thuc = '${formatDateForSQL(editingSemester.ngay_ket_thuc)}' 
                 WHERE ma_hk = N'${editingSemester.ma_hk}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật học kỳ thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật học kỳ thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingSemester) {
      toast({
        title: "Vui lòng chọn học kỳ để xóa",
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
        query: `DELETE FROM hoc_ky WHERE ma_hk = N'${editingSemester.ma_hk}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa học kỳ thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa học kỳ thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Học kỳ</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm học kỳ
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm học kỳ..."
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
                <TableHead>Mã học kỳ</TableHead>
                <TableHead>Tên học kỳ</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
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
              ) : semesters?.length > 0 ? (
                semesters.map((semester: any) => (
                  <TableRow key={semester.ma_hk}>
                    <TableCell className="font-medium">{semester.ma_hk}</TableCell>
                    <TableCell>{semester.ten_hk}</TableCell>
                    <TableCell>{semester.nam_hoc}</TableCell>
                    <TableCell>{formatDate(semester.ngay_bat_dau)}</TableCell>
                    <TableCell>{formatDate(semester.ngay_ket_thuc)}</TableCell>
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
                              setEditingSemester({
                                ...semester,
                                ngay_bat_dau: new Date(semester.ngay_bat_dau),
                                ngay_ket_thuc: new Date(semester.ngay_ket_thuc),
                              });
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingSemester(semester);
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

          {/* Thêm học kỳ mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewSemesterId("");
                setNewSemesterName("");
                setNewSemesterSchoolYear("");
                setNewSemesterStartDate(undefined);
                setNewSemesterEndDate(undefined);
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm học kỳ mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của học kỳ.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semester-id" className="text-right">
                    Mã học kỳ
                  </Label>
                  <Input
                    id="semester-id"
                    value={newSemesterId}
                    onChange={(e) => setNewSemesterId(e.target.value)}
                    className="col-span-3"
                    placeholder="VD: HK1-2024"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semester-name" className="text-right">
                    Tên học kỳ
                  </Label>
                  <Input
                    id="semester-name"
                    value={newSemesterName}
                    onChange={(e) => setNewSemesterName(e.target.value)}
                    className="col-span-3"
                    placeholder="VD: Học kỳ 1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semester-year" className="text-right">
                    Năm học
                  </Label>
                  <Input
                    id="semester-year"
                    value={newSemesterSchoolYear}
                    onChange={(e) => setNewSemesterSchoolYear(e.target.value)}
                    className="col-span-3"
                    placeholder="VD: 2024-2025"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-date" className="text-right">
                    Ngày bắt đầu
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newSemesterStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSemesterStartDate
                          ? format(newSemesterStartDate, "PPP")
                          : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSemesterStartDate}
                        onSelect={setNewSemesterStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-date" className="text-right">
                    Ngày kết thúc
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newSemesterEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSemesterEndDate
                          ? format(newSemesterEndDate, "PPP")
                          : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSemesterEndDate}
                        onSelect={setNewSemesterEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onCreate}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sửa thông tin học kỳ */}
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
                <DialogTitle>Sửa thông tin học kỳ</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin chi tiết của học kỳ.
                </DialogDescription>
              </DialogHeader>
              {editingSemester && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="semester-id-edit" className="text-right">
                      Mã học kỳ
                    </Label>
                    <Input
                      id="semester-id-edit"
                      value={editingSemester.ma_hk}
                      readOnly
                      disabled
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="semester-name-edit" className="text-right">
                      Tên học kỳ
                    </Label>
                    <Input
                      id="semester-name-edit"
                      value={editingSemester.ten_hk}
                      onChange={(e) =>
                        setEditingSemester({
                          ...editingSemester,
                          ten_hk: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="semester-year-edit" className="text-right">
                      Năm học
                    </Label>
                    <Input
                      id="semester-year-edit"
                      value={editingSemester.nam_hoc}
                      onChange={(e) =>
                        setEditingSemester({
                          ...editingSemester,
                          nam_hoc: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Ngày bắt đầu</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !editingSemester.ngay_bat_dau && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingSemester.ngay_bat_dau
                            ? format(editingSemester.ngay_bat_dau, "PPP")
                            : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editingSemester.ngay_bat_dau}
                          onSelect={(day) =>
                            setEditingSemester({
                              ...editingSemester,
                              ngay_bat_dau: day as Date,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Ngày kết thúc</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !editingSemester.ngay_ket_thuc && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingSemester.ngay_ket_thuc
                            ? format(editingSemester.ngay_ket_thuc, "PPP")
                            : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editingSemester.ngay_ket_thuc}
                          onSelect={(day) =>
                            setEditingSemester({
                              ...editingSemester,
                              ngay_ket_thuc: day as Date,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  className="disabled:opacity-50"
                  disabled={!editingSemester}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa học kỳ */}
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
                  vĩnh viễn học kỳ khỏi hệ thống.
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
