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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type CourseSection, type Subject, type Lecturer, type Semester, type Classroom } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CourseSectionWithDetails = CourseSection & { subjectName: string, lecturerName: string, classroomName: string };

type CourseSectionsClientPageProps = {
  sections: CourseSectionWithDetails[];
  subjects: Subject[];
  lecturers: Lecturer[];
  semesters: Semester[];
  classrooms: Classroom[];
};

export function CourseSectionsClientPage({ 
  sections: initialSections,
  subjects,
  lecturers,
  semesters,
  classrooms,
}: CourseSectionsClientPageProps) {
  const [sections, setSections] = React.useState(initialSections);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSemester, setSelectedSemester] = React.useState('all');
  const [editingSection, setEditingSection] = React.useState<CourseSectionWithDetails | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newSection, setNewSection] = React.useState<Partial<CourseSection>>({
    subjectId: undefined,
    lecturerId: undefined,
    semesterId: undefined,
    maxStudents: 0,
    schedule: '',
  });

  React.useEffect(() => {
    let filtered = initialSections;

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(s => s.semesterId === selectedSemester);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.id.toLowerCase().includes(lowercasedQuery) ||
        s.subjectName.toLowerCase().includes(lowercasedQuery) ||
        s.lecturerName.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    setSections(filtered);
  }, [searchQuery, selectedSemester, initialSections]);

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Lớp học phần</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm lớp học phần
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm lớp học phần mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của lớp học phần.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Add form fields for new section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Môn học</Label>
                <Select onValueChange={val => setNewSection({...newSection, subjectId: val})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn môn học" /></SelectTrigger>
                    <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lecturer" className="text-right">Giảng viên</Label>
                <Select onValueChange={val => setNewSection({...newSection, lecturerId: val})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn giảng viên" /></SelectTrigger>
                    <SelectContent>{lecturers.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="semester" className="text-right">Học kỳ</Label>
                <Select onValueChange={val => setNewSection({...newSection, semesterId: val})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
                    <SelectContent>{semesters.map(s => <SelectItem key={s.id} value={s.id}>{`${s.name} - ${s.schoolYear}`}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxStudents" className="text-right">Sĩ số tối đa</Label>
                <Input id="maxStudents" type="number" className="col-span-3" value={newSection.maxStudents} onChange={e => setNewSection({...newSection, maxStudents: Number(e.target.value)})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule" className="text-right">Lịch học</Label>
                <Input id="schedule" className="col-span-3" placeholder="VD: T2, Tiết 1-3, P.301" value={newSection.schedule} onChange={e => setNewSection({...newSection, schedule: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
                <Label>Học kỳ</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả học kỳ</SelectItem>
                        {semesters.map(s => <SelectItem key={s.id} value={s.id}>{`${s.name} - ${s.schoolYear}`}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                <Label>Tìm kiếm</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm theo mã lớp, môn học, giảng viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                    />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Danh sách Lớp học phần</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lớp HP</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Sĩ số tối đa</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.id}</TableCell>
                  <TableCell>{section.subjectName}</TableCell>
                  <TableCell>{section.lecturerName}</TableCell>
                  <TableCell>{section.maxStudents}</TableCell>
                  <TableCell>{section.schedule}</TableCell>
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
                              <DropdownMenuItem onClick={() => setEditingSection(section)}>Sửa</DropdownMenuItem>
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
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn lớp học phần khỏi hệ thống.
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
                          <DialogTitle>Sửa thông tin lớp học phần</DialogTitle>
                          <DialogDescription>
                            Thay đổi thông tin của lớp học phần.
                          </DialogDescription>
                        </DialogHeader>
                        {editingSection && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject-edit" className="text-right">Môn học</Label>
                            <Select value={editingSection.subjectId} onValueChange={val => setEditingSection({...editingSection, subjectId: val})}>
                                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lecturer-edit" className="text-right">Giảng viên</Label>
                            <Select value={editingSection.lecturerId} onValueChange={val => setEditingSection({...editingSection, lecturerId: val})}>
                                <SelectTrigger className="col-span-3"><SelectValue/></SelectTrigger>
                                <SelectContent>{lecturers.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="semester-edit" className="text-right">Học kỳ</Label>
                             <Select value={editingSection.semesterId} onValueChange={val => setEditingSection({...editingSection, semesterId: val})}>
                                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                <SelectContent>{semesters.map(s => <SelectItem key={s.id} value={s.id}>{`${s.name} - ${s.schoolYear}`}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxStudents-edit" className="text-right">Sĩ số tối đa</Label>
                            <Input id="maxStudents-edit" type="number" className="col-span-3" value={editingSection.maxStudents} onChange={e => setEditingSection({...editingSection, maxStudents: Number(e.target.value)})}/>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="schedule-edit" className="text-right">Lịch học</Label>
                            <Input id="schedule-edit" className="col-span-3" value={editingSection.schedule} onChange={e => setEditingSection({...editingSection, schedule: e.target.value})}/>
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
