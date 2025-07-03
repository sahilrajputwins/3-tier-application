'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Delete, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Student {
  id: number;
  name: string;
  roll_number?: string;
  class: string;
}

const StudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', class: '' });
  const [filterClass, setFilterClass] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/student`);
      if (filterClass) url.searchParams.append('class', filterClass);
      url.searchParams.append('sort', sortOrder);

      const res = await fetch(url.toString());
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch students: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNo || !newStudent.class) {
      toast({ variant: 'destructive', title: 'Error', description: 'Fill all student fields.' });
      return;
    }
    setOpen(true);
  };

  const confirmAddStudent = async () => {
    setOpen(false);
    try {
      await fetch(`${API_URL}/addstudent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudent.name,
          roll_number: newStudent.rollNo,
          class: newStudent.class
        })
      });
      toast({ title: 'Success', description: 'Student added successfully.' });
      setNewStudent({ name: '', rollNo: '', class: '' });
      fetchStudents();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed: ${err.message}` });
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await fetch(`${API_URL}/student/${id}`, { method: 'DELETE' });
      toast({ title: 'Success', description: 'Deleted successfully.' });
      fetchStudents();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed: ${err.message}` });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader><CardTitle>Filter & Sort</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Class" value={filterClass} onChange={e => setFilterClass(e.target.value)} />
          <Select value={sortOrder} onValueChange={value => setSortOrder(value as 'asc' | 'desc')}>
            <SelectTrigger><SelectValue placeholder="Sort Order" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchStudents}><Search className="mr-2" /> Apply</Button>
        </CardContent>
      </Card>

      <ul>
        {students.map(s => (
          <li key={s.id} className="border p-2 flex justify-between">
            <span>{s.name} - {s.class}</span>
            <Button variant="destructive" onClick={() => handleDeleteStudent(s.id)}>Delete</Button>
          </li>
        ))}
      </ul>

      <Input placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
      <Input placeholder="Roll Number" value={newStudent.rollNo} onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })} />
      <Input placeholder="Class" value={newStudent.class} onChange={e => setNewStudent({ ...newStudent, class: e.target.value })} />
      <Textarea placeholder="Description" />

      <Button onClick={handleAddStudent}>Add Student</Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Add</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAddStudent}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentPage;
