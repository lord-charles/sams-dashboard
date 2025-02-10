import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      userType: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    userType: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/user/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const userData = await res.json();

          // Transform the response to match the User type
          return {
            id: userData.id,
            username: credentials.username,
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            userType: userData.userType,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/dashboard/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          firstname: token.firstname,
          lastname: token.lastname,
          userType: token.userType,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
