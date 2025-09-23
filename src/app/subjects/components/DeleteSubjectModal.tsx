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
import { useApi } from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { type SubjectData } from "./types";

interface DeleteSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: SubjectData | null;
  onSuccess: () => void;
}

export function DeleteSubjectModal({
  open,
  onOpenChange,
  subject,
  onSuccess,
}: DeleteSubjectModalProps) {
  const { apiCall } = useApi();

  const handleDelete = async () => {
    if (!subject) {
      toast({
        title: "Vui lòng chọn môn học để xóa",
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
          query: `DELETE FROM mon_hoc WHERE ma_mh = N'${subject.ma_mh}'`,
        },
      });

      if (response?.success) {
        toast({
          title: "Xóa môn học thành công",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Xóa môn học thất bại",
          description: response?.error || "Lỗi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Xóa môn học thất bại",
        description: "Có lỗi xảy ra khi xóa môn học",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn
            môn học{" "}
            <strong>
              {subject?.ma_mh} - {subject?.ten_mh}
            </strong>{" "}
            khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
