"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RoomUsageTableProps = {
  data: { id: string; name: string; capacity: number; usage: number }[];
};

export default function RoomUsageTable({ data }: RoomUsageTableProps) {
    const sortedData = [...data].sort((a, b) => b.usage - a.usage);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên phòng</TableHead>
          <TableHead>Sức chứa</TableHead>
          <TableHead className="text-right">Số giờ sử dụng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((room) => (
          <TableRow key={room.id}>
            <TableCell className="font-medium">{room.name}</TableCell>
            <TableCell>{room.capacity}</TableCell>
            <TableCell className="text-right">{room.usage}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
