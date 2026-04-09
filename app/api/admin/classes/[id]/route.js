import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const cls = await Class.findByIdAndUpdate(params.id, body, { new: true });
  if (!cls) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(cls);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Class.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}