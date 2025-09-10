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
        icon: LayoutDashboard,
        children: [
            {
                title: 'Tổng quan',
                href: '/dashboard',
            },
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
            {
                title: 'Sinh viên',
                href: '/students',
            },
            {
                title: 'Giảng viên',
                href: '/lecturers',
            },
            {
                title: 'Kết quả',
                href: '/results',
            },
        ]
    },

    {

        title: "Giảng viên",
        icon: LayoutDashboard,
        children: [
            {
                title: 'Lớp học phần',
                href: '/course-sections', // Filtered to their classes
            },
            {
                title: 'Lịch dạy',
                href: '/schedules', // Filtered to their schedule
            },
        ]
    },

    {
        title: "Sinh viên",
        icon: LayoutDashboard,
        children: [
            {
                title: 'Kết quả học tập',
                href: '/results',
            },
            {
                title: 'Lịch học',
                href: '/schedules',
            },
            {
                title: 'Đăng ký tín chỉ',
                href: '/course-registration',
            },
        ]
    },


];
