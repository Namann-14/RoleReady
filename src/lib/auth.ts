import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { ConnectToDatabase } from "./mongodb";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        try {
          await ConnectToDatabase();

          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Wrong email or password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fname + (user.lname ? ` ${user.lname}` : ""),
            image: user.profile_pic || null,
          };
        } catch (error) {
          console.error("Auth error", error);
          throw error;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await ConnectToDatabase();

        // Handle OAuth providers (GitHub/Google)
        if (account?.provider === 'github' || account?.provider === 'google') {
          const email = user.email;
          
          if (!email) {
            console.error("No email provided by OAuth provider");
            return false;
          }

          // Check if user already exists
          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Create new user for OAuth sign-in
            try {
              const newUser = await User.create({
                fname: user.name?.split(' ')[0] || 'User',
                lname: user.name?.split(' ').slice(1).join(' ') || '',
                email: email,
                profile_pic: user.image || null,
                provider: account.provider,
                // Don't set password for OAuth users
                roadmap: [],
                quizzes: [],
                certificates: [],
              });

              console.log(`New ${account.provider} user created:`, newUser.email);
            } catch (createError) {
              console.error("Error creating OAuth user:", createError);
              return false;
            }
          } else {
            // Update existing user's profile picture if it's newer/different
            if (user.image && user.image !== existingUser.profile_pic) {
              await User.findByIdAndUpdate(existingUser._id, {
                profile_pic: user.image,
                // Update name if it's missing or generic
                ...((!existingUser.fname || existingUser.fname === 'User') && user.name && {
                  fname: user.name.split(' ')[0],
                  lname: user.name.split(' ').slice(1).join(' ') || '',
                })
              });
            }
            console.log(`Existing user signed in with ${account.provider}:`, existingUser.email);
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      // Fetch fresh user data from database on each token refresh
      if (token.email) {
        try {
          await ConnectToDatabase();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.fname + (dbUser.lname ? ` ${dbUser.lname}` : "");
            token.email = dbUser.email;
            token.picture = dbUser.profile_pic;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};