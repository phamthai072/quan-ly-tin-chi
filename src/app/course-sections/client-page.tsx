"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import {
  type Classroom,
  type CourseSection,
  type Lecturer,
  type Semester,
  type Subject,
} from "@/lib/mock-data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import * as React from "react";

// Helper function to convert period to time
const getPeriodTime = (period: number): string => {
  const startTimes = [
    "", // period 0 (not used)
    "07:00", // period 1
    "07:50", // period 2
    "08:40", // period 3
    "09:40", // period 4 (with 10min break)
    "10:30", // period 5
    "11:20", // period 6
    "13:00", // period 7 (afternoon)
    "13:50", // period 8
    "14:40", // period 9
    "15:40", // period 10 (with 10min break)
    "16:30", // period 11
    "17:20", // period 12
  ];
  return startTimes[period] || "";
};

const getPeriodEndTime = (period: number): string => {
  const endTimes = [
    "", // period 0 (not used)
    "07:45", // period 1
    "08:35", // period 2
    "09:25", // period 3
    "10:25", // period 4
    "11:15", // period 5
    "12:05", // period 6
    "13:45", // period 7
    "14:35", // period 8
    "15:25", // period 9
    "16:25", // period 10
    "17:15", // period 11
    "18:05", // period 12
  ];
  return endTimes[period] || "";
};

type CourseSectionWithDetails = CourseSection & {
  subjectName: string;
  lecturerName: string;
  classroomName: string;
};

type CourseSectionsClientPageProps = {
  sections: CourseSectionWithDetails[];
};

