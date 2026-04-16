import { connectDB } from '@/lib/mongodb';
import LoginHistory from '@/models/LoginHistory';
import MarksLog from '@/models/MarksLog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const logins = await LoginHistory.find({ userId: session.user.id })
    .sort({ loginAt: -1 })
    .limit(30)
    .lean();

  const enriched = await Promise.all(logins.map(async (entry, i) => {
    const nextLogin = i > 0 ? logins[i - 1].loginAt : new Date();
    const changes = await MarksLog.countDocuments({
      editedBy: entry.userId,
      editedAt: { $gte: entry.loginAt, $lt: nextLogin },
    });
    return { ...entry, changesCount: changes };
  }));

  return Response.json(enriched);
}