import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" }
      },

      async authorize(credentials, req) {
        const response = await fetch(`${process.env.API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: credentials.email,
            senha: credentials.senha
          })
        })

        const data = await response.json();

        if (data?.data[0]?.token) {
          return {
            ...data?.data[0].payload,
            token: data.data[0].token
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/',
    signOut: "/"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        user.tokenExpiration = user.exp
        token = user
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        const isTokenExpired = token?.tokenExpiration && Date.now() > token.tokenExpiration * 1000;

        if (isTokenExpired) {
          return {}
        }

        session.token = token.token
        session.expires = new Date(token.tokenExpiration * 1000).toISOString()
        session.user.id = token.id
      }
      
      return session
    }
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };