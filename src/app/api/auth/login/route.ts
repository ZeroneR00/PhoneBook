import { NextRequest, NextResponse } from 'next/server';

const users: { email: string; password: string }[] = [];

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { error: 'Неверный email или пароль' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: 'Вход выполнен!', user: { email: user.email } },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}