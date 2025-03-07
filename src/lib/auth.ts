import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { apiClient } from '@/lib/api/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data.data;

          if (data.token) {
            return {
              id: data.id.toString(),
              email: data.email,
              name: `${data.firstName} ${data.lastName}`,
              image: data.avatar,
              accessToken: data.token,
              roles: data.roles,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        if (account.provider === 'google') {
          try {
            const response = await apiClient.post('/auth/google', {
              token: account.id_token,
            });

            const data = response.data.data;

            return {
              ...token,
              accessToken: data.token,
              id: data.id,
              roles: data.roles,
            };
          } catch (error) {
            console.error('Google auth error:', error);
            return token;
          }
        }

        return {
          ...token,
          accessToken: user.accessToken,
          id: user.id,
          roles: user.roles,
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = token.roles as string[];
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
