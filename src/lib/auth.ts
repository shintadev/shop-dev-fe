import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { apiClient } from '@/lib/api/client';

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    id?: string;
    roles?: string[];
  }
  
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      roles?: string[];
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
    roles?: string[];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
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

          // Extract token data from headers
          const token = response.headers.authorization?.replace('Bearer ', '');

          // If no token, cancel authentication
          if (!token) {
            return null;
          }

          // Get user info from token
          const userResponse = await apiClient.get('/app/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = userResponse.data.data;

          if (userData) {
            return {
              id: userData.id.toString(),
              email: userData.email,
              name: `${userData.firstName} ${userData.lastName}`,
              image: userData.avatarUrl,
              accessToken: token,
              roles: userData.roles,
            };
          }
          return null;
        } catch (error) {
          console.error('Lỗi xác thực:', error);
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
      // First login
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
            console.error('Lỗi xác thực Google:', error);
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

      // Return old token if not expired
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
