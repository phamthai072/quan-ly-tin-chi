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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Semester, type Faculty, type Student } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type CourseSection = {
  id: string;
  subjectId: string;
  subjectName: string;
  credits: number;
  maxStudents: number;
  currentStudents: number;
  lecturerName: string;
  schedule: string;
  facultyId: string;
  semesterId: string;
};

type CourseRegistrationClientPageProps = {
  sections: CourseSection[];
  semesters: Semester[];
  faculties: Faculty[];
  students: Student[];
};

export function CourseRegistrationClientPage({ 
  sections: initialSections, 
  semesters, 
  faculties,
  students
}: CourseRegistrationClientPageProps) {
  const [sections, setSections] = React.useState(initialSections);
  const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]?.id || '');
  const [selectedStudent, setSelectedStudent] = React.useState<string | undefined>(undefined);
  const [selectedSections, setSelectedSections] = React.useState<Set<string>>(new Set());

  const handleFilter = () => {
    let filtered = initialSections;
    if (selectedSemester) {
        filtered = filtered.filter(s => s.semesterId === selectedSemester);
    }
    
    setSections(filtered);
  };
  
  React.useEffect(() => {
    handleFilter();
  }, [selectedSemester]);

  const toggleSelection = (sectionId: string) => {
    setSelectedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || facultyId;
  };
  
  const totalCredits = React.useMemo(() => {
    return Array.from(selectedSections).reduce((total, sectionId) => {
        const section = initialSections.find(s => s.id === sectionId);
        return total + (section?.credits || 0);
    }, 0);
  }, [selectedSections, initialSections]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Đăng ký tín chỉ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sinh viên và học kỳ</CardTitle>
          <CardDescription>Lọc danh sách lớp học phần theo thông tin dưới đây.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
             <div className='space-y-2'>
                <label>Sinh viên</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn sinh viên" />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.id}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                <label>Học kỳ</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        {semesters.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.schoolYear}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp học phần</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>Chọn</TableHead>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead>Số TC</TableHead>
                <TableHead>Sĩ số</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Khoa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id} data-state={selectedSections.has(section.id) ? "selected" : ""}>
                  <TableCell>
                      <Checkbox 
                        checked={selectedSections.has(section.id)}
                        onCheckedChange={() => toggleSelection(section.id)}
                      />
                  </TableCell>
                  <TableCell className="font-medium">{section.id}</TableCell>
                  <TableCell>{section.subjectName}</TableCell>
                  <TableCell>{section.credits}</TableCell>
                  <TableCell>{section.currentStudents}/{section.maxStudents}</TableCell>
                  <TableCell>{section.schedule}</TableCell>
                  <TableCell>{section.lecturerName}</TableCell>
                  <TableCell>{getFacultyName(section.facultyId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Lớp đã chọn</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSections.size > 0 ? (
            <div className="space-y-4">
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã lớp</TableHead>
                            <TableHead>Tên môn học</TableHead>
                            <TableHead>Số TC</TableHead>
                            <TableHead>Lịch học</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialSections.filter(s => selectedSections.has(s.id)).map(section => (
                             <TableRow key={section.id}>
                                <TableCell className="font-medium">{section.id}</TableCell>
                                <TableCell>{section.subjectName}</TableCell>
                                <TableCell>{section.credits}</TableCell>
                                <TableCell>{section.schedule}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Bạn chưa chọn lớp học phần nào.</p>
          )}
        </CardContent>
         <CardFooter className="flex justify-between items-center border-t pt-6">
            <div>
                <span className="font-bold text-lg">Tổng số tín chỉ: {totalCredits}</span>
            </div>
            <Button size="lg" disabled={selectedSections.size === 0 || !selectedStudent}>
                Đăng ký
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
