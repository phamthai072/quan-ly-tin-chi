'use client';

import * as React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockStudents, type Student } from '@/lib/mock-data';
import { AlertTriangle, Settings } from 'lucide-react';
import { useState } from 'react';

export default function PerformanceAlerts({ students }: { students: Student[] }) {
    const [gpaThreshold, setGpaThreshold] = useState(2.0);
    const [failedCoursesThreshold, setFailedCoursesThreshold] = useState(3);

    const underperformingStudents = students.filter(
        student => student.gpa < gpaThreshold || student.failedCourses >= failedCoursesThreshold
    ).slice(0, 5); // Show top 5 for brevity

  return (
    <div className="space-y-4">
        <div className="flex justify-end">
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Cài đặt ngưỡng</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Cài đặt ngưỡng cảnh báo</DialogTitle>
                    <DialogDescription>
                        Tùy chỉnh các ngưỡng để hệ thống đưa ra cảnh báo học tập.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gpa-threshold" className="text-right">
                                GPA tối thiểu
                            </Label>
                            <Input id="gpa-threshold" value={gpaThreshold} onChange={(e) => setGpaThreshold(Number(e.target.value))} type="number" step="0.1" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="failed-courses-threshold" className="text-right">
                                Số môn trượt
                            </Label>
                            <Input id="failed-courses-threshold" value={failedCoursesThreshold} onChange={(e) => setFailedCoursesThreshold(Number(e.target.value))} type="number" step="1" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit">Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        {underperformingStudents.length > 0 ? (
            <div className="space-y-6">
                {underperformingStudents.map((student) => (
                    <div key={student.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                    </div>
                    <div className="ml-auto font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>GPA: {student.gpa.toFixed(2)}</span>
                    </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center text-muted-foreground py-8">
                <p>Không có cảnh báo nào.</p>
            </div>
        )}

    </div>
  );
}
