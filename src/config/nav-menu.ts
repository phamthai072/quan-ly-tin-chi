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
        title: "Quản trị viên",
        isHeader: true,
    },
    {
        title: 'Tổng quan',
        href: '/dashboard',
        icon: LayoutDashboard,
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
        {
            title: 'Học kỳ',
            href: '/semesters',
        },
        ],
    },
    {
        title: 'Lớp & Lịch',
        icon: Presentation,
        children: [
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
        title: 'Người dùng',
        icon: Users,
        children: [
            {
                title: 'Sinh viên',
                href: '/students',
            },
            {
                title: 'Giảng viên',
                href: '/lecturers',
            },
        ]
    },
    {
        title: 'Kết quả',
        href: '/results',
        icon: FileText,
    },
    {
        title: 'Sử dụng phòng',
        href: '/analytics/room-utilization',
        icon: BarChart3,
    },
    {
        title: "Giảng viên",
        isHeader: true,
    },
    {
        title: 'Bảng điều khiển',
        href: '/dashboard', // Should be a lecturer-specific dashboard
        icon: LayoutDashboard,
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
        title: 'Sinh viên của tôi',
        href: '/students', // Students in their classes
        icon: Users,
    },
    {
        title: 'Chấm điểm',
        href: '/results',
        icon: FileText,
    },
    {
        title: "Sinh viên",
        isHeader: true,
    },
    {
        title: 'Bảng điều khiển',
        href: '/dashboard', // Should be a student-specific dashboard
        icon: LayoutDashboard,
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
