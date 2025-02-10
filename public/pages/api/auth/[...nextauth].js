import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      // name: "Credentials",
      type: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jmunroe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MOBILE_API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        try {
          const user = await res.json();
          if (user?.token) {
            return user;
          } else {
            throw new Error(user.message);
          }
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/authentication",
  },
  session: {
    strategy: "jwt",
    // maxAge: 60 * 60 // 1 Hour
    maxAge: process.env.JWT_EXPIRATION_DURATION * 60, // 15 min
  },
};
export default NextAuth(authOptions);
