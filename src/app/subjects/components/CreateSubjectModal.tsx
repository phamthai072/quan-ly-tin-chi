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
import { customSelectStyles, type MajorData, type OptionType } from "./types";

interface CreateSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  majors: MajorData[];
  prerequisiteOptions: OptionType[];
  onSuccess: () => void;
}

export function CreateSubjectModal({
  open,
  onOpenChange,
  majors,
  prerequisiteOptions,
  onSuccess,
}: CreateSubjectModalProps) {
  const { apiCall } = useApi();

  const [subjectId, setSubjectId] = React.useState("");
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectCredits, setSubjectCredits] = React.useState<number | "">("");
  const [subjectMajor, setSubjectMajor] = React.useState("");
  const [subjectType, setSubjectType] = React.useState("");
  const [prerequisites, setPrerequisites] = React.useState<string[]>([]);

  const resetForm = () => {
    setSubjectId("");
    setSubjectName("");
    setSubjectCredits("");
    setSubjectMajor("");
    setSubjectType("");
    setPrerequisites([]);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleCreate = async () => {
    // validate
    if (
      !subjectName ||
      subjectCredits === "" ||
      !subjectMajor ||
      !subjectType
    ) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
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
          query: `INSERT INTO mon_hoc (ten_mh, so_tin_chi, ma_chuyen_nganh, loai) 
                   VALUES (N'${subjectName?.trim()}', ${subjectCredits}, N'${subjectMajor}', N'${subjectType}')`,
        },
      });

      if (response?.success) {
        // get ma_mh of the newly created subject
        const newSubject = await apiCall({
          endpoint: `/api/query`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            query: `SELECT ma_mh FROM mon_hoc WHERE ten_mh = N'${subjectName?.trim()}' AND so_tin_chi = ${subjectCredits} AND ma_chuyen_nganh = N'${subjectMajor}' AND loai = N'${subjectType}'`,
          },
        });

        // Thêm môn tiên quyết nếu có
        if (prerequisites.length > 0) {
          const prerequisiteQueries = prerequisites
            .map(
              (prerequisiteId) =>
                `INSERT INTO mon_tien_quyet (ma_mh, ma_mh_tien_quyet) VALUES (N'${newSubject?.result?.recordset[0]?.ma_mh}', N'${prerequisiteId}')`
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
              "Error adding prerequisites:",
              prerequisiteResponse?.error
            );
            toast({
              title:
                "Thêm môn học thành công nhưng có lỗi khi thêm môn tiên quyết",
              description: prerequisiteResponse?.error || "Lỗi hệ thống",
            });
            onSuccess();
            handleClose(false);
            return;
          }
        }

        toast({
          title: "Thêm môn học thành công",
        });
        onSuccess();
        handleClose(false);
      } else {
        toast({
          title: "Thêm môn học thất bại",
          description: response?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Thêm môn học thất bại",
        description: "Có lỗi xảy ra khi thêm môn học",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value?.toUpperCase())}
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
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
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
              value={subjectCredits}
              onChange={(e) =>
                setSubjectCredits(
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
            <Select value={subjectMajor} onValueChange={setSubjectMajor}>
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
            <Label htmlFor="subject-type" className="text-right">
              Loại môn học
            </Label>
            <Select value={subjectType} onValueChange={setSubjectType}>
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
                  console.log(`selectedOptions:`, selectedOptions);
                  setPrerequisites(
                    selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : []
                  );
                }}
                options={prerequisiteOptions.filter(
                  (option) => option.value !== subjectId?.toUpperCase()?.trim()
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
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCreate}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
