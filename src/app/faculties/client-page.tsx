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
import { type Faculty } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

export function FacultiesClientPage({ faculties: initialFaculties }: { faculties: Faculty[] }) {
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true)
  const [dialog, setDialog] = React.useState(false)
  const [dialog1, setDialog1] = React.useState(false)
  const [dialog2, setDialog2] = React.useState(false)
  const [faculties, setFaculties] = React.useState(initialFaculties);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newFacultyId, setNewFacultyId] = React.useState('');
  const [newFacultyName, setNewFacultyName] = React.useState('');

  const [editingFaculty, setEditingFaculty] = React.useState<Faculty | null>(null);

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT * FROM khoa WHERE ten_khoa LIKE N'%${searchQuery}%' or ma_khoa LIKE N'%${searchQuery}%'`,
        }
      });
      console.log('response: ', response)
      if (response?.success) {
        console.log('success: ', response?.result?.recordsets[0])
        setFaculties(response?.result?.recordsets[0]);
      } else {
        console.log('error: ', response?.error)
        console.error(response.error)
      }
    } else {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT * FROM khoa`,
        }
      });
      console.log('response: ', response)
      if (response?.success) {
        console.log('success: ', response?.result?.recordsets[0])
        setFaculties(response?.result?.recordsets[0]);
      } else {
        console.log('error: ', response?.error)
        console.error(response.error)
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
          query: "SELECT * FROM khoa",
        }
      });

      console.log('response: ', response)
      if (response?.success) {
        console.log('success: ', response?.result?.recordsets[0])
        setFaculties(response?.result?.recordsets[0]);
      } else {
        console.log('error: ', response?.error)
        console.error(response.error)
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
        query: `INSERT INTO khoa (ma_khoa, ten_khoa) VALUES (N'${newFacultyId?.toUpperCase()?.trim()}', N'${newFacultyName?.trim()}')`,
      }
    });
    console.log('response: ', response)
    if (response?.success) {
      console.log('success: ', response?.result?.recordsets[0]);
      toast({
        title: 'Thêm khoa thành công'
      });
      setReload(m => !m)
      setDialog(m => !m)
    } else {
      toast({
        title: 'Thêm khoa thất bại',
        description: response?.error || "Lỗi hệ thống"
      });
    }
  }

  const onUpdate = async () => {
    if (!editingFaculty) {
      toast({
        title: 'Chưa có thay đổi',
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
        query: `UPDATE khoa SET ten_khoa = N'${editingFaculty.ten_khoa}' WHERE ma_khoa = N'${editingFaculty.ma_khoa}'`,
      }
    });
    console.log('response: ', response)
    if (response?.success) {
      console.log('success: ', response?.result?.recordsets[0]);
      toast({
        title: 'Cập nhật khoa thành công'
      });
      setReload(m => !m)
      setDialog1(m => !m)
    } else {
      toast({
        title: 'Cập nhật khoa thất bại',
        description: response?.error || "Lỗi hệ thống"
      });
    }
  }

  const onDelete = async () => {
    if (!editingFaculty) {
      toast({
        title: 'Chưa có thay đổi',
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
        query: `UPDATE khoa SET ten_khoa = N'${editingFaculty.ten_khoa}' WHERE ma_khoa = N'${editingFaculty.ma_khoa}'`,
      }
    });
    console.log('response: ', response)
    if (response?.success) {
      console.log('success: ', response?.result?.recordsets[0]);
      toast({
        title: 'Thêm khoa thành công'
      });
      setReload(m => !m)
      setDialog(m => !m)
    } else {
      toast({
        title: 'Thêm khoa thất bại',
        description: response?.error || "Lỗi hệ thống"
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Khoa</h1>
        <Button onClick={(e) => {
          e.preventDefault();
          setDialog(m => !m);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm khoa
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm khoa..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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
                <TableHead>Mã khoa</TableHead>
                <TableHead>Tên khoa</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ?
                <TableRow>
                  <TableCell colSpan={3} className='text-center'>Đang tải...</TableCell>
                </TableRow>
                : faculties?.length > 0 ? faculties.map((faculty) => (
                  <TableRow key={faculty.ma_khoa}>
                    <TableCell className="font-medium">{faculty.ma_khoa}</TableCell>
                    <TableCell>{faculty.ten_khoa}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setEditingFaculty(faculty)
                            setDialog1(true)
                          }}>Sửa</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setEditingFaculty(faculty)
                            setDialog2(true)
                          }} className="text-destructive">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>


                    </TableCell>
                  </TableRow>
                )) : <TableRow>
                  <TableCell colSpan={3} className='text-center'>Không có dữ liệu</TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>

          {/* Thêm khoa mới */}
          <Dialog open={dialog} onOpenChange={m => {
            if (!m) {
              // when off
              setDialog(m);
              setNewFacultyId('');
              setNewFacultyName('');
            }
          }} >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm khoa mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của khoa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faculty-id" className="text-right">Mã khoa</Label>
                  <Input id="faculty-id" value={newFacultyId} onChange={e => setNewFacultyId(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faculty-name" className="text-right">Tên khoa</Label>
                  <Input id="faculty-name" value={newFacultyName} onChange={e => setNewFacultyName(e.target.value)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onCreate}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sửa thông tin khoa */}
          <Dialog open={dialog1} onOpenChange={m => {
            if (!m) {
              // when off
              setDialog1(m);
            }
          }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sửa thông tin khoa</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của khoa.
                </DialogDescription>
              </DialogHeader>

              {editingFaculty && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="faculty-id-edit" className="text-right">Mã khoa</Label>
                    <Input id="faculty-id-edit" disabled value={editingFaculty.ma_khoa} readOnly className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="faculty-name-edit" className="text-right">Tên khoa</Label>
                    <Input id="faculty-name-edit" value={editingFaculty.ten_khoa} onChange={e => setEditingFaculty({ ...editingFaculty, ten_khoa: e.target.value })} className="col-span-3" />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button className='disabled:opacity-50' disabled={!editingFaculty} type="button" onClick={onUpdate}>Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa khoa */}
          <AlertDialog open={dialog2} onOpenChange={m => {
            if (!m) {
              // when off
              setDialog2(m);
            }
          }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn khoa khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </CardContent>
      </Card>
    </div>
  );
}
