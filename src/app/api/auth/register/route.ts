// import { NextRequest, NextResponse } from 'next/server';

// const users: { email: string; password: string }[] = [];

// export async function POST(req: NextRequest) {
//     try {
//         const { email, password } = await req.json();

//         const existingUser = users.find(user => user.email === email);
//         if (existingUser) {
//             return NextResponse.json(
//                 { error: 'Пользователь уже существует' },
//                 { status: 400 }
//             );
//         }

//         users.push({ email, password });

//         return NextResponse.json(
//             { message: 'Регистрация успешна!' },
//             { status: 201 }
//         );
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Ошибка сервера' },
//             { status: 500 }
//         );
//     }
// }



import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';  // ← Импортируем Prisma (как в contacts)
import bcrypt from 'bcrypt';  // ← Для хеширования паролей

// 🔥 УДАЛИЛИ МАССИВ! Теперь все в БД
// const users: { email: string; password: string }[] = [];  ← БЫЛО

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 1️⃣ Проверяем: есть ли уже такой email в базе?
        // prisma.user.findUnique - ищет ОДНОГО пользователя по уникальному полю
        const existingUser = await prisma.user.findUnique({
            where: { email }  // ← "where email = тот_что_пришел"
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Пользователь с таким email уже существует' },
                { status: 400 }
            );
        }

        // 2️⃣ Хешируем пароль (10 - это "соленость", чем больше - тем безопаснее, но медленнее)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // ❓ ЧТО ТАКОЕ ХЕШ?
        // Пароль "123456" → хеш "$2b$10$abcd1234..." (необратимо!)
        // Даже если хакер украдет базу, он не узнает пароль

        // 3️⃣ Создаем пользователя в базе данных
        // prisma.user.create - добавляет новую запись в таблицу users
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword  // ← Сохраняем ХЕШ, а не оригинальный пароль!
            }
        });

        // 4️⃣ Возвращаем успех (БЕЗ пароля!)
        return NextResponse.json(
            { 
                message: 'Регистрация успешна!',
                user: { 
                    id: newUser.id, 
                    email: newUser.email 
                    // ← Пароль НЕ отправляем клиенту!
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}