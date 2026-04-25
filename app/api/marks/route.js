export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Mark from '@/models/Mark';
import MarksLog from '@/models/MarksLog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Student from '@/models/Student';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const type = searchParams.get('type');
  const marks = await Mark.find({ class: classId, type });
  return Response.json(marks);
}

// Single mark upsert (used for individual cell save)
export async function POST(req) {
  await connectDB();
  const { studentId, classId, type, index, marksObtained } = await req.json();
  const mark = await Mark.findOneAndUpdate(
    { student: studentId, class: classId, type, index },
    { marksObtained },
    { upsert: true, new: true }
  );
  return Response.json(mark);
}

// Bulk save with logging
export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { classId, type, index, entries } = await req.json();
  // entries = [{ studentId, studentName, rollNo, oldValue, newValue }]

  const changes = [];

  for (const entry of entries) {
    if (entry.newValue === entry.oldValue) continue; // skip unchanged

    await Mark.findOneAndUpdate(
      { student: entry.studentId, class: classId, type, index },
      { marksObtained: entry.newValue === '' ? null : Number(entry.newValue) },
      { upsert: true, new: true }
    );

    changes.push({
      studentId: entry.studentId,
      studentName: entry.studentName,
      rollNo: entry.rollNo,
      oldValue: entry.oldValue,
      newValue: entry.newValue === '' ? null : Number(entry.newValue),
    });
  }

  // Only log if something actually changed
  if (changes.length > 0) {
    await MarksLog.create({
      class: classId,
      type,
      index,
      editedBy: session?.user?.id || null,
      editedByName: session?.user?.name || 'Unknown',
      changes,
    });
  }

  return Response.json({ success: true, changesLogged: changes.length });
}