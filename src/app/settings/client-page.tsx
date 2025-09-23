"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SettingItem {
  ten: string;
  gia_tri: string;
}

const editFormSchema = z.object({
  ten: z.string().min(1, "Tên cấu hình không được để trống"),
  gia_tri: z.string().min(1, "Giá trị không được để trống"),
});

type EditFormValues = z.infer<typeof editFormSchema>;

// Mapping để hiển thị tên cấu hình dễ hiểu
const settingDisplayNames: {
  [key: string]: { name: string; description: string; unit?: string };
} = {
  //   GPA_CanhBao: {
  //     name: "Ngưỡng GPA cảnh báo",
  //     description: "Điểm GPA tối thiểu để không bị cảnh báo học vụ",
  //     unit: "điểm",
  //   },

  DiemQuaMon: {
    name: "Điểm qua môn",
    description: "Điểm tối thiểu để xem là đã qua môn",
    unit: "điểm",
  },
  GPA_CanhBao: {
    name: "Ngưỡng GPA cảnh báo",
    description: "Điểm GPA tối thiểu để không bị cảnh báo học vụ",
    unit: "điểm",
  },
  GV_ToiDa_Lop_HK: {
    name: "Giới hạn lớp/GV/Học kỳ",
    description: "Số lớp tối đa một giảng viên được phép dạy trong một học kỳ",
    unit: "lớp",
  },
  GV_ToiThieu_Tiet: {
    name: "Giới hạn tiết/GV/Học kỳ",
    description: "Số tiết tối thiểu một giảng viên phải dạy trong một học kỳ",
    unit: "tiết",
  },
  MonNgoaiNganh_ToiDa: {
    name: "Tối đa môn ngoài ngành",
    description:
      "Số môn tối đa sinh viên được phép đăng ký không thuộc chuyên ngành (không tính môn cơ bản)",
    unit: "môn",
  },
  TinChi_ToiDa_HocKy: {
    name: "Tối đa tín chỉ/Học kỳ",
    description:
      "Số tín chỉ tối đa sinh viên được phép đăng ký trong một học kỳ",
    unit: "tín chỉ",
  },
  TinChiTruot_CanhBao: {
    name: "Ngưỡng tín chỉ trượt cảnh báo",
    description:
      "Số tín chỉ trượt tối đa trong một học kỳ để không bị cảnh báo học vụ",
    unit: "tín chỉ",
  },
};

export function SettingsClientPage() {
  const { apiCall, isLoading } = useApi();
  const [settings, setSettings] = React.useState<SettingItem[]>([]);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedSetting, setSelectedSetting] =
    React.useState<SettingItem | null>(null);

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      ten: "",
      gia_tri: "",
    },
  });

  // Tải dữ liệu cấu hình khi component mount
  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: "SELECT ten, gia_tri FROM cau_hinh ORDER BY ten",
        },
      });

      if (response?.success && response?.result?.recordsets?.[0]) {
        setSettings(response.result.recordsets[0]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu cấu hình:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu cấu hình",
        variant: "destructive",
      });
    }
  };

  const handleEditSetting = (setting: SettingItem) => {
    setSelectedSetting(setting);
    editForm.reset({
      ten: setting.ten,
      gia_tri: setting.gia_tri,
    });
    setEditModalOpen(true);
  };

  const onEditSubmit = async (values: EditFormValues) => {
    try {
      const response = await apiCall({
        endpoint: "/api/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          query: `UPDATE cau_hinh SET gia_tri = N'${values.gia_tri}' WHERE ten = N'${values.ten}'`,
        },
      });

      if (response?.success) {
        toast({
          title: "Thành công",
          description: "Cập nhật cấu hình thành công",
        });
        setEditModalOpen(false);
        setSelectedSetting(null);
        editForm.reset();
        await loadSettings();
      } else {
        throw new Error(response?.error || "Lỗi khi cập nhật cấu hình");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật cấu hình:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật cấu hình",
        variant: "destructive",
      });
    }
  };

  const getDisplayInfo = (settingKey: string) => {
    return (
      settingDisplayNames[settingKey] || {
        name: settingKey,
        description: "Cấu hình hệ thống",
      }
    );
  };

  const formatValue = (value: string, settingKey: string) => {
    const info = getDisplayInfo(settingKey);
    return info.unit ? `${value} ${info.unit}` : value;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid gap-6">
        {/* Bảng cấu hình */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Cấu hình hệ thống</CardTitle>
            <CardDescription>
              Danh sách các thông số cấu hình và ngưỡng của hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên cấu hình</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Giá trị hiện tại</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="text-muted-foreground">
                          Không có dữ liệu cấu hình
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    settings.map((setting) => {
                      const displayInfo = getDisplayInfo(setting.ten);
                      return (
                        <TableRow key={setting.ten}>
                          <TableCell className="font-medium">
                            {displayInfo.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {displayInfo.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {formatValue(setting.gia_tri, setting.ten)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSetting(setting)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog chỉnh sửa cấu hình */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cấu hình</DialogTitle>
            <DialogDescription>
              Cập nhật giá trị cho cấu hình hệ thống
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="ten"
                render={({ field }) => {
                  const displayInfo = getDisplayInfo(field.value);
                  return (
                    <FormItem>
                      <FormLabel>Tên cấu hình</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-muted" />
                      </FormControl>
                      <FormDescription>
                        {displayInfo.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={editForm.control}
                name="gia_tri"
                render={({ field }) => {
                  const displayInfo = getDisplayInfo(editForm.getValues("ten"));
                  return (
                    <FormItem>
                      <FormLabel>
                        Giá trị {displayInfo.unit && `(${displayInfo.unit})`}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập giá trị mới" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
