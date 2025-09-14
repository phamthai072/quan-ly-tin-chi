'use client';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Lecturer, type Semester, type CourseSection, type Subject } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

type LecturerSalaryClientPageProps = {
    lecturers: Lecturer[];
    semesters: Semester[];
    courseSections: CourseSection[];
    subjects: Subject[];
}

type SalaryDetails = {
    totalClasses: number;
    totalPeriods: number;
    totalIncome: number;
    monthlySalary: number;
    taughtSections: (CourseSection & { subjectName: string; theoryPeriods: number; practicePeriods: number; totalPeriods: number; })[];
}

export function LecturerSalaryClientPage({ lecturers, semesters, courseSections, subjects }: LecturerSalaryClientPageProps) {
    const [selectedLecturerId, setSelectedLecturerId] = React.useState<string | undefined>();
    const [selectedSemesterId, setSelectedSemesterId] = React.useState<string | undefined>();
    const [salaryDetails, setSalaryDetails] = React.useState<SalaryDetails | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    const handleCalculateSalary = () => {
        if (!selectedLecturerId || !selectedSemesterId) {
            setSalaryDetails(null);
            return;
        }

        const lecturer = lecturers.find(l => l.id === selectedLecturerId);
        if (!lecturer) {
            setSalaryDetails(null);
            return;
        }

        const taughtSectionsInSemester = courseSections.filter(cs => 
            cs.lecturerId === selectedLecturerId && cs.semesterId === selectedSemesterId
        );

        const taughtSectionsWithDetails = taughtSectionsInSemester.map(section => {
            const subject = subjects.find(s => s.id === section.subjectId);
            const totalPeriods = (subject?.theoryPeriods || 0) + (subject?.practicePeriods || 0);
            return {
                ...section,
                subjectName: subject?.name || 'N/A',
                theoryPeriods: subject?.theoryPeriods || 0,
                practicePeriods: subject?.practicePeriods || 0,
                totalPeriods: totalPeriods
            };
        });

        const totalClasses = taughtSectionsInSemester.length;
        const totalPeriods = taughtSectionsWithDetails.reduce((sum, section) => sum + section.totalPeriods, 0);
        const totalIncome = totalPeriods * lecturer.unitPrice;
        const monthlySalary = totalIncome / 4; // Semester has 4 months

        setSalaryDetails({
            totalClasses,
            totalPeriods,
            totalIncome,
            monthlySalary,
            taughtSections: taughtSectionsWithDetails,
        });
    };

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Tính lương giảng viên</h1>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Chọn thông tin</CardTitle>
                <CardDescription>Chọn giảng viên và học kỳ để tính toán lương.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <div className='space-y-2'>
                        <label>Giảng viên</label>
                        <Select value={selectedLecturerId} onValueChange={setSelectedLecturerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn giảng viên" />
                            </SelectTrigger>
                            <SelectContent>
                                {lecturers.map(l => <SelectItem key={l.id} value={l.id}>{l.name} - {l.id}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <label>Học kỳ</label>
                        <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn học kỳ" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.schoolYear}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button onClick={handleCalculateSalary} disabled={!selectedLecturerId || !selectedSemesterId}>
                        <Wallet className="mr-2 h-4 w-4" /> Tính lương
                    </Button>
                </CardFooter>
            </Card>

            {salaryDetails && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Kết quả tính lương</CardTitle>
                        <CardDescription>
                            Bảng lương chi tiết cho giảng viên {lecturers.find(l => l.id === selectedLecturerId)?.name} trong học kỳ {semesters.find(s => s.id === selectedSemesterId)?.name} năm học {semesters.find(s => s.id === selectedSemesterId)?.schoolYear}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tổng số lớp</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{salaryDetails.totalClasses}</div>
                                     <p className="text-xs text-muted-foreground">{salaryDetails.totalClasses > 8 ? <Badge variant="destructive">Vượt quá 8 lớp</Badge> : "Trong giới hạn"}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tổng số tiết</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{salaryDetails.totalPeriods}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(salaryDetails.totalIncome)}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lương tháng (TB)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(salaryDetails.monthlySalary)}</div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Chi tiết các lớp đã dạy</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã lớp HP</TableHead>
                                        <TableHead>Tên môn học</TableHead>
                                        <TableHead>Lịch học</TableHead>
                                        <TableHead className="text-right">Số tiết</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salaryDetails.taughtSections.map(section => (
                                        <TableRow key={section.id}>
                                            <TableCell>{section.id}</TableCell>
                                            <TableCell>{section.subjectName}</TableCell>
                                            <TableCell>{section.schedule}</TableCell>
                                            <TableCell className="text-right">{section.totalPeriods}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    );
}