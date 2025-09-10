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
import { type Major, type Faculty } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function MajorsClientPage({ majors, faculties }: { majors: Major[], faculties: Faculty[] }) {
  
  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || facultyId;
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Chuyên ngành</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm chuyên ngành
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm chuyên ngành mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của chuyên ngành.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="major-id" className="text-right">Mã chuyên ngành</Label>
                <Input id="major-id" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="major-name" className="text-right">Tên chuyên ngành</Label>
                <Input id="major-name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="major-faculty" className="text-right">Khoa</Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <div className="flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Tìm kiếm chuyên ngành..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/2 lg:w-1/3"
            />
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã chuyên ngành</TableHead>
                <TableHead>Tên chuyên ngành</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {majors.map((major) => (
                <TableRow key={major.id}>
                  <TableCell className="font-medium">{major.id}</TableCell>
                  <TableCell>{major.name}</TableCell>
                  <TableCell>{getFacultyName(major.facultyId)}</TableCell>
                  <TableCell>
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
                          <DropdownMenuItem>Sửa</DropdownMenuItem>
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
                            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn chuyên ngành khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction>Tiếp tục</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
