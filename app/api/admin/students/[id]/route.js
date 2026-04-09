import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const student = await Student.findByIdAndUpdate(params.id, body, { new: true });
  if (!student) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(student);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Student.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}