import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      userType: string;
      // Add any other user properties that your API returns
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    userType: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstname: string;
    lastname: string;
    userType: string;
  }
}
