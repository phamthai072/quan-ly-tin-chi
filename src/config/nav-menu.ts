import {
  BarChart3,
  Book,
  BookCopy,
  BookUser,
  CalendarCheck2,
  CalendarClock,
  Contact,
  DoorOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Presentation,
  School,
  Users,
} from 'lucide-react';

export type NavMenuItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHeader?: boolean;
  children?: Omit<NavMenuItem, 'children' | 'icon' | 'isHeader'>[];
};

const adminNavMenuItems: NavMenuItem[] = [
  {
    title: 'Hệ thống',
    isHeader: true,
  },
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
    icon: School,
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

const lecturerNavMenuItems: NavMenuItem[] = [
  {
    title: 'Tổng quan',
    href: '/dashboard', // Should be a lecturer-specific dashboard
    icon: LayoutDashboard,
  },
  {
    title: 'Giảng dạy',
    isHeader: true,
  },
  {
    title: 'Lớp học phần',
    href: '/course-sections', // Filtered to their classes
    icon: Presentation,
  },
  {
    title: 'Lịch dạy',
    href: '/schedules', // Filtered to their schedule
    icon: CalendarClock,
  },
  {
    title: 'Sinh viên',
    href: '/students', // Students in their classes
    icon: Users,
  },
  {
    title: 'Chấm điểm',
    href: '/results',
    icon: FileText,
  },
];

const studentNavMenuItems: NavMenuItem[] = [
    {
        title: 'Tổng quan',
        href: '/dashboard', // Should be a student-specific dashboard
        icon: LayoutDashboard,
    },
    {
        title: 'Học tập',
        isHeader: true,
    },
    {
        title: 'Kết quả học tập',
        href: '/results',
        icon: GraduationCap,
    },
    {
        title: 'Lịch học',
        href: '/schedules',
        icon: CalendarClock,
    },
    {
        title: 'Đăng ký tín chỉ',
        href: '/course-registration',
        icon: BookCopy,
    },
    {
        title: 'Chương trình khung',
        href: '/program-details',
        icon: BookUser,
    }
];

// In a real app, you would have logic to determine the user's role
// and export the appropriate menu item array.
// For now, we'll just export the admin menu.
export const navMenuItems: NavMenuItem[] = adminNavMenuItems;

// You could also export all menus and decide which to render in the component
export { adminNavMenuItems, lecturerNavMenuItems, studentNavMenuItems };
