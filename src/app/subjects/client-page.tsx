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
import { type Subject, type Faculty, type Lecturer } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Select from 'react-select';
import { Badge } from '@/components/ui/badge';


export function SubjectsClientPage({ subjects, faculties, allSubjects, lecturers }: { subjects: Subject[], faculties: Faculty[], allSubjects: Subject[], lecturers: Lecturer[] }) {
  
  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || facultyId;
  }
  
  const getSubjectName = (subjectId: string) => {
    return allSubjects.find(s => s.id === subjectId)?.name || subjectId;
  }

  const getLecturerName = (lecturerId: string) => {
    return lecturers.find(l => l.id === lecturerId)?.name || lecturerId;
  }

  const subjectOptions = allSubjects.map(s => ({ value: s.id, label: `${s.name} (${s.id})` }));
  const lecturerOptions = lecturers.map(l => ({ value: l.id, label: `${l.name} (${l.id})` }));

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Môn học</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm môn học
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm môn học mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của môn học.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-id" className="text-right">Mã môn học</Label>
                <Input id="subject-id" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-name" className="text-right">Tên môn học</Label>
                <Input id="subject-name" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-credits" className="text-right">Số tín chỉ</Label>
                <Input id="subject-credits" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-faculty" className="text-right">Khoa</Label>
                 <Select
                    options={faculties.map(f => ({ value: f.id, label: f.name }))}
                    className="col-span-3"
                    placeholder="Chọn khoa"
                 />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-type" className="text-right">Loại môn</Label>
                 <Select
                    options={[{value: 'cơ bản', label: 'Cơ bản'}, {value: 'chuyên ngành', label: 'Chuyên ngành'}]}
                    className="col-span-3"
                    placeholder="Chọn loại môn"
                 />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-prerequisites" className="text-right pt-2">Môn tiên quyết</Label>
                <Select
                    isMulti
                    options={subjectOptions}
                    className="col-span-3"
                    placeholder="Chọn môn tiên quyết"
                />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-lecturers" className="text-right pt-2">Giảng viên</Label>
                <Select
                    isMulti
                    options={lecturerOptions}
                    className="col-span-3"
                    placeholder="Chọn giảng viên"
                />
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
              placeholder="Tìm kiếm môn học..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-[280px]"
              />
          </div>
          <Button>Tìm kiếm</Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã môn học</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead>Số TC</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Môn tiên quyết</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>{getFacultyName(subject.facultyId)}</TableCell>
                  <TableCell>
                      <Badge variant={subject.type === 'chuyên ngành' ? 'default' : 'secondary'}>
                          {subject.type}
                      </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {subject.prerequisites.map(p => <Badge key={p} variant="outline">{getSubjectName(p)}</Badge>)}
                    </div>
                  </TableCell>
                   <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {subject.lecturerIds.map(id => <Badge key={id} variant="outline">{getLecturerName(id)}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
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
                          <DropdownMenuItem>Sửa</DropdownMenuItem>
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
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
                            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn môn học khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction>Tiếp tục</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
