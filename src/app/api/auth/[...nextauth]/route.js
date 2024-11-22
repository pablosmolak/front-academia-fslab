import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, account }) {
      
      let link
      if (account) {
        token.provider = account.provider;

        if (account.provider === "github") {
          token.githubAccessToken = account.access_token;
          link = "/login/github"
        }


        const response = await fetch(`${process.env.API_URL}${link}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token
          }),
        });



      }
      return token;

    },

  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };


