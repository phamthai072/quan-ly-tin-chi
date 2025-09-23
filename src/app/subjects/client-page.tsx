"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { useRenderCount } from "@/hooks/useRenderCount";
import { type Lecturer, type Subject } from "@/lib/mock-data";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import * as React from "react";
import {
  CreateSubjectModal,
  DeleteSubjectModal,
  EditSubjectModal,
  type OptionType,
  type SubjectData,
} from "./components";

export function SubjectsClientPage({
  subjects: initialSubjects,
  majors: initialMajors,
  allSubjects: initialAllSubjects,
  lecturers: initialLecturers,
}: {
  subjects: Subject[];
  majors: any[];
  allSubjects: Subject[];
  lecturers: Lecturer[];
}) {
  const renderCount = useRenderCount();
  const { apiCall, isLoading } = useApi();
  const [reload, setReload] = React.useState(true);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // Data states
  const [subjects, setSubjects] = React.useState(initialSubjects);
  const [majors, setMajors] = React.useState(initialMajors);
  const [allSubjects, setAllSubjects] = React.useState(initialAllSubjects);
  const [lecturers, setLecturers] = React.useState(initialLecturers);
  const [prerequisites, setPrerequisites] = React.useState<{
    [key: string]: string[];
  }>({});
  const [searchQuery, setSearchQuery] = React.useState("");

  // Selected subject for edit/delete
  const [selectedSubject, setSelectedSubject] =
    React.useState<SubjectData | null>(null);

  // Tạo options cho react-select
  const prerequisiteOptions = React.useMemo((): OptionType[] => {
    return allSubjects.map((subject: any) => ({
      value: subject.ma_mh,
      label: `${subject.ma_mh} - ${subject.ten_mh}`,
    }));
  }, [allSubjects]);

  const getMajorName = (majorId: string) => {
    const major = majors.find((m) => m.ma_chuyen_nganh === majorId);
    return major ? `${major.ten_chuyen_nganh} (${major.ten_khoa})` : majorId;
  };

  const loadPrerequisites = async () => {
    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `SELECT mtq.ma_mh, mtq.ma_mh_tien_quyet, mh.ten_mh as ten_mh_tien_quyet
                 FROM mon_tien_quyet mtq 
                 LEFT JOIN mon_hoc mh ON mtq.ma_mh_tien_quyet = mh.ma_mh`,
      },
    });

    if (response?.success) {
      const prerequisiteData = response.result.recordsets[0];
      const prerequisiteMap: { [key: string]: string[] } = {};

      prerequisiteData.forEach((item: any) => {
        if (!prerequisiteMap[item.ma_mh]) {
          prerequisiteMap[item.ma_mh] = [];
        }
        prerequisiteMap[item.ma_mh].push(
          `${item.ma_mh_tien_quyet} - ${item.ten_mh_tien_quyet}`
        );
      });

      setPrerequisites(prerequisiteMap);
    }
  };

  const handleRefresh = async () => {
    setReload((prev) => !prev);
    await loadPrerequisites();
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT mh.*, cn.ten_chuyen_nganh, cn.ma_chuyen_nganh, k.ten_khoa FROM mon_hoc mh 
                   LEFT JOIN chuyen_nganh cn ON mh.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa 
                   WHERE mh.ten_mh LIKE N'%${searchQuery}%' 
                   OR mh.ma_mh LIKE N'%${searchQuery}%' 
                   OR cn.ten_chuyen_nganh LIKE N'%${searchQuery}%'
                   OR k.ten_khoa LIKE N'%${searchQuery}%'
                   OR mh.loai LIKE N'%${searchQuery}%'`,
        },
      });
      if (response?.success) {
        setSubjects(response?.result?.recordsets[0]);
      } else {
        console.error(response.error);
      }
    } else {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT mh.*, cn.ten_chuyen_nganh, k.ten_khoa, k.ma_khoa FROM mon_hoc mh 
                   LEFT JOIN chuyen_nganh cn ON mh.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa
                   ORDER BY mh.ma_mh`,
        },
      });
      if (response?.success) {
        setSubjects(response?.result?.recordsets[0]);
      } else {
        console.error(response.error);
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch subjects
      const subjectsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `SELECT mh.*, cn.ten_chuyen_nganh, k.ten_khoa FROM mon_hoc mh 
                   LEFT JOIN chuyen_nganh cn ON mh.ma_chuyen_nganh = cn.ma_chuyen_nganh 
                   LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa
                   ORDER BY mh.ma_mh`,
        },
      });

      // Fetch majors (chuyen_nganh) with faculty info
      const majorsResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query:
            "SELECT cn.*, k.ten_khoa FROM chuyen_nganh cn LEFT JOIN khoa k ON cn.ma_khoa = k.ma_khoa ORDER BY k.ten_khoa, cn.ten_chuyen_nganh",
        },
      });

      // Fetch lecturers
      const lecturersResponse = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT * FROM giang_vien",
        },
      });

      if (subjectsResponse?.success) {
        setSubjects(subjectsResponse?.result?.recordsets[0]);
        setAllSubjects(subjectsResponse?.result?.recordsets[0]);
      } else {
        console.error(subjectsResponse.error);
      }

      if (majorsResponse?.success) {
        setMajors(majorsResponse?.result?.recordsets[0]);
      } else {
        console.error(majorsResponse.error);
      }

      if (lecturersResponse?.success) {
        setLecturers(lecturersResponse?.result?.recordsets[0]);
      } else {
        console.error(lecturersResponse.error);
      }

      // Load prerequisites after loading subjects
      await loadPrerequisites();
    };

    fetchData();
  }, [reload]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Môn học</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm môn học
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <TableHead>Số tín chỉ</TableHead>
                <TableHead>Chuyên ngành - Khoa</TableHead>
                <TableHead>Loại môn</TableHead>
                <TableHead>Môn tiên quyết</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : subjects?.length > 0 ? (
                subjects.map((subject: any) => (
                  <TableRow key={subject.ma_mh}>
                    <TableCell className="font-medium">
                      {subject.ma_mh}
                    </TableCell>
                    <TableCell>{subject.ten_mh}</TableCell>
                    <TableCell>{subject.so_tin_chi}</TableCell>
                    <TableCell>
                      {subject.ten_chuyen_nganh
                        ? `${subject.ten_chuyen_nganh} - ${subject.ten_khoa}`
                        : getMajorName(subject.ma_chuyen_nganh)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subject.loai === "chuyên ngành"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subject.loai}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {prerequisites[subject.ma_mh] &&
                        prerequisites[subject.ma_mh].length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {prerequisites[subject.ma_mh].map(
                              (prerequisite, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {prerequisite}
                                </Badge>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Không có
                          </span>
                        )}
                      </div>
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
                              setSelectedSubject(subject);
                              setEditModalOpen(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSubject(subject);
                              setDeleteModalOpen(true);
                            }}
                            className="text-destructive"
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {renderCount < 1 && (
                    <TableCell colSpan={7} className="text-center">
                      Không có dữ liệu
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Components */}
      <CreateSubjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        majors={majors}
        prerequisiteOptions={prerequisiteOptions}
        onSuccess={handleRefresh}
      />

      <EditSubjectModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subject={selectedSubject}
        majors={majors}
        prerequisiteOptions={prerequisiteOptions}
        onSuccess={handleRefresh}
      />

      <DeleteSubjectModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        subject={selectedSubject}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
