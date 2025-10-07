import { NextRequest, NextResponse } from 'next/server';

const users: { email: string; password: string }[] = [];

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'Пользователь уже существует' },
                { status: 400 }
            );
        }

        users.push({ email, password });

        return NextResponse.json(
            { message: 'Регистрация успешна!' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}