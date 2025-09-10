export type Student = {
  id: string;
  name: string;
  class: string;
  major: string;
  program: string;
  gpa: number;
  failedCourses: number;
};

export type Lecturer = {
  id: string;
  name: string;
  faculty: string;
  unitPrice: number;
};

export type Faculty = {
  id: string;
  name: string;
};

export type Major = {
  id: string;
  name: string;
  facultyId: string;
}

export type Cohort = {
    id: string;
    name: string;
    startYear: number;
}

export type Classroom = {
    id: string;
    name: string;
    capacity: number;
}

export type Semester = {
    id: string;
    name: string;
    schoolYear: string;
    startDate: Date;
    endDate: Date;
}


export const mockStudents: Student[] = [
  { id: 'B20DCCN001', name: 'Nguyễn Văn An', class: 'D20CNPM1', major: 'Công nghệ phần mềm', program: 'Đại trà', gpa: 3.8, failedCourses: 0 },
  { id: 'B20DCCN002', name: 'Trần Thị Bình', class: 'D20CNPM2', major: 'Công nghệ phần mềm', program: 'Chất lượng cao', gpa: 3.9, failedCourses: 0 },
  { id: 'B20DCAT003', name: 'Lê Văn Cường', class: 'D20ATTT1', major: 'An toàn thông tin', program: 'Đại trà', gpa: 3.5, failedCourses: 1 },
  { id: 'B20DCAT004', name: 'Phạm Thị Dung', class: 'D20ATTT2', major: 'An toàn thông tin', program: 'Đại trà', gpa: 2.5, failedCourses: 2 },
  { id: 'B20DCVT005', name: 'Hoàng Văn Em', class: 'D20VT1', major: 'Viễn thông', program: 'Đại trà', gpa: 1.8, failedCourses: 4 },
  { id: 'B20DCDT006', name: 'Vũ Thị Hằng', class: 'D20DT1', major: 'Điện tử', program: 'Đại trà', gpa: 3.2, failedCourses: 0 },
  { id: 'B20DCMT007', name: 'Đỗ Văn Giang', class: 'D20MM1', major: 'Mạng máy tính', program: 'Chất lượng cao', gpa: 3.7, failedCourses: 0 },
  { id: 'B20DCCN008', name: 'Ngô Thị Hòa', class: 'D20CNPM3', major: 'Công nghệ phần mềm', program: 'Đại trà', gpa: 1.5, failedCourses: 5 },
  { id: 'B20DCAT009', name: 'Lý Văn Khoa', class: 'D20ATTT3', major: 'An toàn thông tin', program: 'Đại trà', gpa: 2.9, failedCourses: 1 },
  { id: 'B20DCVT010', name: 'Bùi Thị Lan', class: 'D20VT2', major: 'Viễn thông', program: 'Đại trà', gpa: 2.2, failedCourses: 3 },
  { id: 'B20DCDT011', name: 'Trịnh Văn Minh', class: 'D20DT2', major: 'Điện tử', program: 'Chất lượng cao', gpa: 4.0, failedCourses: 0 },
  { id: 'B20DCMT012', name: 'Đặng Thị Nga', class: 'D20MM2', major: 'Mạng máy tính', program: 'Đại trà', gpa: 2.8, failedCourses: 2 },
];

export const mockLecturers: Lecturer[] = [
  { id: 'GV001', name: 'Trần Văn A', faculty: 'Công nghệ thông tin', unitPrice: 150000 },
  { id: 'GV002', name: 'Nguyễn Thị B', faculty: 'An toàn thông tin', unitPrice: 175000 },
  { id: 'GV003', name: 'Lê Văn C', faculty: 'Viễn thông', unitPrice: 160000 },
  { id: 'GV004', name: 'Phạm Thị D', faculty: 'Điện tử', unitPrice: 180000 },
];

export const mockFaculties: Faculty[] = [
    { id: 'CNTT', name: 'Công nghệ thông tin' },
    { id: 'ATTT', name: 'An toàn thông tin' },
    { id: 'VT', name: 'Viễn thông' },
    { id: 'DT', name: 'Điện tử' },
    { id: 'KT', name: 'Kinh tế' },
];

export const mockMajors: Major[] = [
    { id: 'CNPM', name: 'Công nghệ phần mềm', facultyId: 'CNTT' },
    { id: 'HTTT', name: 'Hệ thống thông tin', facultyId: 'CNTT' },
    { id: 'KHMT', name: 'Khoa học máy tính', facultyId: 'CNTT' },
    { id: 'ATTT', name: 'An toàn thông tin', facultyId: 'ATTT' },
    { id: 'DTVT', name: 'Điện tử viễn thông', facultyId: 'VT' },
];

export const mockCohorts: Cohort[] = [
    { id: 'D18', name: 'Khóa 2018', startYear: 2018 },
    { id: 'D19', name: 'Khóa 2019', startYear: 2019 },
    { id: 'D20', name: 'Khóa 2020', startYear: 2020 },
    { id: 'D21', name: 'Khóa 2021', startYear: 2021 },
];

export const mockClassrooms: Classroom[] = [
    { id: 'P301A2', name: 'Phòng 301-A2', capacity: 100 },
    { id: 'P302A2', name: 'Phòng 302-A2', capacity: 80 },
    { id: 'P303A2', name: 'Phòng 303-A2', capacity: 120 },
    { id: 'LAB1A3', name: 'Phòng Lab 1-A3', capacity: 50 },
];

export const mockSemesters: Semester[] = [
    { id: 'HK1-2324', name: 'Học kỳ 1', schoolYear: '2023-2024', startDate: new Date('2023-09-05'), endDate: new Date('2024-01-15') },
    { id: 'HK2-2324', name: 'Học kỳ 2', schoolYear: '2023-2024', startDate: new Date('2024-02-01'), endDate: new Date('2024-06-15') },
    { id: 'HK1-2425', name: 'Học kỳ 1', schoolYear: '2024-2025', startDate: new Date('2024-09-05'), endDate: new Date('2025-01-15') },
]

export const mockGpaDistribution = [
    { range: '0 - 1.0', count: 50 },
    { range: '1.0 - 2.0', count: 250 },
    { range: '2.0 - 2.5', count: 800 },
    { range: '2.5 - 3.2', count: 2400 },
    { range: '3.2 - 3.6', count: 1200 },
    { range: '3.6 - 4.0', count: 452 },
];


export const mockRoomUtilization = [
    { id: 'P001', name: 'Phòng 301-A2', capacity: 100, usage: 45 },
    { id: 'P002', name: 'Phòng 302-A2', capacity: 80, usage: 35 },
    { id: 'P003', name: 'Phòng 303-A2', capacity: 120, usage: 55 },
    { id: 'P004', name: 'Phòng 401-A2', capacity: 100, usage: 40 },
    { id: 'P005', name: 'Phòng 402-A2', capacity: 80, usage: 25 },
    { id: 'P006', name: 'Phòng Lab 1-A3', capacity: 50, usage: 60 },
    { id: 'P007', name: 'Phòng Lab 2-A3', capacity: 50, usage: 58 },
];
