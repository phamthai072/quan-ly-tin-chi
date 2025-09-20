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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Classroom,
  type Lecturer,
  type Semester,
  type Subject,
} from "@/lib/mock-data";
import { CourseSectionWithDetails } from "../client-page";

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

type ScheduleData = {
  dayOfWeek: string;
  startPeriod: string;
  endPeriod: string;
  classroomId: string;
};

type EditSectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSection: CourseSectionWithDetails | null;
  scheduleData: ScheduleData;
  subjects: Subject[];
  lecturers: Lecturer[];
  classrooms: Classroom[];
  semesters: Semester[];
  loading: boolean;
  onUpdateSection: (section: CourseSectionWithDetails) => void;
  onUpdateSchedule: (schedule: ScheduleData) => void;
  onSubmit: () => void;
};

export function EditSectionDialog({
  open,
  onOpenChange,
  editingSection,
  scheduleData,
  subjects,
  lecturers,
  classrooms,
  semesters,
  loading,
  onUpdateSection,
  onUpdateSchedule,
  onSubmit,
}: EditSectionDialogProps) {
  if (!editingSection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Sửa thông tin lớp học phần</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin của lớp học phần.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject-edit" className="text-right">
              Môn học
            </Label>
            <Select
              value={editingSection.ma_mh}
              onValueChange={(val) =>
                onUpdateSection({
                  ...editingSection,
                  ma_mh: val,
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
              value={editingSection.ma_gv}
              onValueChange={(val) =>
                onUpdateSection({
                  ...editingSection,
                  ma_gv: val,
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
              value={editingSection.ma_hoc_ky}
              onValueChange={(val) =>
                onUpdateSection({
                  ...editingSection,
                  ma_hoc_ky: val,
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
                    value={scheduleData.dayOfWeek}
                    onValueChange={(val) =>
                      onUpdateSchedule({
                        ...scheduleData,
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
                    value={scheduleData.startPeriod}
                    onValueChange={(val) =>
                      onUpdateSchedule({
                        ...scheduleData,
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
                    value={scheduleData.endPeriod}
                    onValueChange={(val) =>
                      onUpdateSchedule({
                        ...scheduleData,
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
            <Label htmlFor="classroom-edit" className="text-right">
              Phòng học
            </Label>
            <Select
              value={scheduleData.classroomId}
              onValueChange={(val) =>
                onUpdateSchedule({
                  ...scheduleData,
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
        <DialogFooter>
          <Button type="submit" onClick={onSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
