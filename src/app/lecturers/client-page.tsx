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
import { type Lecturer } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const faculties = ["Công nghệ thông tin", "An toàn thông tin", "Viễn thông", "Điện tử"];

export function LecturersClientPage({ lecturers: initialLecturers }: { lecturers: Lecturer[] }) {
  const [lecturers, setLecturers] = React.useState(initialLecturers);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newLecturerName, setNewLecturerName] = React.useState('');
  const [newLecturerFaculty, setNewLecturerFaculty] = React.useState('');
  const [newLecturerUnitPrice, setNewLecturerUnitPrice] = React.useState<number | ''>('');

  const [editingLecturer, setEditingLecturer] = React.useState<Lecturer | null>(null);
  
  const handleSearch = () => {
    const filteredLecturers = initialLecturers.filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setLecturers(filteredLecturers);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Giảng viên</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm giảng viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm giảng viên mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của giảng viên.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lecturer-name" className="text-right">Họ và tên</Label>
                <Input id="lecturer-name" value={newLecturerName} onChange={(e) => setNewLecturerName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lecturer-faculty" className="text-right">Khoa</Label>
                 <Select onValueChange={setNewLecturerFaculty} value={newLecturerFaculty}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lecturer-unit-price" className="text-right">Đơn giá</Label>
                <Input id="lecturer-unit-price" type="number" value={newLecturerUnitPrice} onChange={(e) => setNewLecturerUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              {lecturers.map((lecturer) => (
                <TableRow key={lecturer.id}>
                  <TableCell className="font-medium">{lecturer.id}</TableCell>
                  <TableCell>{lecturer.name}</TableCell>
                  <TableCell>{lecturer.faculty}</TableCell>
                  <TableCell className="text-right">{formatCurrency(lecturer.unitPrice)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onClick={() => setEditingLecturer(lecturer)}>Sửa</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive">
                                Xóa
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn giảng viên khỏi hệ thống.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction>Tiếp tục</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin giảng viên</DialogTitle>
                          <DialogDescription>
                            Thay đổi thông tin chi tiết của giảng viên.
                          </DialogDescription>
                        </DialogHeader>
                        {editingLecturer && (
                        <div className="grid gap-4 py-4">
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lecturer-id-edit" className="text-right">Mã GV</Label>
                            <Input id="lecturer-id-edit" value={editingLecturer.id} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lecturer-name-edit" className="text-right">Họ và tên</Label>
                            <Input id="lecturer-name-edit" value={editingLecturer.name} onChange={(e) => setEditingLecturer({...editingLecturer, name: e.target.value})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lecturer-faculty-edit" className="text-right">Khoa</Label>
                            <Select value={editingLecturer.faculty} onValueChange={(value) => setEditingLecturer({...editingLecturer, faculty: value})}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn khoa" />
                              </SelectTrigger>
                              <SelectContent>
                                {faculties.map(faculty => <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lecturer-unit-price-edit" className="text-right">Đơn giá</Label>
                            <Input id="lecturer-unit-price-edit" type="number" value={editingLecturer.unitPrice} onChange={(e) => setEditingLecturer({...editingLecturer, unitPrice: Number(e.target.value)})} className="col-span-3" />
                          </div>
                        </div>
                        )}
                        <DialogFooter>
                          <Button type="submit">Lưu thay đổi</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