export function CourseSectionsClientPage({
  sections: initialSections,
}: CourseSectionsClientPageProps) {
  const [sections, setSections] = React.useState<CourseSectionWithDetails[]>(
    []
  );
  const [filteredSections, setFilteredSections] = React.useState<
    CourseSectionWithDetails[]
  >([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [lecturers, setLecturers] = React.useState<Lecturer[]>([]);
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSemester, setSelectedSemester] = React.useState("all");
  const [editingSection, setEditingSection] =
    React.useState<CourseSectionWithDetails | null>(null);
  const [editScheduleData, setEditScheduleData] = React.useState({
    dayOfWeek: "",
    startPeriod: "",
    endPeriod: "",
    classroomId: "",
  });

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingSection, setDeletingSection] =
    React.useState<CourseSectionWithDetails | null>(null);
  const [reload, setReload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Form states
  const [newSection, setNewSection] = React.useState({
    subjectId: "",
    lecturerId: "",
    semesterId: "",
    schedule: "",
  });
  const [scheduleData, setScheduleData] = React.useState({
    dayOfWeek: "",
    startPeriod: "",
    endPeriod: "",
    classroomId: "",
  });

  const { apiCall } = useApi();

  // Fetch subjects and lecturers from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const subjectsResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_mh as id, ten_mh as name, so_tin_chi as credits, ma_chuyen_nganh as majorId, loai as type FROM mon_hoc ORDER BY ten_mh",
          },
        });

        if (subjectsResponse?.success) {
          setSubjects(subjectsResponse.result.recordsets[0] || []);
        }

        // Fetch lecturers
        const lecturersResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_gv as id, ho_ten_gv as name, ma_khoa as facultyId, don_gia as unitPrice FROM giang_vien ORDER BY ho_ten_gv",
          },
        });

        if (lecturersResponse?.success) {
          setLecturers(lecturersResponse.result.recordsets[0] || []);
        }

        // Fetch classrooms
        const classroomsResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_phong as id, ten_phong as name, suc_chua as capacity FROM phong_hoc ORDER BY ten_phong",
          },
        });

        if (classroomsResponse?.success) {
          setClassrooms(classroomsResponse.result.recordsets[0] || []);
        }

        // Fetch semesters
        const semestersResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query:
              "SELECT ma_hk as id, ten_hk as name, nam_hoc as schoolYear, ngay_bat_dau as startDate, ngay_ket_thuc as endDate FROM hoc_ky ORDER BY ngay_bat_dau DESC",
          },
        });

        if (semestersResponse?.success) {
          setSemesters(semestersResponse.result.recordsets[0] || []);
        }

        // Fetch course sections with details
        const sectionsResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          body: {
            query: `
              SELECT 
                lhp.ma_lop_hp as id,
                lhp.ma_mh as subjectId,
                lhp.ma_gv as lecturerId,
                lhp.ma_hoc_ky as semesterId,
                lhp.ma_phong as classroomId,
                mh.ten_mh as subjectName,
                gv.ho_ten_gv as lecturerName,
                ph.ten_phong as classroomName,
                CONCAT(
                  CASE lh.thu 
                    WHEN 2 THEN N'Thứ 2'
                    WHEN 3 THEN N'Thứ 3'
                    WHEN 4 THEN N'Thứ 4'
                    WHEN 5 THEN N'Thứ 5'
                    WHEN 6 THEN N'Thứ 6'
                    WHEN 7 THEN N'Thứ 7'
                    WHEN 8 THEN N'Chủ nhật'
                  END,
                  ', Tiết ', lh.tiet_bat_dau, '-', lh.tiet_ket_thuc
                ) as schedule
              FROM lop_hoc_phan lhp
              LEFT JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
              LEFT JOIN giang_vien gv ON lhp.ma_gv = gv.ma_gv
              LEFT JOIN phong_hoc ph ON lhp.ma_phong = ph.ma_phong
              LEFT JOIN lich_hoc lh ON lhp.ma_lop_hp = lh.ma_lop_hp
              ORDER BY lhp.ma_lop_hp
            `,
          },
        });

        if (sectionsResponse?.success) {
          setSections(sectionsResponse.result.recordsets[0] || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reload]);

  React.useEffect(() => {
    let filtered = sections;

    if (selectedSemester !== "all") {
      filtered = filtered.filter((s) => s.semesterId === selectedSemester);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.id.toLowerCase().includes(lowercasedQuery) ||
          s.subjectName.toLowerCase().includes(lowercasedQuery) ||
          s.lecturerName.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredSections(filtered);
  }, [searchQuery, selectedSemester, sections]);

  const onCreate = async () => {
    // Validate inputs
    if (
      !newSection.subjectId ||
      !newSection.lecturerId ||
      !newSection.semesterId
    ) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Môn học, giảng viên và học kỳ là bắt buộc",
      });
      return;
    }

    if (
      !scheduleData.dayOfWeek ||
      !scheduleData.startPeriod ||
      !scheduleData.endPeriod ||
      !scheduleData.classroomId
    ) {
      toast({
        title: "Vui lòng điền đầy đủ lịch học",
        description:
          "Thứ, tiết bắt đầu, tiết kết thúc và phòng học là bắt buộc",
      });
      return;
    }

    if (
      parseInt(scheduleData.startPeriod) >= parseInt(scheduleData.endPeriod)
    ) {
      toast({
        title: "Lịch học không hợp lệ",
        description: "Tiết bắt đầu phải nhỏ hơn tiết kết thúc",
      });
      return;
    }

    // Generate class section ID
    // const newSectionId = `LHP-${Date.now()}`;

    setLoading(true);
    try {
      // Insert into lop_hoc_phan
      const sectionResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `INSERT INTO lop_hoc_phan (ma_mh, ma_gv, ma_hoc_ky, ma_phong) 
                   VALUES (N'${newSection.subjectId}', N'${newSection.lecturerId}', N'${newSection.semesterId}', N'${scheduleData.classroomId}')`,
        },
      });

      if (sectionResponse?.success) {
        // Insert into lich_hoc
        const newSectionId = sectionResponse.result.insertId;
        const scheduleResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `INSERT INTO lich_hoc (ma_lop_hp, thu, tiet_bat_dau, tiet_ket_thuc, ma_phong) 
                     VALUES (N'${newSectionId}', ${scheduleData.dayOfWeek}, ${scheduleData.startPeriod}, ${scheduleData.endPeriod}, N'${scheduleData.classroomId}')`,
          },
        });

        if (scheduleResponse?.success) {
          toast({
            title: "Thêm lớp học phần thành công",
          });
          setReload((prev) => !prev);
          setOpenAddDialog(false);
          // Reset form
          setNewSection({
            subjectId: "",
            lecturerId: "",
            semesterId: "",
            schedule: "",
          });
          setScheduleData({
            dayOfWeek: "",
            startPeriod: "",
            endPeriod: "",
            classroomId: "",
          });
        } else {
          toast({
            title: "Thêm lịch học thất bại",
            description: scheduleResponse?.error || "Lỗi hệ thống",
          });
        }
      } else {
        toast({
          title: "Thêm lớp học phần thất bại",
          description: sectionResponse?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    // Validate inputs
    if (!editingSection) {
      toast({
        title: "Chưa có thay đổi",
      });
      return;
    }

    if (
      !editingSection.subjectId ||
      !editingSection.lecturerId ||
      !editingSection.semesterId
    ) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Môn học, giảng viên và học kỳ là bắt buộc",
      });
      return;
    }

    if (
      !editScheduleData.dayOfWeek ||
      !editScheduleData.startPeriod ||
      !editScheduleData.endPeriod ||
      !editScheduleData.classroomId
    ) {
      toast({
        title: "Vui lòng điền đầy đủ lịch học",
        description:
          "Thứ, tiết bắt đầu, tiết kết thúc và phòng học là bắt buộc",
      });
      return;
    }

    if (
      parseInt(editScheduleData.startPeriod) >=
      parseInt(editScheduleData.endPeriod)
    ) {
      toast({
        title: "Lịch học không hợp lệ",
        description: "Tiết bắt đầu phải nhỏ hơn tiết kết thúc",
      });
      return;
    }

    setLoading(true);
    try {
      // Update lop_hoc_phan
      const sectionResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `UPDATE lop_hoc_phan 
                   SET ma_mh = N'${editingSection.subjectId}', ma_gv = N'${editingSection.lecturerId}', 
                       ma_hoc_ky = N'${editingSection.semesterId}', ma_phong = N'${editScheduleData.classroomId}' 
                   WHERE ma_lop_hp = N'${editingSection.id}'`,
        },
      });

      if (sectionResponse?.success) {
        // Update lich_hoc
        const scheduleResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `UPDATE lich_hoc 
                     SET thu = ${editScheduleData.dayOfWeek}, tiet_bat_dau = ${editScheduleData.startPeriod}, 
                         tiet_ket_thuc = ${editScheduleData.endPeriod}, ma_phong = N'${editScheduleData.classroomId}' 
                     WHERE ma_lop_hp = N'${editingSection.id}'`,
          },
        });

        if (scheduleResponse?.success) {
          toast({
            title: "Cập nhật lớp học phần thành công",
          });
          setReload((prev) => !prev);
          setOpenEditDialog(false);
        } else {
          toast({
            title: "Cập nhật lịch học thất bại",
            description: scheduleResponse?.error || "Lỗi hệ thống",
          });
        }
      } else {
        toast({
          title: "Cập nhật lớp học phần thất bại",
          description: sectionResponse?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deletingSection) {
      toast({
        title: "Vui lòng chọn lớp học phần để xóa",
      });
      return;
    }

    setLoading(true);
    try {
      // Delete from lich_hoc first (foreign key constraint)
      const scheduleResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `DELETE FROM lich_hoc WHERE ma_lop_hp = N'${deletingSection.id}'`,
        },
      });

      if (scheduleResponse?.success) {
        // Delete from lop_hoc_phan
        const sectionResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `DELETE FROM lop_hoc_phan WHERE ma_lop_hp = N'${deletingSection.id}'`,
          },
        });

        if (sectionResponse?.success) {
          toast({
            title: "Xóa lớp học phần thành công",
          });
          setReload((prev) => !prev);
          setOpenDeleteDialog(false);
        } else {
          toast({
            title: "Xóa lớp học phần thất bại",
            description: sectionResponse?.error || "Lỗi hệ thống",
          });
        }
      } else {
        toast({
          title: "Xóa lịch học thất bại",
          description: scheduleResponse?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleEdit = async (section: CourseSectionWithDetails) => {
    setEditingSection(section);

    // Fetch schedule data from database
    try {
      const scheduleResponse = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT thu as dayOfWeek, tiet_bat_dau as startPeriod, tiet_ket_thuc as endPeriod, ma_phong as classroomId 
                   FROM lich_hoc WHERE ma_lop_hp = N'${section.id}'`,
        },
      });

      if (
        scheduleResponse?.success &&
        scheduleResponse.result.recordsets[0]?.length > 0
      ) {
        const scheduleData = scheduleResponse.result.recordsets[0][0];
        setEditScheduleData({
          dayOfWeek: scheduleData.dayOfWeek?.toString() || "",
          startPeriod: scheduleData.startPeriod?.toString() || "",
          endPeriod: scheduleData.endPeriod?.toString() || "",
          classroomId: scheduleData.classroomId || "",
        });
      } else {
        setEditScheduleData({
          dayOfWeek: "",
          startPeriod: "",
          endPeriod: "",
          classroomId: "",
        });
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setEditScheduleData({
        dayOfWeek: "",
        startPeriod: "",
        endPeriod: "",
        classroomId: "",
      });
    }

    setOpenEditDialog(true);
  };

  const handleDelete = (section: CourseSectionWithDetails) => {
    setDeletingSection(section);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý Lớp học phần
        </h1>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm lớp học phần
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* bộ lọc tìm kiếm  */}
      <Card>
        <CardContent className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="semester-select">Học kỳ</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả học kỳ</SelectItem>
                  {semesters.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={s.id}
                    >{`${s.name} - ${s.schoolYear}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                // onClick={fetchRoomUtilization}
                // disabled={!selectedSemester || isLoading}
                className="w-full md:w-auto"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* bảng danh sách lớp học phần  */}
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
                <TableHead>Phòng học</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.id}</TableCell>
                  <TableCell>{section.subjectName}</TableCell>
                  <TableCell>{section.lecturerName}</TableCell>
                  <TableCell>{section.classroomName}</TableCell>
                  <TableCell>{section.schedule}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(section)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(section)}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Thêm lớp học phần mới</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết của lớp học phần.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Add form fields for new section */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Môn học
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewSection({ ...newSection, subjectId: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lecturer" className="text-right">
                Giảng viên
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewSection({ ...newSection, lecturerId: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn giảng viên" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Học kỳ
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewSection({ ...newSection, semesterId: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={s.id}
                    >{`${s.name} - ${s.schoolYear}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lịch học section */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Lịch học</Label>
              <div className="col-span-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-sm">Thứ</Label>
                    <Select
                      onValueChange={(val) =>
                        setScheduleData({ ...scheduleData, dayOfWeek: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thứ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Thứ 2</SelectItem>
                        <SelectItem value="3">Thứ 3</SelectItem>
                        <SelectItem value="4">Thứ 4</SelectItem>
                        <SelectItem value="5">Thứ 5</SelectItem>
                        <SelectItem value="6">Thứ 6</SelectItem>
                        <SelectItem value="7">Thứ 7</SelectItem>
                        <SelectItem value="8">Chủ nhật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Tiết bắt đầu</Label>
                    <Select
                      onValueChange={(val) =>
                        setScheduleData({ ...scheduleData, startPeriod: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tiết" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (period) => (
                            <SelectItem key={period} value={period.toString()}>
                              Tiết {period} ({getPeriodTime(period)} -{" "}
                              {getPeriodEndTime(period)})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Tiết kết thúc</Label>
                    <Select
                      onValueChange={(val) =>
                        setScheduleData({ ...scheduleData, endPeriod: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tiết" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (period) => (
                            <SelectItem key={period} value={period.toString()}>
                              Tiết {period} ({getPeriodTime(period)} -{" "}
                              {getPeriodEndTime(period)})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classroom" className="text-right">
                Phòng học
              </Label>
              <Select
                onValueChange={(val) =>
                  setScheduleData({ ...scheduleData, classroomId: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn phòng học" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} (Sức chứa: {c.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={onCreate} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin lớp học phần</DialogTitle>
            <DialogDescription>
              Thay đổi thông tin của lớp học phần.
            </DialogDescription>
          </DialogHeader>
          {editingSection && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-edit" className="text-right">
                  Môn học
                </Label>
                <Select
                  value={editingSection.subjectId}
                  onValueChange={(val) =>
                    setEditingSection({
                      ...editingSection,
                      subjectId: val,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lecturer-edit" className="text-right">
                  Giảng viên
                </Label>
                <Select
                  value={editingSection.lecturerId}
                  onValueChange={(val) =>
                    setEditingSection({
                      ...editingSection,
                      lecturerId: val,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="semester-edit" className="text-right">
                  Học kỳ
                </Label>
                <Select
                  value={editingSection.semesterId}
                  onValueChange={(val) =>
                    setEditingSection({
                      ...editingSection,
                      semesterId: val,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                      >{`${s.name} - ${s.schoolYear}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lịch học section for edit */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Lịch học</Label>
                <div className="col-span-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-sm">Thứ</Label>
                      <Select
                        value={editScheduleData.dayOfWeek}
                        onValueChange={(val) =>
                          setEditScheduleData({
                            ...editScheduleData,
                            dayOfWeek: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thứ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Thứ 2</SelectItem>
                          <SelectItem value="3">Thứ 3</SelectItem>
                          <SelectItem value="4">Thứ 4</SelectItem>
                          <SelectItem value="5">Thứ 5</SelectItem>
                          <SelectItem value="6">Thứ 6</SelectItem>
                          <SelectItem value="7">Thứ 7</SelectItem>
                          <SelectItem value="8">Chủ nhật</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Tiết bắt đầu</Label>
                      <Select
                        value={editScheduleData.startPeriod}
                        onValueChange={(val) =>
                          setEditScheduleData({
                            ...editScheduleData,
                            startPeriod: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tiết" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (period) => (
                              <SelectItem
                                key={period}
                                value={period.toString()}
                              >
                                Tiết {period} ({getPeriodTime(period)} -{" "}
                                {getPeriodEndTime(period)})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Tiết kết thúc</Label>
                      <Select
                        value={editScheduleData.endPeriod}
                        onValueChange={(val) =>
                          setEditScheduleData({
                            ...editScheduleData,
                            endPeriod: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tiết" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (period) => (
                              <SelectItem
                                key={period}
                                value={period.toString()}
                              >
                                Tiết {period} ({getPeriodTime(period)} -{" "}
                                {getPeriodEndTime(period)})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-edit" className="text-right">
                  Phòng học
                </Label>
                <Select
                  value={editScheduleData.classroomId}
                  onValueChange={(val) =>
                    setEditScheduleData({
                      ...editScheduleData,
                      classroomId: val,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn phòng học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} (Sức chứa: {c.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={onUpdate} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh
              viễn lớp học phần "{deletingSection?.id}" khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading ? "Đang xóa..." : "Tiếp tục"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
