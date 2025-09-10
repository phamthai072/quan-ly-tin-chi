'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Student } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

type StudentRankingTableProps = {
  students: Student[];
};

export default function StudentRankingTable({
  students,
}: StudentRankingTableProps) {
  const sortedStudents = [...students]
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 10); // Show top 10

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hạng</TableHead>
          <TableHead>Mã SV</TableHead>
          <TableHead>Họ và tên</TableHead>
          <TableHead>Lớp</TableHead>
          <TableHead className="text-right">GPA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStudents.map((student, index) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{student.id}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.class}</TableCell>
            <TableCell className="text-right">
              <Badge variant={student.gpa > 3.6 ? "default" : "secondary"} className={student.gpa > 3.6 ? "bg-green-600" : ""}>{student.gpa.toFixed(2)}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
