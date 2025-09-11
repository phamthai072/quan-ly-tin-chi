'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { type Classroom } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function ClassroomsClientPage({ classrooms: initialClassrooms }: { classrooms: Classroom[] }) {
  const [classrooms, setClassrooms] = React.useState(initialClassrooms);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newClassroomId, setNewClassroomId] = React.useState('');
  const [newClassroomName, setNewClassroomName] = React.useState('');
  const [newClassroomCapacity, setNewClassroomCapacity] = React.useState<number | ''>('');

  const [editingClassroom, setEditingClassroom] = React.useState<Classroom | null>(null);


  const handleSearch = () => {
    const filteredClassrooms = initialClassrooms.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setClassrooms(filteredClassrooms);
  };
  
  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng học</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng học
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm phòng học mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của phòng học.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-id" className="text-right">Mã phòng</Label>
                <Input id="classroom-id" value={newClassroomId} onChange={(e) => setNewClassroomId(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-name" className="text-right">Tên phòng</Label>
                <Input id="classroom-name" value={newClassroomName} onChange={(e) => setNewClassroomName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-capacity" className="text-right">Sức chứa</Label>
                <Input id="classroom-capacity" type="number" value={newClassroomCapacity} onChange={(e) => setNewClassroomCapacity(e.target.value === '' ? '' : Number(e.target.value))} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <div className="flex items-center gap-2">
          <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="search"
              placeholder="Tìm kiếm phòng học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-[280px]"
              />
          </div>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phòng</TableHead>
                <TableHead>Tên phòng</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">{classroom.id}</TableCell>
                  <TableCell>{classroom.name}</TableCell>
                  <TableCell>{classroom.capacity}</TableCell>
                  <TableCell>
                    <Dialog>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onClick={() => setEditingClassroom(classroom)}>Sửa</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive">
                                Xóa
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn phòng học khỏi hệ thống.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction>Tiếp tục</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                       <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Sửa thông tin phòng học</DialogTitle>
                          <DialogDescription>
                            Thay đổi thông tin của phòng học.
                          </DialogDescription>
                        </DialogHeader>
                        {editingClassroom && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="classroom-id-edit" className="text-right">Mã phòng</Label>
                            <Input id="classroom-id-edit" value={editingClassroom.id} readOnly className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="classroom-name-edit" className="text-right">Tên phòng</Label>
                            <Input id="classroom-name-edit" value={editingClassroom.name} onChange={(e) => setEditingClassroom({...editingClassroom, name: e.target.value})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="classroom-capacity-edit" className="text-right">Sức chứa</Label>
                            <Input id="classroom-capacity-edit" type="number" value={editingClassroom.capacity} onChange={(e) => setEditingClassroom({...editingClassroom, capacity: Number(e.target.value)})} className="col-span-3" />
                          </div>
                        </div>
                        )}
                        <DialogFooter>
                          <Button type="submit">Lưu thay đổi</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
