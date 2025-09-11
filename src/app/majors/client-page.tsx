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

export function MajorsClientPage({ majors: initialMajors, faculties }: { majors: Major[], faculties: Faculty[] }) {
  const [majors, setMajors] = React.useState(initialMajors);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newMajorId, setNewMajorId] = React.useState('');
  const [newMajorName, setNewMajorName] = React.useState('');
  const [newMajorFaculty, setNewMajorFaculty] = React.useState('');
  
  const [editingMajor, setEditingMajor] = React.useState<Major | null>(null);

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || facultyId;
  }

  const handleSearch = () => {
    const filteredMajors = initialMajors.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getFacultyName(m.facultyId).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setMajors(filteredMajors);
  };

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
                <Input id="major-id" value={newMajorId} onChange={e => setNewMajorId(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="major-name" className="text-right">Tên chuyên ngành</Label>
                <Input id="major-name" value={newMajorName} onChange={e => setNewMajorName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="major-faculty" className="text-right">Khoa</Label>
                 <Select value={newMajorFaculty} onValueChange={setNewMajorFaculty}>
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

       <div className="flex items-center gap-2">
          <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="search"
              placeholder="Tìm kiếm chuyên ngành..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
                              <DropdownMenuItem onClick={() => setEditingMajor(major)}>Sửa</DropdownMenuItem>
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
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn chuyên ngành khỏi hệ thống.
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
                          <DialogTitle>Sửa thông tin chuyên ngành</DialogTitle>
                          <DialogDescription>
                           Thay đổi thông tin chi tiết của chuyên ngành.
                          </DialogDescription>
                        </DialogHeader>
                        {editingMajor && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="major-id-edit" className="text-right">Mã chuyên ngành</Label>
                            <Input id="major-id-edit" value={editingMajor.id} readOnly className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="major-name-edit" className="text-right">Tên chuyên ngành</Label>
                            <Input id="major-name-edit" value={editingMajor.name} onChange={e => setEditingMajor({...editingMajor, name: e.target.value})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="major-faculty-edit" className="text-right">Khoa</Label>
                            <Select value={editingMajor.facultyId} onValueChange={value => setEditingMajor({...editingMajor, facultyId: value})}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn khoa" />
                              </SelectTrigger>
                              <SelectContent>
                                {faculties.map(faculty => <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
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
