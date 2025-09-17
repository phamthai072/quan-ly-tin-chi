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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { useRenderCount } from '@/hooks/useRenderCount';

type Student = {
  ma_sv: string;
  ho_ten_sv: string;
  ma_chuyen_nganh: string;
  ma_khoa_hoc: string;
  he_dao_tao: string;
};

type Semester = {
  ma_hk: string;
  ten_hk: string;
  nam_hoc: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
};

type CourseSection = {
  ma_lop_hp: string;
  ma_mh: string;
  ten_mh: string;
  so_tin_chi: number;
  ho_ten_gv: string;
  ma_hoc_ky: string;
  ma_phong: string;
  ten_phong: string;
  suc_chua: number;
  so_sv_hien_tai: number;
  lop_loai: string;
  ten_khoa: string;
};

type RegisteredCourse = {
  ma_lop_hp: string;
  ma_mh: string;
  ten_mh: string;
  so_tin_chi: number;
  ho_ten_gv: string;
  diem: number | null;
};

export function CourseRegistrationClientPage() {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [sections, setSections] = React.useState<CourseSection[]>([]);
  const [registeredCourses, setRegisteredCourses] = React.useState<RegisteredCourse[]>([]);
  const [selectedStudent, setSelectedStudent] = React.useState<string>('');
  const [selectedSemester, setSelectedSemester] = React.useState<string>('');
  const [selectedSections, setSelectedSections] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [unregisterDialog, setUnregisterDialog] = React.useState(false);
  const [selectedCourseToUnregister, setSelectedCourseToUnregister] = React.useState<string>('');

  // Fetch initial data
  React.useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch students
      const studentsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT ma_sv, ho_ten_sv, ma_chuyen_nganh, ma_khoa_hoc, he_dao_tao FROM sinh_vien ORDER BY ho_ten_sv",
        },
      });

      if (studentsResponse?.success) {
        setStudents(studentsResponse.result.recordsets[0] || []);
      }

      // Fetch semesters
      const semestersResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT ma_hk, ten_hk, nam_hoc, ngay_bat_dau, ngay_ket_thuc FROM hoc_ky ORDER BY ngay_bat_dau DESC",
        },
      });

      if (semestersResponse?.success) {
        setSemesters(semestersResponse.result.recordsets[0] || []);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch available course sections when student and semester are selected
  React.useEffect(() => {
    if (selectedStudent && selectedSemester) {
      fetchAvailableSections();
      fetchRegisteredCourses();
    }
  }, [selectedStudent, selectedSemester, reload]);

  const fetchAvailableSections = async () => {
    let query = `
      SELECT 
        lhp.ma_lop_hp,
        lhp.ma_mh,
        mh.ten_mh,
        mh.so_tin_chi,
        gv.ho_ten_gv,
        lhp.ma_hoc_ky,
        lhp.ma_phong,
        ph.ten_phong,
        ph.suc_chua,
        COALESCE(COUNT(kq.ma_sv), 0) as so_sv_hien_tai,
        mh.loai as lop_loai,
        k.ten_khoa
      FROM lop_hoc_phan lhp
      INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
      INNER JOIN giang_vien gv ON lhp.ma_gv = gv.ma_gv
      INNER JOIN phong_hoc ph ON lhp.ma_phong = ph.ma_phong
      INNER JOIN khoa k ON mh.ma_khoa = k.ma_khoa
      LEFT JOIN ket_qua kq ON lhp.ma_lop_hp = kq.ma_lop_hp
      WHERE lhp.ma_hoc_ky = N'${selectedSemester}'
    `;

    if (searchQuery) {
      query += ` AND (mh.ten_mh LIKE N'%${searchQuery}%' OR lhp.ma_lop_hp LIKE N'%${searchQuery}%' OR gv.ho_ten_gv LIKE N'%${searchQuery}%')`;
    }

    query += `
      GROUP BY lhp.ma_lop_hp, lhp.ma_mh, mh.ten_mh, mh.so_tin_chi, gv.ho_ten_gv, 
               lhp.ma_hoc_ky, lhp.ma_phong, ph.ten_phong, ph.suc_chua, mh.loai, k.ten_khoa
      ORDER BY mh.ten_mh
    `;

    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { query },
    });

    if (response?.success) {
      setSections(response.result.recordsets[0] || []);
    } else {
      console.error('Lỗi khi tải danh sách lớp học phần:', response?.error);
    }
  };

  const fetchRegisteredCourses = async () => {
    const query = `
      SELECT 
        kq.ma_lop_hp,
        lhp.ma_mh,
        mh.ten_mh,
        mh.so_tin_chi,
        gv.ho_ten_gv,
        kq.diem
      FROM ket_qua kq
      INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
      INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
      INNER JOIN giang_vien gv ON lhp.ma_gv = gv.ma_gv
      WHERE kq.ma_sv = N'${selectedStudent}' AND lhp.ma_hoc_ky = N'${selectedSemester}'
      ORDER BY mh.ten_mh
    `;

    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { query },
    });

    if (response?.success) {
      setRegisteredCourses(response.result.recordsets[0] || []);
    }
  };

  const handleSearch = () => {
    if (selectedStudent && selectedSemester) {
      fetchAvailableSections();
    }
  };

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

  const totalCredits = React.useMemo(() => {
    return Array.from(selectedSections).reduce((total, sectionId) => {
      const section = sections.find(s => s.ma_lop_hp === sectionId);
      return total + (section?.so_tin_chi || 0);
    }, 0);
  }, [selectedSections, sections]);

  const totalRegisteredCredits = React.useMemo(() => {
    return registeredCourses.reduce((total, course) => {
      return total + course.so_tin_chi;
    }, 0);
  }, [registeredCourses]);

  const onRegister = async () => {
    if (selectedSections.size === 0) {
      toast({
        title: "Vui lòng chọn ít nhất một lớp học phần",
      });
      return;
    }

    let successCount = 0;
    let errorMessages: string[] = [];

    for (const sectionId of selectedSections) {
      try {
        const response = await apiCall({
          endpoint: `/api/query`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `EXEC proc_dang_ky_lop N'${selectedStudent}', N'${sectionId}'`,
          },
        });

        if (response?.success) {
          successCount++;
        } else {
          const section = sections.find(s => s.ma_lop_hp === sectionId);
          errorMessages.push(`${section?.ten_mh || sectionId}: ${response?.error || 'Lỗi không xác định'}`);
        }
      } catch (error) {
        const section = sections.find(s => s.ma_lop_hp === sectionId);
        errorMessages.push(`${section?.ten_mh || sectionId}: Lỗi hệ thống`);
      }
    }

    if (successCount > 0) {
      toast({
        title: `Đăng ký thành công ${successCount} lớp học phần`,
      });
      setSelectedSections(new Set());
      setReload(prev => !prev);
    }

    if (errorMessages.length > 0) {
      toast({
        title: "Một số lớp đăng ký thất bại",
        description: errorMessages.join('\n'),
        variant: "destructive"
      });
    }

    setConfirmDialog(false);
  };

  const onUnregister = async () => {
    if (!selectedCourseToUnregister) return;

    try {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `EXEC proc_huy_dang_ky N'${selectedStudent}', N'${selectedCourseToUnregister}'`,
        },
      });

      if (response?.success) {
        toast({
          title: "Hủy đăng ký thành công",
        });
        setReload(prev => !prev);
      } else {
        toast({
          title: "Hủy đăng ký thất bại",
          description: response?.error || "Lỗi hệ thống",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hủy đăng ký thất bại",
        description: "Lỗi hệ thống",
        variant: "destructive"
      });
    }

    setUnregisterDialog(false);
    setSelectedCourseToUnregister('');
  };

  const isAlreadyRegistered = (sectionId: string) => {
    return registeredCourses.some(course => course.ma_lop_hp === sectionId);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Đăng ký tín chỉ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sinh viên và học kỳ</CardTitle>
          <CardDescription>Chọn sinh viên và học kỳ để xem danh sách lớp học phần.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <label>Sinh viên</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn sinh viên" />
              </SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.ma_sv} value={s.ma_sv}>
                    {s.ho_ten_sv} - {s.ma_sv}
                  </SelectItem>
                ))}
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
                {semesters.map(s => (
                  <SelectItem key={s.ma_hk} value={s.ma_hk}>
                    {s.ten_hk} - {s.nam_hoc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && selectedSemester && (
        <>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm lớp học phần..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-[280px]"
              />
            </div>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lớp học phần đã đăng ký (Tổng: {totalRegisteredCredits} tín chỉ)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã lớp</TableHead>
                    <TableHead>Tên môn học</TableHead>
                    <TableHead>Số TC</TableHead>
                    <TableHead>Giảng viên</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : registeredCourses.length > 0 ? (
                    registeredCourses.map((course) => (
                      <TableRow key={course.ma_lop_hp}>
                        <TableCell className="font-medium">{course.ma_lop_hp}</TableCell>
                        <TableCell>{course.ten_mh}</TableCell>
                        <TableCell>{course.so_tin_chi}</TableCell>
                        <TableCell>{course.ho_ten_gv}</TableCell>
                        <TableCell>
                          {course.diem !== null ? (
                            <Badge variant={course.diem >= 5 ? "default" : "destructive"}>
                              {course.diem}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Chưa có điểm</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourseToUnregister(course.ma_lop_hp);
                                  setUnregisterDialog(true);
                                }}
                                className="text-destructive"
                              >
                                Hủy đăng ký
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Chưa đăng ký lớp học phần nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lớp học phần có thể đăng ký</CardTitle>
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
                    <TableHead>Phòng học</TableHead>
                    <TableHead>Giảng viên</TableHead>
                    <TableHead>Loại môn</TableHead>
                    <TableHead>Khoa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : sections.length > 0 ? (
                    sections.map((section) => {
                      const alreadyRegistered = isAlreadyRegistered(section.ma_lop_hp);
                      const isFull = section.so_sv_hien_tai >= section.suc_chua;
                      
                      return (
                        <TableRow 
                          key={section.ma_lop_hp} 
                          data-state={selectedSections.has(section.ma_lop_hp) ? "selected" : ""}
                          className={alreadyRegistered ? "opacity-50" : ""}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedSections.has(section.ma_lop_hp)}
                              onCheckedChange={() => toggleSelection(section.ma_lop_hp)}
                              disabled={alreadyRegistered || isFull}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{section.ma_lop_hp}</TableCell>
                          <TableCell>{section.ten_mh}</TableCell>
                          <TableCell>{section.so_tin_chi}</TableCell>
                          <TableCell>
                            <Badge variant={isFull ? "destructive" : "default"}>
                              {section.so_sv_hien_tai}/{section.suc_chua}
                            </Badge>
                          </TableCell>
                          <TableCell>{section.ten_phong}</TableCell>
                          <TableCell>{section.ho_ten_gv}</TableCell>
                          <TableCell>
                            <Badge variant={section.lop_loai === 'cơ bản' ? "secondary" : "outline"}>
                              {section.lop_loai}
                            </Badge>
                          </TableCell>
                          <TableCell>{section.ten_khoa}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      {renderCount < 1 && (
                        <TableCell colSpan={9} className="text-center">
                          Không có dữ liệu
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lớp đã chọn để đăng ký</CardTitle>
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
                        <TableHead>Giảng viên</TableHead>
                        <TableHead>Phòng học</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.filter(s => selectedSections.has(s.ma_lop_hp)).map(section => (
                        <TableRow key={section.ma_lop_hp}>
                          <TableCell className="font-medium">{section.ma_lop_hp}</TableCell>
                          <TableCell>{section.ten_mh}</TableCell>
                          <TableCell>{section.so_tin_chi}</TableCell>
                          <TableCell>{section.ho_ten_gv}</TableCell>
                          <TableCell>{section.ten_phong}</TableCell>
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
                <span className="font-bold text-lg">Tổng số tín chỉ sẽ đăng ký: {totalCredits}</span>
                <br />
                <span className="text-sm text-muted-foreground">
                  Tổng tín chỉ sau khi đăng ký: {totalRegisteredCredits + totalCredits}
                </span>
              </div>
              <Button 
                size="lg" 
                disabled={selectedSections.size === 0}
                onClick={() => setConfirmDialog(true)}
              >
                Đăng ký ({selectedSections.size} lớp)
              </Button>
            </CardFooter>
          </Card>

          {/* Confirm registration dialog */}
          <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận đăng ký</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn đăng ký {selectedSections.size} lớp học phần đã chọn?
                  Tổng số tín chỉ sẽ đăng ký: {totalCredits}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onRegister}>Xác nhận đăng ký</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Confirm unregister dialog */}
          <AlertDialog open={unregisterDialog} onOpenChange={setUnregisterDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận hủy đăng ký</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn hủy đăng ký lớp học phần này không?
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onUnregister}>Xác nhận hủy đăng ký</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
