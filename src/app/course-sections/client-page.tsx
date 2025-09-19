"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  type Lecturer,
  type Semester,
  type Subject,
} from "@/lib/mock-data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import * as React from "react";
import { AddSectionDialog } from "./components/add-section-dialog";
import { DeleteSectionDialog } from "./components/delete-section-dialog";
import { EditSectionDialog } from "./components/edit-section-dialog";

type CourseSectionWithDetails = {
  ma_lop_hp: string;
  ma_hoc_ky: string;
  ma_gv: string;
  ho_ten_gv: string;
  ma_mh: string;
  ten_mh: string;
  ma_phong: string;
  ten_phong: string;
  ma_lich_hoc: string;
  thu: number;
  tiet_bat_dau: number;
  tiet_ket_thuc: number;
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
            query: `SELECT * FROM vw_ds_lop_hoc_phan ORDER BY ma_lop_hp DESC`,
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
      filtered = filtered.filter((s) => s.ma_hoc_ky === selectedSemester);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.ma_lop_hp.toLowerCase().includes(lowercasedQuery) ||
          s.ten_mh.toLowerCase().includes(lowercasedQuery) ||
          s.ho_ten_gv.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredSections(filtered);
  }, [searchQuery, selectedSemester, sections]);

  const onCreate = async (newSection: any, scheduleData: any) => {
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
        // Get the newly created section ID
        const newSectionDB = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `SELECT * FROM lop_hoc_phan WHERE ma_mh = N'${newSection.subjectId}' 
                    AND ma_gv = N'${newSection.lecturerId}' 
                    AND ma_hoc_ky = N'${newSection.semesterId}' 
                    AND ma_phong = N'${scheduleData.classroomId}' `,
          },
        });

        const scheduleResponse = await apiCall({
          endpoint: "/api/query",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `INSERT INTO lich_hoc (ma_lop_hp, thu, tiet_bat_dau, tiet_ket_thuc) 
                     VALUES (N'${newSectionDB?.result?.recordset[0]?.ma_lop_hp}', ${scheduleData.dayOfWeek}, ${scheduleData.startPeriod}, ${scheduleData.endPeriod})`,
          },
        });

        if (scheduleResponse?.success) {
          toast({
            title: "Thêm lớp học phần thành công",
          });
          setReload((prev) => !prev);
          setOpenAddDialog(false);
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
      !editingSection.ma_mh ||
      !editingSection.ma_gv ||
      !editingSection.ma_hoc_ky
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
                   SET ma_mh = N'${editingSection.ma_mh}', ma_gv = N'${editingSection.ma_gv}', 
                       ma_hoc_ky = N'${editingSection.ma_hoc_ky}', ma_phong = N'${editingSection.ma_phong}' 
                   WHERE ma_lop_hp = N'${editingSection.ma_lop_hp}'`,
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
                     WHERE ma_lop_hp = N'${editingSection.ma_lop_hp}'`,
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
          query: `DELETE FROM lich_hoc WHERE ma_lop_hp = N'${deletingSection.ma_lop_hp}'`,
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
            query: `DELETE FROM lop_hoc_phan WHERE ma_lop_hp = N'${deletingSection.ma_lop_hp}'`,
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
                   FROM lich_hoc WHERE ma_lop_hp = N'${section.ma_lop_hp}'`,
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
                <TableHead>Học kỳ</TableHead>
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
                <TableRow key={section.ma_lop_hp}>
                  <TableCell className="font-medium">
                    {section.ma_hoc_ky}
                  </TableCell>
                  <TableCell className="font-medium">
                    {section.ma_lop_hp}
                  </TableCell>
                  <TableCell>
                    {`${section.ten_mh} (${section.ma_mh})`}
                  </TableCell>
                  <TableCell>
                    {`${section.ho_ten_gv} (${section.ma_gv})`}
                  </TableCell>
                  <TableCell>
                    {section.ma_phong} - {section.ten_phong}
                  </TableCell>
                  <TableCell>
                    {`Thứ ${section.thu} - Tiết ${
                      section.tiet_bat_dau === section.tiet_ket_thuc
                        ? section.tiet_bat_dau
                        : `${section.tiet_bat_dau} đến ${section.tiet_ket_thuc}`
                    }`}
                  </TableCell>
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

      {/* Dialog Components */}
      <AddSectionDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        subjects={subjects}
        lecturers={lecturers}
        classrooms={classrooms}
        semesters={semesters}
        loading={loading}
        onSubmit={onCreate}
      />

      <EditSectionDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        editingSection={editingSection as any}
        scheduleData={editScheduleData}
        subjects={subjects}
        lecturers={lecturers}
        classrooms={classrooms}
        semesters={semesters}
        loading={loading}
        onUpdateSection={setEditingSection as any}
        onUpdateSchedule={setEditScheduleData}
        onSubmit={onUpdate}
      />

      <DeleteSectionDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        deletingSection={deletingSection as any}
        loading={loading}
        onConfirm={onDelete}
      />
    </div>
  );
}
