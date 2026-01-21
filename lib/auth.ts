import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { connectDB } from './db';
import { User } from './models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (!account) return false;

      await connectDB();

      try {
        // Check if user exists by email
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Link account if not already linked
          const accountExists = existingUser.accounts.some(
            (acc: any) =>
              acc.provider === account.provider &&
              acc.providerAccountId === account.providerAccountId
          );

          if (!accountExists) {
            existingUser.accounts.push({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });
            await existingUser.save();
          }
        } else {
          // Create new user
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'viewer', // Default role
            accounts: [
              {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            ],
          });
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, trigger }: any) {
      await connectDB();

      if (token.email) {
        const user = await User.findOne({ email: token.email });
        if (user) {
          token.role = user.role;
          token.permissions = user.permissions;
          token.userId = user._id.toString();
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
