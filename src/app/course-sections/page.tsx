import { mockCourseSections, mockSubjects, mockLecturers, mockSemesters, mockClassrooms } from '@/lib/mock-data';
import { CourseSectionsClientPage } from './client-page';

export default function CourseSectionsPage() {
  const sectionsWithDetails = mockCourseSections.map(section => {
    const subject = mockSubjects.find(s => s.id === section.subjectId);
    const lecturer = mockLecturers.find(l => l.id === section.lecturerId);
    // A bit of a simplification as schedule string would need more complex parsing
    const classroomName = section.schedule.split(',').pop()?.trim() || 'N/A';
    
    return {
      ...section,
      subjectName: subject?.name || 'N/A',
      lecturerName: lecturer?.name || 'N/A',
      classroomName: classroomName,
    };
  });

  return (
    <CourseSectionsClientPage 
      sections={sectionsWithDetails} 
      subjects={mockSubjects}
      lecturers={mockLecturers}
      semesters={mockSemesters}
      classrooms={mockClassrooms}
    />
  );
}
