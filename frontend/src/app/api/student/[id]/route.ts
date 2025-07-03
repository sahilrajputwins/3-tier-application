import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://172.17.201.170:3500';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const res = await fetch(`${BACKEND_URL}/student/${id}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch student' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const res = await fetch(`${BACKEND_URL}/student/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete student' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
