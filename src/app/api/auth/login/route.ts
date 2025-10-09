import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

// 🔥 УДАЛИЛИ МАССИВ!
// const users: { email: string; password: string }[] = [];  ← БЫЛО

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 1️⃣ Ищем пользователя по email в базе данных
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 2️⃣ Если пользователь не найден - ошибка
        if (!user) {
            return NextResponse.json(
                { error: 'Неверный email или пароль' },
                { status: 401 }
            );
        }

        // 3️⃣ Проверяем пароль с помощью bcrypt.compare
        // Сравниваем введенный пароль с хешем из базы
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // ❓ КАК ЭТО РАБОТАЕТ?
        // bcrypt.compare("123456", "$2b$10$abcd1234...") 
        // ↑ bcrypt хеширует "123456" снова и сравнивает с хешем из БД
        // Если совпадает - true, иначе - false

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Неверный email или пароль' },
                { status: 401 }
            );
        }

        // 4️⃣ Успех! Пользователь найден и пароль верный
        // TODO: Здесь позже добавим JWT токен или сессию
        // Пока просто возвращаем данные пользователя
        return NextResponse.json(
            { 
                message: 'Вход выполнен!', 
                user: { 
                    id: user.id, 
                    email: user.email 
                    // ← Пароль НЕ отправляем!
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Ошибка входа:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}