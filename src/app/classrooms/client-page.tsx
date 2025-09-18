'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { useRenderCount } from '@/hooks/useRenderCount';

export function ClassroomsClientPage({ classrooms: initialClassrooms }: { classrooms: any[] }) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [dialog, setDialog] = React.useState(false);
  const [dialog1, setDialog1] = React.useState(false);
  const [dialog2, setDialog2] = React.useState(false);
  const [classrooms, setClassrooms] = React.useState(initialClassrooms);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newClassroomId, setNewClassroomId] = React.useState('');
  const [newClassroomName, setNewClassroomName] = React.useState('');
  const [newClassroomCapacity, setNewClassroomCapacity] = React.useState('');

  const [editingClassroom, setEditingClassroom] = React.useState<any | null>(null);

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT * FROM phong_hoc WHERE ten_phong LIKE N'%${searchQuery}%' or ma_phong LIKE N'%${searchQuery}%'`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setClassrooms(response?.result?.recordsets[0]);
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
          query: `SELECT * FROM phong_hoc`,
        },
      });
      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setClassrooms(response?.result?.recordsets[0]);
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
          query: "SELECT * FROM phong_hoc",
        },
      });

      console.log("response: ", response);
      if (response?.success) {
        console.log("success: ", response?.result?.recordsets[0]);
        setClassrooms(response?.result?.recordsets[0]);
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
        query: `INSERT INTO phong_hoc (ma_phong, ten_phong, suc_chua) VALUES (N'${newClassroomId
          ?.toUpperCase()
          ?.trim()}', N'${newClassroomName?.trim()}', ${newClassroomCapacity?.trim()})`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Thêm phòng học thành công",
      });
      setReload((m) => !m);
      setDialog((m) => !m);
    } else {
      toast({
        title: "Thêm phòng học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onUpdate = async () => {
    if (!editingClassroom) {
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
        query: `UPDATE phong_hoc SET ten_phong = N'${editingClassroom.ten_phong}', suc_chua = ${editingClassroom.suc_chua} WHERE ma_phong = N'${editingClassroom.ma_phong}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Cập nhật phòng học thành công",
      });
      setReload((m) => !m);
      setDialog1((m) => !m);
    } else {
      toast({
        title: "Cập nhật phòng học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  const onDelete = async () => {
    if (!editingClassroom) {
      toast({
        title: "Vui lòng chọn phòng học để xóa",
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
        query: `DELETE FROM phong_hoc WHERE ma_phong = N'${editingClassroom.ma_phong}'`,
      },
    });
    console.log("response: ", response);
    if (response?.success) {
      console.log("success: ", response?.result?.recordsets[0]);
      toast({
        title: "Xóa phòng học thành công",
      });
      setReload((m) => !m);
    } else {
      toast({
        title: "Xóa phòng học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };
  console.log('classrooms', classrooms)
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng học</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng học
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm phòng học..."
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
                <TableHead>Mã phòng</TableHead>
                <TableHead>Tên phòng</TableHead>
                <TableHead>Sức chứa</TableHead>
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
              ) : classrooms?.length > 0 ? (
                classrooms.map((classroom: any) => (
                  <TableRow key={classroom.ma_phong}>
                    <TableCell className="font-medium">{classroom.ma_phong}</TableCell>
                    <TableCell>{classroom.ten_phong}</TableCell>
                    <TableCell>{classroom.suc_chua}</TableCell>
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
                              setEditingClassroom(classroom);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingClassroom(classroom);
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

          {/* Thêm phòng học mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewClassroomId("");
                setNewClassroomName("");
                setNewClassroomCapacity("");
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm phòng học mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của phòng học.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classroom-id" className="text-right">
                    Mã phòng
                  </Label>
                  <Input
                    id="classroom-id"
                    value={newClassroomId}
                    onChange={(e) => setNewClassroomId(e.target.value?.toLocaleUpperCase())}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classroom-name" className="text-right">
                    Tên phòng
                  </Label>
                  <Input
                    id="classroom-name"
                    value={newClassroomName}
                    onChange={(e) => setNewClassroomName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classroom-capacity" className="text-right">
                    Sức chứa
                  </Label>
                  <Input
                    id="classroom-capacity"
                    value={newClassroomCapacity}
                    onChange={(e) => setNewClassroomCapacity(e.target.value)}
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

          {/* Sửa thông tin phòng học */}
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
                <DialogTitle>Sửa thông tin phòng học</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của phòng học.
                </DialogDescription>
              </DialogHeader>

              {editingClassroom && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classroom-id-edit" className="text-right">
                      Mã phòng
                    </Label>
                    <Input
                      id="classroom-id-edit"
                      disabled
                      value={editingClassroom.ma_phong}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classroom-name-edit" className="text-right">
                      Tên phòng
                    </Label>
                    <Input
                      id="classroom-name-edit"
                      value={editingClassroom.ten_phong}
                      onChange={(e) =>
                        setEditingClassroom({
                          ...editingClassroom,
                          ten_phong: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classroom-capacity-edit" className="text-right">
                      Sức chứa
                    </Label>
                    <Input
                      id="classroom-capacity-edit"
                      value={editingClassroom.suc_chua}
                      onChange={(e) =>
                        setEditingClassroom({
                          ...editingClassroom,
                          suc_chua: e.target.value,
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
                  disabled={!editingClassroom}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa phòng học */}
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
                  vĩnh viễn phòng học khỏi hệ thống.
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
