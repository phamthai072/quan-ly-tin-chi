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
  Users,
  Wallet,
} from 'lucide-react';

export type NavMenuItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHeader?: boolean;
  children?: Omit<NavMenuItem, 'children' | 'icon' | 'isHeader'>[];
};

export const navMenuItems: NavMenuItem[] = [
  {
      title: "Hệ thống",
      icon: School,
      isHeader: true,
  },
  {
      title: 'Tổng quan',
      href: '/tong-quan',
      icon: LayoutDashboard,
  },
  {
      title: 'Phân tích',
      href: '/phan-tich/su-dung-phong',
      icon: BarChart3,
  },
  {
      title: 'Khoa',
      href: '/khoa',
      icon: BookCopy,
  },
  {
      title: 'Chuyên ngành',
      href: '/chuyen-nganh',
      icon: BookCopy,
  },
  {
      title: 'Khóa học',
      href: '/khoa-hoc',
      icon: GraduationCap,
  },
  {
      title: 'Môn học',
      href: '/mon-hoc',
      icon: BookCopy,
  },
  {
      title: 'Học kỳ',
      href: '/hoc-ky',
      icon: CalendarClock,
  },
  {
      title: 'Lớp học phần',
      href: '/lop-hoc-phan',
      icon: Presentation,
  },
  {
      title: 'Phòng học',
      href: '/phong-hoc',
      icon: School,
  },
  {
      title: 'Lịch học',
      href: '/lich-hoc',
      icon: CalendarClock,
  },
  {
      title: "Giảng viên",
      icon: BookUser,
      isHeader: true,
  },
  {
      title: 'Danh sách',
      href: '/giang-vien',
      icon: BookUser,
  },
  {
    title: 'Lương giảng viên',
    href: '/luong-giang-vien',
    icon: Wallet,
  },
  {
      title: "Sinh viên",
      icon: Users,
      isHeader: true,
  },
  {
      title: 'Danh sách',
      href: '/sinh-vien',
      icon: Users,

  },
  {
      title: 'Kết quả học tập',
      href: '/ket-qua',
      icon: FileText,
  },
  {
      title: 'Đăng ký tín chỉ',
      href: '/dang-ky-tin-chi',
      icon: BookCopy,
  },
];
