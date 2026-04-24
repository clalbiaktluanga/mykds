import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import { sortAllClasses } from '@/lib/subjects';

export async function GET() {
  await connectDB();
  const unsortedClasses = await Class.find().sort({ name: 1, section: 1 });
  const classes = sortAllClasses(unsortedClasses);
  return Response.json(classes);
}

export async function POST(req) {
  await connectDB();
  const { name, section, subject, academicYear, tests, terms, enableAttendance } = await req.json();
  if (!name || !subject)
    return Response.json({ error: 'Name and subject required' }, { status: 400 });
  const cls = await Class.create({ 
    name, section, subject, 
    academicYear: academicYear || '2024-25', 
    tests: tests || 5, 
    terms: terms || 3,
    enableAttendance: enableAttendance !== undefined ? enableAttendance : true
  });
  return Response.json(cls, { status: 201 });
}