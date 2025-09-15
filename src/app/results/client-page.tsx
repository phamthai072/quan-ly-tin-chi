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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Result, type Student, type Semester, type Subject } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ResultWithDetails = Result & { studentName: string; subjectName: string; semesterName: string; };

type ResultsClientPageProps = {
  results: ResultWithDetails[];
  students: Student[];
  semesters: Semester[];
  subjects: Subject[];
};

export function ResultsClientPage({ 
    results: initialResults, 
    students,
    semesters,
    subjects,
}: ResultsClientPageProps) {
  const [results, setResults] = React.useState(initialResults);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSemester, setSelectedSemester] = React.useState<string>("all");
  const [selectedStudent, setSelectedStudent] = React.useState<string>("all");
  const [editingResult, setEditingResult] = React.useState<ResultWithDetails | null>(null);

  const [isNewResultDialogOpen, setIsNewResultDialogOpen] = React.useState(false);
  const [newResult, setNewResult] = React.useState<Partial<Result>>({
      studentId: undefined,
      semesterId: undefined,
      subjectId: undefined,
      midtermScore: null,
      finalScore: null,
  });

  const handleSearch = () => {
    let filteredResults = initialResults;

    if (selectedSemester !== "all") {
        filteredResults = filteredResults.filter(r => r.semesterId === selectedSemester);
    }

    if (selectedStudent !== "all") {
        filteredResults = filteredResults.filter(r => r.studentId === selectedStudent);
    }
    
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filteredResults = filteredResults.filter(r => 
            r.studentName.toLowerCase().includes(lowercasedQuery) ||
            r.studentId.toLowerCase().includes(lowercasedQuery) ||
            r.subjectName.toLowerCase().includes(lowercasedQuery)
        );
    }

    setResults(filteredResults);
  };
  
  React.useEffect(() => {
    handleSearch();
  }, [selectedSemester, selectedStudent, searchQuery]);


  const calculateGPA = (midterm: number | null, final: number | null) => {
      if (midterm === null || final === null) return null;
      const overall = midterm * 0.3 + final * 0.7;
      if (overall >= 8.5) return 4.0;
      if (overall >= 7.0) return 3.0;
      if (overall >= 5.5) return 2.0;
      if (overall >= 4.0) return 1.0;
      return 0.0;
  }

  const getLetterGrade = (gpa: number | null) => {
      if (gpa === null) return 'N/A';
      if (gpa >= 4.0) return 'A+';
      if (gpa >= 3.7) return 'A';
      if (gpa >= 3.0) return 'B+';
      if (gpa >= 2.0) return 'C';
      if (gpa >= 1.0) return 'D';
      return 'F';
  }

  const handleSaveNewResult = () => {
      // Logic to save the new result would go here
      console.log('Saving new result:', newResult);
      setIsNewResultDialogOpen(false);
  }

   const handleSaveEditedResult = () => {
      // Logic to save the edited result would go here
      console.log('Saving edited result:', editingResult);
      setEditingResult(null);
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Kết quả học tập</h1>
         <Dialog open={isNewResultDialogOpen} onOpenChange={setIsNewResultDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Nhập điểm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nhập điểm mới</DialogTitle>
              <DialogDescription>
                Điền thông tin điểm của sinh viên.
              </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="student-select" className="text-right">Sinh viên</Label>
                 <Select onValueChange={value => setNewResult({...newResult, studentId: value})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn sinh viên" /></SelectTrigger>
                    <SelectContent>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.id}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="semester-select" className="text-right">Học kỳ</Label>
                 <Select onValueChange={value => setNewResult({...newResult, semesterId: value})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
                    <SelectContent>
                        {semesters.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.schoolYear}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-select" className="text-right">Môn học</Label>
                 <Select onValueChange={value => setNewResult({...newResult, subjectId: value})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn môn học" /></SelectTrigger>
                    <SelectContent>
                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="midterm-score" className="text-right">Điểm giữa kỳ</Label>
                <Input id="midterm-score" type="number" value={newResult.midtermScore ?? ''} onChange={e => setNewResult({...newResult, midtermScore: e.target.value === '' ? null : Number(e.target.value)})} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="final-score" className="text-right">Điểm cuối kỳ</Label>
                <Input id="final-score" type="number" value={newResult.finalScore ?? ''} onChange={e => setNewResult({...newResult, finalScore: e.target.value === '' ? null : Number(e.target.value)})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveNewResult} type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className='space-y-2'>
                <Label>Học kỳ</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả học kỳ</SelectItem>
                        {semesters.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.schoolYear}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className='space-y-2'>
                <Label>Sinh viên</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn sinh viên" />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">Tất cả sinh viên</SelectItem>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.id}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className='space-y-2'>
                <Label>Tìm kiếm</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm theo tên/mã SV, môn học..."
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
          <CardTitle>Danh sách điểm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead className="text-center">Giữa kỳ</TableHead>
                <TableHead className="text-center">Cuối kỳ</TableHead>
                <TableHead className="text-center">Điểm chữ</TableHead>
                <TableHead className="text-center">GPA (Hệ 4)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.studentId}</TableCell>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>{result.subjectName}</TableCell>
                  <TableCell>{result.semesterName}</TableCell>
                  <TableCell className="text-center">{result.midtermScore?.toFixed(1) ?? 'N/A'}</TableCell>
                  <TableCell className="text-center">{result.finalScore?.toFixed(1) ?? 'N/A'}</TableCell>
                  <TableCell className="text-center">{getLetterGrade(result.gpa)}</TableCell>
                   <TableCell className="text-center">{result.gpa?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>
                    <Dialog onOpenChange={(open) => !open && setEditingResult(null)}>
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
                                <DropdownMenuItem onClick={() => setEditingResult(result)}>Sửa điểm</DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                       <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Sửa điểm</DialogTitle>
                          <DialogDescription>
                            Chỉnh sửa điểm cho sinh viên.
                          </DialogDescription>
                        </DialogHeader>
                        {editingResult && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Sinh viên</Label>
                                <Input value={editingResult.studentName} readOnly className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Môn học</Label>
                                <Input value={editingResult.subjectName} readOnly className="col-span-3" />
                            </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="midterm-score-edit" className="text-right">Điểm giữa kỳ</Label>
                            <Input id="midterm-score-edit" type="number" value={editingResult.midtermScore ?? ''} onChange={(e) => setEditingResult({...editingResult, midtermScore: e.target.value === '' ? null : Number(e.target.value)})} className="col-span-3" />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="final-score-edit" className="text-right">Điểm cuối kỳ</Label>
                            <Input id="final-score-edit" type="number" value={editingResult.finalScore ?? ''} onChange={(e) => setEditingResult({...editingResult, finalScore: e.target.value === '' ? null : Number(e.target.value)})} className="col-span-3" />
                          </div>
                        </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleSaveEditedResult} type="submit">Lưu thay đổi</Button>
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
