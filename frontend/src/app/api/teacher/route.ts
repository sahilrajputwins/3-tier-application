// app/api/teacher/route.ts
export async function GET(request: Request) {
  const res = await fetch("http://backend:3500/teacher");
  const data = await res.json();
  return Response.json(data);
}
export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch("http://backend:3500/teacher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
export async function PUT(request: Request) {
  const body = await request.json();
  const res = await fetch("http://backend:3500/teacher", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
export async function DELETE(request: Request) {
  const body = await request.json();
  const res = await fetch("http://backend:3500/teacher", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
export async function PATCH(request: Request) {
  const body = await request.json();
  const res = await fetch("http://backend:3500/teacher", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
