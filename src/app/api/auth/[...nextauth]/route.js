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

        console.log(data)

        if (data.token) {

          return {
            token: data.token
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {

      console.log(user)

      if (token) {
       
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        console.log(token)
        session = {
          token: token.token,
          expires: new Date(token.exp * 1000).toISOString()
        }
      }
      return session;
    }

  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };