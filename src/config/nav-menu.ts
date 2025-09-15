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
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Phân tích',
        href: '/analytics/room-utilization',
        icon: BarChart3,
    },
    {
        title: 'Khoa',
        href: '/faculties',
        icon: BookCopy,
    },
    {
        title: 'Chuyên ngành',
        href: '/majors',
        icon: BookCopy,
    },
    {
        title: 'Khóa học',
        href: '/cohorts',
        icon: GraduationCap,
    },
    {
        title: 'Môn học',
        href: '/subjects',
        icon: BookCopy,
    },
    {
        title: 'Học kỳ',
        href: '/semesters',
        icon: CalendarClock,
    },
    {
        title: 'Lớp học phần',
        href: '/course-sections',
        icon: Presentation,
    },
    {
        title: 'Phòng học',
        href: '/classrooms',
        icon: School,
    },
    {
        title: 'Lịch học',
        href: '/schedules',
        icon: CalendarClock,
    },
    {
        title: "Giảng viên",
        icon: BookUser,
        isHeader: true,
    },
    {
        title: 'Danh sách',
        href: '/lecturers',
        icon: BookUser,
    },
    {
      title: 'Lương giảng viên',
      href: '/lecturer-salary',
      icon: Wallet,
    },
    {
        title: "Sinh viên",
        icon: Users,
        isHeader: true,
    },
    {
        title: 'Danh sách',
        href: '/students',
        icon: Users,
  
    },
    {
        title: 'Kết quả học tập',
        href: '/results',
        icon: FileText,
    },
    {
        title: 'Đăng ký tín chỉ',
        href: '/course-registration',
        icon: BookCopy,
    },
  ];