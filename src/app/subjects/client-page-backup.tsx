"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { useRenderCount } from "@/hooks/useRenderCount";
import { type Lecturer, type Subject } from "@/lib/mock-data";
import { 
  CreateSubjectModal, 
  EditSubjectModal, 
  DeleteSubjectModal,
  type OptionType,
  type SubjectData,
  type MajorData
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
  const [selectedSubject, setSelectedSubject] = React.useState<SubjectData | null>(null);

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
    } else {
      toast({
        title: "Xóa môn học thất bại",
        description: response?.error || "Lỗi hệ thống",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Môn học</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setDialog((m) => !m);
          }}
        >
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
                            onClick={async () => {
                              setEditingSubject(subject);
                              await loadCurrentPrerequisites(subject.ma_mh);
                              setDialog1(true);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingSubject(subject);
                              setDialog2(true);
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

          {/* Thêm môn học mới */}
          <Dialog
            open={dialog}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog(m);
                setNewSubjectId("");
                setNewSubjectName("");
                setNewSubjectCredits("");
                setNewSubjectMajor("");
                setNewSubjectType("");
                setNewSubjectPrerequisites([]);
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm môn học mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của môn học.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-id" className="text-right">
                    Mã môn học
                  </Label>
                  <Input
                    required
                    id="subject-id"
                    value={newSubjectId}
                    onChange={(e) =>
                      setNewSubjectId(e.target.value?.toUpperCase())
                    }
                    className="col-span-3"
                    placeholder="VD: CNTT101"
                  />
                </div> */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-name" className="text-right">
                    Tên môn học
                  </Label>
                  <Input
                    id="subject-name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="col-span-3"
                    placeholder="VD: Lập trình căn bản"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-credits" className="text-right">
                    Số tín chỉ
                  </Label>
                  <Input
                    id="subject-credits"
                    type="number"
                    value={newSubjectCredits}
                    onChange={(e) =>
                      setNewSubjectCredits(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3"
                    placeholder="3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-major" className="text-right">
                    Chuyên ngành
                  </Label>
                  <Select
                    value={newSubjectMajor}
                    onValueChange={setNewSubjectMajor}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn chuyên ngành" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major: any) => (
                        <SelectItem
                          key={major.ma_chuyen_nganh}
                          value={major.ma_chuyen_nganh}
                        >
                          {major.ten_chuyen_nganh} ({major.ten_khoa})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject-type" className="text-right">
                    Loại môn học
                  </Label>
                  <Select
                    value={newSubjectType}
                    onValueChange={setNewSubjectType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cơ bản">Cơ bản</SelectItem>
                      <SelectItem value="chuyên ngành">Chuyên ngành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Môn tiên quyết</Label>
                  <div className="col-span-3">
                    <ReactSelect
                      isMulti
                      value={prerequisiteOptions.filter((option) =>
                        newSubjectPrerequisites.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        setNewSubjectPrerequisites(
                          selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : []
                        );
                      }}
                      options={prerequisiteOptions.filter(
                        (option) =>
                          option.value !== newSubjectId?.toUpperCase()?.trim()
                      )}
                      placeholder="Chọn môn tiên quyết..."
                      noOptionsMessage={() => "Không có môn học nào"}
                      classNamePrefix="react-select"
                      className="react-select-container z-50"
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onCreate}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sửa thông tin môn học */}
          <Dialog
            open={dialog1}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog1(m);
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Sửa thông tin môn học</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin của môn học.
                </DialogDescription>
              </DialogHeader>

              {editingSubject && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-id-edit" className="text-right">
                      Mã môn học
                    </Label>
                    <Input
                      id="subject-id-edit"
                      disabled
                      value={editingSubject.ma_mh}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-name-edit" className="text-right">
                      Tên môn học
                    </Label>
                    <Input
                      id="subject-name-edit"
                      value={editingSubject.ten_mh}
                      onChange={(e) =>
                        setEditingSubject({
                          ...editingSubject,
                          ten_mh: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subject-credits-edit"
                      className="text-right"
                    >
                      Số tín chỉ
                    </Label>
                    <Input
                      id="subject-credits-edit"
                      type="number"
                      value={editingSubject.so_tin_chi}
                      onChange={(e) =>
                        setEditingSubject({
                          ...editingSubject,
                          so_tin_chi: Number(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-major-edit" className="text-right">
                      Chuyên ngành
                    </Label>
                    <Select
                      value={editingSubject.ma_chuyen_nganh}
                      onValueChange={(value) =>
                        setEditingSubject({
                          ...editingSubject,
                          ma_chuyen_nganh: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn chuyên ngành" />
                      </SelectTrigger>
                      <SelectContent>
                        {majors.map((major: any) => (
                          <SelectItem
                            key={major.ma_chuyen_nganh}
                            value={major.ma_chuyen_nganh}
                          >
                            {major.ten_chuyen_nganh} ({major.ten_khoa})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-type-edit" className="text-right">
                      Loại môn học
                    </Label>
                    <Select
                      value={editingSubject.loai}
                      onValueChange={(value) =>
                        setEditingSubject({ ...editingSubject, loai: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn loại môn học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cơ bản">Cơ bản</SelectItem>
                        <SelectItem value="chuyên ngành">
                          Chuyên ngành
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Môn tiên quyết</Label>
                    <div className="col-span-3">
                      <ReactSelect
                        isMulti
                        value={prerequisiteOptions.filter((option) =>
                          editingPrerequisites.includes(option.value)
                        )}
                        onChange={(selectedOptions) => {
                          setEditingPrerequisites(
                            selectedOptions
                              ? selectedOptions.map((option) => option.value)
                              : []
                          );
                        }}
                        options={prerequisiteOptions.filter(
                          (option) => option.value !== editingSubject?.ma_mh
                        )}
                        placeholder="Chọn môn tiên quyết..."
                        noOptionsMessage={() => "Không có môn học nào"}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        styles={customSelectStyles}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  className="disabled:opacity-50"
                  disabled={!editingSubject}
                  type="button"
                  onClick={onUpdate}
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Xóa môn học */}
          <AlertDialog
            open={dialog2}
            onOpenChange={(m) => {
              if (!m) {
                // when off
                setDialog2(m);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể được hoàn tác. Thao tác này sẽ xóa
                  vĩnh viễn môn học khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Tiếp tục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
