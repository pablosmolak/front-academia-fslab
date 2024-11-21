import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  pages:{
    signIn: '/'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn Callback Response:", { user, account, profile, email });
      return true; // Permite o login
    },
    async session({ session, token, user }) {
      console.log("Session Callback Response:", { session, token, user });
      return session; // Retorna a sessão
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT Callback Response:", { token, user, account, profile, isNewUser });
      return token; // Retorna o token
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };


