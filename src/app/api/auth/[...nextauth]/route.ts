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

  // 📊 Настройки сессии (КРИТИЧЕСКИ ВАЖНО!)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  // 🍪 Настройки cookies (ДОБАВИЛИ!)
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // ← false для localhost (http)
      }
    }
  },

  // 📄 Кастомные страницы
  pages: {
    signIn: "/", // Твоя главная страница
  },

  // 🐛 Debug режим (ДОБАВИЛИ для диагностики)
  debug: true, // ← Покажет подробные логи в консоли

  // 🎨 Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Добавляем userId в токен при логине
      if (user) {
        token.id = user.id;
      }
      // 🔥 КРИТИЧЕСКИ ВАЖНО: Устанавливаем флаг что это credentials
      if (account) {
        token.accessToken = account.access_token;
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
  
  // 🔥 ДОБАВИЛИ: События для дебага
  events: {
    async signIn({ user, account, profile }) {
      console.log("✅ Пользователь вошел:", user.email);
    },
    async signOut({ token }) {
      console.log("🚪 Пользователь вышел");
    },
  },
};

// ⚡ Создаем обработчики для App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };