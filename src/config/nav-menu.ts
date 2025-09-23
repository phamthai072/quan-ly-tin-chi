import {
  BarChart3,
  BookCopy,
  BookUser,
  CalendarClock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Presentation,
  School,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export type NavMenuItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHeader?: boolean;
  children?: Omit<NavMenuItem, "children" | "icon" | "isHeader">[];
};

export const navMenuItems: NavMenuItem[] = [
  {
    title: "Hệ thống",
    icon: School,
    isHeader: true,
  },
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cài đặt chung",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Khoa - Ok",
    href: "/faculties",
    icon: BookCopy,
  },
  {
    title: "Chuyên ngành - Ok",
    href: "/majors",
    icon: BookCopy,
  },
  {
    title: "Khóa học - Ok",
    href: "/cohorts",
    icon: GraduationCap,
  },
  {
    title: "Môn học - Ok",
    href: "/subjects",
    icon: BookCopy,
  },
  {
    title: "Học kỳ - Ok",
    href: "/semesters",
    icon: CalendarClock,
  },
  {
    title: "Lớp học phần - Ok",
    href: "/course-sections",
    icon: Presentation,
  },
  {
    title: "Phòng học - Ok",
    href: "/classrooms",
    icon: School,
  },
  {
    title: "Thống kê Phòng học - Ok",
    href: "/analytics/room-utilization",
    icon: BarChart3,
  },
  {
    title: "Xem lịch học - Ok",
    href: "/schedules",
    icon: CalendarClock,
  },

  // ------------------------------------
  {
    title: "Giảng viên",
    icon: BookUser,
    isHeader: true,
  },
  {
    title: "Danh sách GV - Ok",
    href: "/lecturers",
    icon: BookUser,
  },
  {
    title: "Lương giảng viên - Ok",
    href: "/lecturer-salary",
    icon: Wallet,
  },
  // ------------------------------------
  {
    title: "Sinh viên",
    icon: Users,
    isHeader: true,
  },
  {
    title: "Danh sách SV - Ok",
    href: "/students",
    icon: Users,
  },
  {
    title: "Thống kê điểm - Ok",
    href: "/results",
    icon: FileText,
  },
  {
    title: "Điểm môn học - Ok",
    href: "/subjects-scores",
    icon: FileText,
  },
  {
    title: "Đăng ký tín chỉ - Ok",
    href: "/course-registration",
    icon: BookCopy,
  },
];
