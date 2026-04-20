import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET() {
  await connectDB();
  const students = await Student.find().sort({ class: 1, section: 1, rollNo: 1 });
  return Response.json(students);
}

export async function POST(req) {
  await connectDB();
  const { rollNo, name, parentName, class: cls, section, academicYear } = await req.json();
  if (!rollNo || !name || !cls)
    return Response.json({ error: 'All fields required' }, { status: 400 });
  const student = await Student.create({
    rollNo, name, parentName, class: cls,
    section: section || 'A',
    academicYear: academicYear || '2026',
  });
  return Response.json(student, { status: 201 });
}