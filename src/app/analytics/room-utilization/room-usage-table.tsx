"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type RoomUsageTableProps = {
  data: { 
    id: string; 
    name: string; 
    capacity: number; 
    usage: number;
    classCount?: number;
    utilization?: number;
  }[];
};

export default function RoomUsageTable({ data }: RoomUsageTableProps) {
  const sortedData = [...data].sort((a, b) => b.usage - a.usage);
  
  const getUtilizationBadge = (utilization: number) => {
    if (utilization >= 70) {
      return <Badge variant="destructive">Cao ({utilization}%)</Badge>;
    } else if (utilization >= 40) {
      return <Badge variant="default">Trung bình ({utilization}%)</Badge>;
    } else if (utilization > 0) {
      return <Badge variant="secondary">Thấp ({utilization}%)</Badge>;
    } else {
      return <Badge variant="outline">Không sử dụng</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>STT</TableHead>
          <TableHead>Tên phòng</TableHead>
          <TableHead>Sức chứa</TableHead>
          <TableHead className="text-right">Số lớp HP</TableHead>
          <TableHead className="text-right">Số giờ sử dụng</TableHead>
          <TableHead>Tỉ lệ sử dụng</TableHead>
          <TableHead>Mức độ sử dụng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((room, index) => (
          <TableRow key={room.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{room.name}</TableCell>
            <TableCell>{room.capacity} người</TableCell>
            <TableCell className="text-right">
              {room.classCount !== undefined ? room.classCount : "N/A"}
            </TableCell>
            <TableCell className="text-right">{room.usage} giờ</TableCell>
            <TableCell>
              {room.utilization !== undefined ? `${room.utilization}%` : "N/A"}
            </TableCell>
            <TableCell>
              {room.utilization !== undefined 
                ? getUtilizationBadge(room.utilization)
                : <Badge variant="outline">N/A</Badge>
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
