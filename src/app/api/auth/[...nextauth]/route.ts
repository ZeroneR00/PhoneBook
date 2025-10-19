import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

// 🔐 КОНФИГУРАЦИЯ NextAuth v4
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email и пароль обязательны");
        }

        // Ищем пользователя
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }

        // ✅ Возвращаем пользователя
        return {
          id: user.id.toString(),
          email: user.email,
        };
      }
    }),
  ],

  // 🔑 Секретный ключ
  secret: process.env.NEXTAUTH_SECRET,

  // 📊 Настройки сессии
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  // 📄 Кастомные страницы
  pages: {
    signIn: "/", // Твоя главная страница
  },

  // 🎨 Callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Добавляем userId в токен при логине
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем userId в сессию
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// ⚡ Создаем обработчики для App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };