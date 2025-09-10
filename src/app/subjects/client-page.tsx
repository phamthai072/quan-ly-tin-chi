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
import { Check, MoreHorizontal, PlusCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { type Subject, type Faculty, type Lecturer } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


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

  const [selectedPrerequisites, setSelectedPrerequisites] = React.useState<string[]>([]);
  const [openPrerequisites, setOpenPrerequisites] = React.useState(false);
  const [selectedLecturers, setSelectedLecturers] = React.useState<string[]>([]);
  const [openLecturers, setOpenLecturers] = React.useState(false);

  const togglePrerequisite = (subjectId: string) => {
    setSelectedPrerequisites(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId) 
        : [...prev, subjectId]
    );
  }

  const toggleLecturer = (lecturerId: string) => {
    setSelectedLecturers(prev => 
      prev.includes(lecturerId) 
        ? prev.filter(id => id !== lecturerId) 
        : [...prev, lecturerId]
    );
  }

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
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-type" className="text-right">Loại môn</Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại môn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cơ bản">Cơ bản</SelectItem>
                    <SelectItem value="chuyên ngành">Chuyên ngành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-prerequisites" className="text-right pt-2">Môn tiên quyết</Label>
                <div className="col-span-3">
                    <Popover open={openPrerequisites} onOpenChange={setOpenPrerequisites}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start font-normal">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Chọn môn tiên quyết</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="start">
                             <Command>
                                <CommandInput placeholder="Tìm môn học..." />
                                <CommandList>
                                    <CommandEmpty>Không tìm thấy môn học.</CommandEmpty>
                                    <CommandGroup>
                                    {allSubjects.map((subject) => (
                                        <CommandItem
                                            key={subject.id}
                                            value={subject.id}
                                            onSelect={() => {
                                                togglePrerequisite(subject.id);
                                            }}
                                        >
                                            <div className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedPrerequisites.includes(subject.id)
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                 <Check className="h-4 w-4" />
                                            </div>
                                            <span>{subject.name} ({subject.id})</span>
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {selectedPrerequisites.map(id => (
                            <Badge key={id} variant="secondary">
                                {getSubjectName(id)}
                                <button onClick={() => togglePrerequisite(id)} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                     <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-lecturers" className="text-right pt-2">Giảng viên</Label>
                <div className="col-span-3">
                    <Popover open={openLecturers} onOpenChange={setOpenLecturers}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start font-normal">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Chọn giảng viên</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="start">
                             <Command>
                                <CommandInput placeholder="Tìm giảng viên..." />
                                <CommandList>
                                    <CommandEmpty>Không tìm thấy giảng viên.</CommandEmpty>
                                    <CommandGroup>
                                    {lecturers.map((lecturer) => (
                                        <CommandItem
                                            key={lecturer.id}
                                            value={lecturer.id}
                                            onSelect={() => {
                                                toggleLecturer(lecturer.id);
                                            }}
                                        >
                                            <div className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedLecturers.includes(lecturer.id)
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                 <Check className="h-4 w-4" />
                                            </div>
                                            <span>{lecturer.name} ({lecturer.id})</span>
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {selectedLecturers.map(id => (
                            <Badge key={id} variant="secondary">
                                {getLecturerName(id)}
                                <button onClick={() => toggleLecturer(id)} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                     <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
