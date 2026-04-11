import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const user = await User.findOne({
            username: credentials.username.trim().toLowerCase(),
          });

          if (!user) {
            console.log('User not found:', credentials.username);
            return null;
          }

          const valid = await bcrypt.compare(credentials.password, user.password);

          if (!valid) {
            console.log('Wrong password for:', credentials.username);
            return null;
          }

          console.log('Login success:', user.username, user.role);

          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            role: user.role,
          };
        } catch (err) {
          console.error('Auth error:', err.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};