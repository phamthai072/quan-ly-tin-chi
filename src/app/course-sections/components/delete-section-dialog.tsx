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
import { CourseSectionWithDetails } from "../client-page";

type DeleteSectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingSection: CourseSectionWithDetails | null;
  loading: boolean;
  onConfirm: () => void;
};

export function DeleteSectionDialog({
  open,
  onOpenChange,
  deletingSection,
  loading,
  onConfirm,
}: DeleteSectionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn
            lớp học phần "{deletingSection?.ma_lop_hp}" khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xóa..." : "Tiếp tục"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
