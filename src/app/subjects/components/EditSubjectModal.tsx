"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import * as React from "react";
import ReactSelect from "react-select";
import "./react-select-modal.css";
import {
  customSelectStyles,
  type MajorData,
  type OptionType,
  type SubjectData,
} from "./types";

interface EditSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: SubjectData | null;
  majors: MajorData[];
  prerequisiteOptions: OptionType[];
  onSuccess: () => void;
}

export function EditSubjectModal({
  open,
  onOpenChange,
  subject,
  majors,
  prerequisiteOptions,
  onSuccess,
}: EditSubjectModalProps) {
  const { apiCall } = useApi();

  const [editingSubject, setEditingSubject] =
    React.useState<SubjectData | null>(null);
  const [prerequisites, setPrerequisites] = React.useState<string[]>([]);

  // Load current prerequisites when opening modal
  const loadCurrentPrerequisites = async (subjectId: string) => {
    const response = await apiCall({
      endpoint: `/api/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: `SELECT ma_mh_tien_quyet FROM mon_tien_quyet WHERE ma_mh = N'${subjectId}'`,
      },
    });

    if (response?.success) {
      const currentPrerequisites = response.result.recordsets[0].map(
        (item: any) => item.ma_mh_tien_quyet
      );
      setPrerequisites(currentPrerequisites);
    } else {
      setPrerequisites([]);
    }
  };

  React.useEffect(() => {
    if (subject && open) {
      setEditingSubject({ ...subject });
      loadCurrentPrerequisites(subject.ma_mh);
    }
  }, [subject, open]);

  const handleUpdate = async () => {
    if (!editingSubject) {
      toast({
        title: "Chưa có thay đổi",
      });
      return;
    }

    try {
      const response = await apiCall({
        endpoint: `/api/query`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `UPDATE mon_hoc 
                   SET ten_mh = N'${editingSubject.ten_mh}', so_tin_chi = ${editingSubject.so_tin_chi}, ma_chuyen_nganh = N'${editingSubject.ma_chuyen_nganh}', loai = N'${editingSubject.loai}' 
                   WHERE ma_mh = N'${editingSubject.ma_mh}'`,
        },
      });

      if (response?.success) {
        // Cập nhật môn tiên quyết: xóa tất cả rồi thêm lại
        const deleteResponse = await apiCall({
          endpoint: `/api/query`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `DELETE FROM mon_tien_quyet WHERE ma_mh = N'${editingSubject.ma_mh}'`,
          },
        });

        if (deleteResponse?.success) {
          // Thêm lại các môn tiên quyết mới
          if (prerequisites.length > 0) {
            const prerequisiteQueries = prerequisites
              .map(
                (prerequisiteId) =>
                  `INSERT INTO mon_tien_quyet (ma_mh, ma_mh_tien_quyet) VALUES (N'${editingSubject.ma_mh}', N'${prerequisiteId}')`
              )
              .join("; ");

            const prerequisiteResponse = await apiCall({
              endpoint: `/api/query`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: {
                query: prerequisiteQueries,
              },
            });

            if (!prerequisiteResponse?.success) {
              console.error(
                "Error updating prerequisites:",
                prerequisiteResponse?.error
              );
              toast({
                title:
                  "Cập nhật môn học thành công nhưng có lỗi khi cập nhật môn tiên quyết",
                description: prerequisiteResponse?.error || "Lỗi hệ thống",
              });
              onSuccess();
              onOpenChange(false);
              return;
            }
          }
        } else {
          console.error(
            "Error deleting old prerequisites:",
            deleteResponse?.error
          );
        }

        toast({
          title: "Cập nhật môn học thành công",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Cập nhật môn học thất bại",
          description: response?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Cập nhật môn học thất bại",
        description: "Có lỗi xảy ra khi cập nhật môn học",
      });
    }
  };

  if (!editingSubject) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sửa thông tin môn học</DialogTitle>
          <DialogDescription>Thay đổi thông tin của môn học.</DialogDescription>
        </DialogHeader>
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
            <Label htmlFor="subject-credits-edit" className="text-right">
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
                {majors.map((major) => (
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
                  prerequisites.includes(option.value)
                )}
                onChange={(selectedOptions) => {
                  setPrerequisites(
                    selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : []
                  );
                }}
                options={prerequisiteOptions.filter(
                  (option) => option.value !== subject?.ma_mh
                )}
                placeholder="Chọn môn tiên quyết..."
                noOptionsMessage={() => "Không có môn học nào"}
                classNamePrefix="react-select"
                className="react-select-container"
                styles={{
                  ...customSelectStyles,
                  menu: (base: any) => ({
                    ...base,
                    zIndex: 10000,
                    position: "absolute",
                  }),
                  menuList: (base: any) => ({
                    ...base,
                    maxHeight: "200px",
                  }),
                }}
                menuShouldScrollIntoView={false}
                menuPlacement="auto"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="disabled:opacity-50"
            disabled={!editingSubject}
            type="button"
            onClick={handleUpdate}
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
