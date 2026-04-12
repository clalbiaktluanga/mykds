import { connectDB } from '@/lib/mongodb';
import MarksLog from '@/models/MarksLog';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const type = searchParams.get('type');
  const index = searchParams.get('index');

  const query = { class: classId };
  if (type) query.type = type;
  if (index) query.index = Number(index);

  const logs = await MarksLog.find(query)
    .sort({ editedAt: -1 })
    .limit(50);

  return Response.json(logs);
}