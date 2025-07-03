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

interface Teacher {
  id: number;
  name: string;
  roll_number?: string;
  class: string;
}

const TeacherPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', rollNo: '', class: '' });
  const [filterClass, setFilterClass] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/teacher`);
      if (filterClass) url.searchParams.append('class', filterClass);
      url.searchParams.append('sort', sortOrder);

      const res = await fetch(url.toString());
      const data = await res.json();
      setTeachers(data);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch teachers: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.rollNo || !newTeacher.class) {
      toast({ variant: 'destructive', title: 'Error', description: 'Fill all teacher fields.' });
      return;
    }
    setOpen(true);
  };

  const confirmAddTeacher = async () => {
    setOpen(false);
    try {
      await fetch(`${API_URL}/addteacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeacher.name,
          roll_number: newTeacher.rollNo,
          class: newTeacher.class
        })
      });
      toast({ title: 'Success', description: 'Teacher added.' });
      setNewTeacher({ name: '', rollNo: '', class: '' });
      fetchTeachers();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed: ${err.message}` });
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    try {
      await fetch(`${API_URL}/teacher/${id}`, { method: 'DELETE' });
      toast({ title: 'Success', description: 'Deleted successfully.' });
      fetchTeachers();
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
          <Button onClick={fetchTeachers}><Search className="mr-2" /> Apply</Button>
        </CardContent>
      </Card>

      <ul>
        {teachers.map(t => (
          <li key={t.id} className="border p-2 flex justify-between">
            <span>{t.name} - {t.class}</span>
            <Button variant="destructive" onClick={() => handleDeleteTeacher(t.id)}>Delete</Button>
          </li>
        ))}
      </ul>

      <Input placeholder="Name" value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} />
      <Input placeholder="Roll Number" value={newTeacher.rollNo} onChange={e => setNewTeacher({ ...newTeacher, rollNo: e.target.value })} />
      <Input placeholder="Class" value={newTeacher.class} onChange={e => setNewTeacher({ ...newTeacher, class: e.target.value })} />
      <Textarea placeholder="Description" />

      <Button onClick={handleAddTeacher}>Add Teacher</Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Add</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAddTeacher}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherPage;
