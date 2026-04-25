export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Setting from '@/models/Settings';

export async function GET() {
  await connectDB();
  const settings = await Setting.find();
  const map = {};
  settings.forEach(s => { map[s.key] = s.value; });
  return Response.json(map);
}

export async function POST(req) {
  await connectDB();
  const { key, value } = await req.json();
  await Setting.findOneAndUpdate(
    { key },
    { key, value, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  return Response.json({ success: true });
}