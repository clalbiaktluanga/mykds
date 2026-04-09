import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';

export async function GET() {
  await connectDB();
  const classes = await Class.find().sort({ name: 1, section: 1 });
  return Response.json(classes);
}

export async function POST(req) {
  await connectDB();
  const { name, section, subject, academicYear } = await req.json();
  if (!name || !subject)
    return Response.json({ error: 'Name and subject required' }, { status: 400 });
  const cls = await Class.create({ name, section, subject, academicYear: academicYear || '2024-25' });
  return Response.json(cls, { status: 201 });
}