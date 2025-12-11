import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          image: user.image,
        }
      },
    }),
    Google({
      clientId: "1050749830300-rnk4l9fqk6b92ka1eo5dc4anlfehddme.apps.googleusercontent.com",
      clientSecret: "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",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (existingUser) {
            if (user.email === "fagunandy@gmail.com") {
              await prisma.user.update({
                where: { email: user.email },
                data: { role: "ADMIN" },
              })
              user.role = "ADMIN"
            } else {
              user.role = existingUser.role
            }
          } else {
            if (user.email === "fagunandy@gmail.com") {
              user.role = "ADMIN"
            } else {
              user.role = "RENTER"
            }
          }
        }
      }
      return true
    },
  },
})

