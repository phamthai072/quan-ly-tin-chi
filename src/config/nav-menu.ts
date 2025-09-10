import {
  BarChart3,
  Book,
  BookMarked,
  Calendar,
  CalendarDays,
  Contact,
  DoorOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Network,
  Presentation,
  Users,
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
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý',
    isHeader: true,
  },
  {
    title: 'Sinh viên',
    href: '/students',
    icon: GraduationCap,
  },
  {
    title: 'Giảng viên',
    href: '/lecturers',
    icon: Contact,
  },
  {
    title: 'Học tập',
    icon: Book,
    children: [
      {
        title: 'Khoa',
        href: '/faculties',
      },
      {
        title: 'Chuyên ngành',
        href: '/majors',
      },
      {
        title: 'Khóa học',
        href: '/cohorts',
      },
      {
        title: 'Môn học',
        href: '/subjects',
      },
      {
        title: 'Môn tiên quyết',
        href: '/prerequisites',
      },
    ],
  },
  {
    title: 'Lớp & Lịch',
    icon: Presentation,
    children: [
      {
        title: 'Học kỳ',
        href: '/semesters',
      },
      {
        title: 'Lớp học phần',
        href: '/course-sections',
      },
      {
        title: 'Phòng học',
        href: '/classrooms',
      },
      {
        title: 'Lịch học',
        href: '/schedules',
      },
    ],
  },
  {
    title: 'Kết quả',
    href: '/results',
    icon: FileText,
  },
  {
    title: 'Phân tích',
    isHeader: true,
  },
  {
    title: 'Sử dụng phòng',
    href: '/analytics/room-utilization',
    icon: BarChart3,
  },
];
