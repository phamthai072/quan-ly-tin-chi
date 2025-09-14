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


export function SubjectsClientPage({ subjects: initialSubjects, faculties, allSubjects, lecturers }: { subjects: Subject[], faculties: Faculty[], allSubjects: Subject[], lecturers: Lecturer[] }) {
  const [subjects, setSubjects] = React.useState(initialSubjects);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [newSubjectId, setNewSubjectId] = React.useState('');
  const [newSubjectName, setNewSubjectName] = React.useState('');
  const [newSubjectCredits, setNewSubjectCredits] = React.useState<number | ''>('');
  const [newSubjectTheory, setNewSubjectTheory] = React.useState<number | ''>('');
  const [newSubjectPractice, setNewSubjectPractice] = React.useState<number | ''>('');
  const [newSubjectFaculty, setNewSubjectFaculty] = React.useState<any>(null);
  const [newSubjectType, setNewSubjectType] = React.useState<any>(null);
  const [newSubjectPrerequisites, setNewSubjectPrerequisites] = React.useState<any[]>([]);
  const [newSubjectLecturers, setNewSubjectLecturers] = React.useState<any[]>([]);

  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || facultyId;
  }
  
  const getSubjectName = (subjectId: string) => {
    return allSubjects.find(s => s.id === subjectId)?.name || subjectId;
  }

  const getLecturerName = (lecturerId: string) => {
    return lecturers.find(l => l.id === lecturerId)?.name || lecturerId;
  }
  
  const handleSearch = () => {
    const filteredSubjects = initialSubjects.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getFacultyName(s.facultyId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSubjects(filteredSubjects);
  };

  const subjectOptions = allSubjects.map(s => ({ value: s.id, label: `${s.name} (${s.id})` }));
  const lecturerOptions = lecturers.map(l => ({ value: l.id, label: `${l.name} (${l.id})` }));
  const facultyOptions = faculties.map(f => ({ value: f.id, label: f.name }));
  const typeOptions = [{value: 'cơ bản', label: 'Cơ bản'}, {value: 'chuyên ngành', label: 'Chuyên ngành'}];

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
                <Input id="subject-id" value={newSubjectId} onChange={e => setNewSubjectId(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-name" className="text-right">Tên môn học</Label>
                <Input id="subject-name" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-credits" className="text-right">Số tín chỉ</Label>
                <Input id="subject-credits" type="number" value={newSubjectCredits} onChange={e => setNewSubjectCredits(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-theory" className="text-right">Số tiết LT</Label>
                <Input id="subject-theory" type="number" value={newSubjectTheory} onChange={e => setNewSubjectTheory(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-practice" className="text-right">Số tiết TH</Label>
                <Input id="subject-practice" type="number" value={newSubjectPractice} onChange={e => setNewSubjectPractice(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-faculty" className="text-right">Khoa</Label>
                 <Select
                    options={facultyOptions}
                    value={newSubjectFaculty}
                    onChange={setNewSubjectFaculty}
                    className="col-span-3"
                    placeholder="Chọn khoa"
                 />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-type" className="text-right">Loại môn</Label>
                 <Select
                    options={typeOptions}
                    value={newSubjectType}
                    onChange={setNewSubjectType}
                    className="col-span-3"
                    placeholder="Chọn loại môn"
                 />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-prerequisites" className="text-right pt-2">Môn tiên quyết</Label>
                <Select
                    isMulti
                    options={subjectOptions}
                    value={newSubjectPrerequisites}
                    onChange={setNewSubjectPrerequisites}
                    className="col-span-3"
                    placeholder="Chọn môn tiên quyết"
                />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="subject-lecturers" className="text-right pt-2">Giảng viên</Label>
                <Select
                    isMulti
                    options={lecturerOptions}
                    value={newSubjectLecturers}
                    onChange={setNewSubjectLecturers}
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
                <TableHead>Mã môn học</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead>Số TC</TableHead>
                <TableHead>Số tiết</TableHead>
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
                  <TableCell>LT: {subject.theoryPeriods} <br /> TH: {subject.practicePeriods}</TableCell>
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
                              <DropdownMenuItem onClick={() => setEditingSubject(subject)}>Sửa</DropdownMenuItem>
                            </DialogTrigger>
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
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin môn học</DialogTitle>
                          <DialogDescription>
                            Thay đổi thông tin chi tiết của môn học.
                          </DialogDescription>
                        </DialogHeader>
                        {editingSubject && (
                        <div className="grid gap-4 py-4">
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-id-edit" className="text-right">Mã môn học</Label>
                            <Input id="subject-id-edit" value={editingSubject.id} className="col-span-3" readOnly/>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-name-edit" className="text-right">Tên môn học</Label>
                            <Input id="subject-name-edit" value={editingSubject.name} onChange={e => setEditingSubject({...editingSubject, name: e.target.value})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-credits-edit" className="text-right">Số tín chỉ</Label>
                            <Input id="subject-credits-edit" type="number" value={editingSubject.credits} onChange={e => setEditingSubject({...editingSubject, credits: Number(e.target.value)})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-theory-edit" className="text-right">Số tiết LT</Label>
                            <Input id="subject-theory-edit" type="number" value={editingSubject.theoryPeriods} onChange={e => setEditingSubject({...editingSubject, theoryPeriods: Number(e.target.value)})} className="col-span-3" />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-practice-edit" className="text-right">Số tiết TH</Label>
                            <Input id="subject-practice-edit" type="number" value={editingSubject.practicePeriods} onChange={e => setEditingSubject({...editingSubject, practicePeriods: Number(e.target.value)})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-faculty-edit" className="text-right">Khoa</Label>
                            <Select
                                options={facultyOptions}
                                className="col-span-3"
                                placeholder="Chọn khoa"
                                value={facultyOptions.find(f => f.value === editingSubject.facultyId)}
                                onChange={(option: any) => setEditingSubject({...editingSubject, facultyId: option.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-type-edit" className="text-right">Loại môn</Label>
                            <Select
                                options={typeOptions}
                                className="col-span-3"
                                placeholder="Chọn loại môn"
                                value={typeOptions.find(t => t.value === editingSubject.type)}
                                onChange={(option: any) => setEditingSubject({...editingSubject, type: option.value})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="subject-prerequisites-edit" className="text-right pt-2">Môn tiên quyết</Label>
                            <Select
                                isMulti
                                options={subjectOptions}
                                className="col-span-3"
                                placeholder="Chọn môn tiên quyết"
                                value={editingSubject.prerequisites.map(p => subjectOptions.find(s => s.value === p))}
                                onChange={(options: any) => setEditingSubject({...editingSubject, prerequisites: options.map((o: any) => o.value)})}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="subject-lecturers-edit" className="text-right pt-2">Giảng viên</Label>
                            <Select
                                isMulti
                                options={lecturerOptions}
                                className="col-span-3"
                                placeholder="Chọn giảng viên"
                                value={editingSubject.lecturerIds.map(id => lecturerOptions.find(l => l.value === id))}
                                onChange={(options: any) => setEditingSubject({...editingSubject, lecturerIds: options.map((o: any) => o.value)})}
                            />
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
