import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";
import { query } from "faunadb";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        console.log(user.email);
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index("user_by_email"),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(query.Collection("users"), {
              data: { email: user.email },
            }),
            query.Get(
              query.Match(
                query.Index("user_by_email"),
                query.Casefold(user.email)
              )
            )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
