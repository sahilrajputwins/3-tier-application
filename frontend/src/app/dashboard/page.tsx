'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Home} from 'lucide-react';
import Link from 'next/link';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {Skeleton} from "@/components/ui/skeleton";

interface Person {
  id: number;
  name: string;
  roll_number?: string;
  class: string;
  subject?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example colors

const DashboardPage = () => {
  const [students, setStudents] = useState<Person[]>([]);
  const [teachers, setTeachers] = useState<Person[]>([]);
  const [classData, setClassData] = useState<{ class: string; count: number }[]>([]);
  const [recentStudents, setRecentStudents] = useState<Person[]>([]);
  const [recentTeachers, setRecentTeachers] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const studentsResponse = await fetch('http://backend:3500/student');
      const teachersResponse = await fetch('http://backend:3500/teacher');

      if (!studentsResponse.ok || !teachersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const studentsData = await studentsResponse.json();
      const teachersData = await teachersResponse.json();

      setStudents(studentsData);
      setTeachers(teachersData);

      // Process class data for chart
      const classCounts: { [key: string]: number } = {};
      studentsData.forEach((student: Person) => {
        classCounts[student.class] = (classCounts[student.class] || 0) + 1;
      });

      const classDataFormatted = Object.keys(classCounts).map(classKey => ({
        class: classKey,
        count: classCounts[classKey],
      }));
      setClassData(classDataFormatted);

      // Get recent additions
      setRecentStudents(studentsData.slice(-5));
      setRecentTeachers(teachersData.slice(-5));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
        <Link href="/" className="flex items-center text-muted-foreground hover:text-primary">
          <Home className="mr-2 h-4 w-4"/>
          Home
        </Link>
      </div>

      {error && (
        <div className="text-red-500 mb-4">Error: {error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-16"/>
            ) : (
              <p className="text-2xl font-bold">{students?.length}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-16"/>
            ) : (
              <p className="text-2xl font-bold">{teachers?.length}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Number of Students in Each Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {classData?.length > 0 ? (
                <PieChart>
                  <Pie
                    data={classData}
                    dataKey="count"
                    nameKey="class"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {
                      classData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))
                    }
                  </Pie>
                  <Tooltip/>
                </PieChart>
              ) : (
                <p>No class data available.</p>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-4 w-full"/>
            ) : (
              <ul>
                {recentStudents?.map(student => (
                  <li key={student.id} className="py-2 border-b last:border-none">
                    {student.name} (Class: {student.class})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-4 w-full"/>
            ) : (
              <ul>
                {recentTeachers?.map(teacher => (
                  <li key={teacher.id} className="py-2 border-b last:border-none">
                    {teacher.name} (Subject: {teacher.subject}, Class: {teacher.class})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
