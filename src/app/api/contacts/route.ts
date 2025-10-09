import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - получить контакты ТЕКУЩЕГО пользователя
export async function GET(request: NextRequest) {
    try {
        // 🆕 ПРОБЛЕМА: Как узнать КТО делает запрос?
        // Временное решение: берём userId из query параметра
        // Правильное решение: JWT токен или сессии (сделаем позже)
        
        const userId = request.nextUrl.searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Не указан userId' },
                { status: 400 }
            );
        }

        // ✅ Фильтруем контакты по userId!
        const contacts = await prisma.contact.findMany({
            where: {
                userId: parseInt(userId)  // ← Только контакты этого пользователя!
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return NextResponse.json(contacts);
    } catch (error) {
        console.error('Ошибка при получении контактов:', error);
        return NextResponse.json(
            { error: 'Не удалось получить контакты' },
            { status: 500 }
        );
    }
}

// POST - добавить новый контакт для ТЕКУЩЕГО пользователя
export async function POST(request: NextRequest) {
    try {
        const { name, phone, userId } = await request.json();
        
        // 🆕 Проверяем что userId передан
        if (!userId) {
            return NextResponse.json(
                { error: 'userId обязателен' },
                { status: 400 }
            );
        }
        
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Имя и телефон обязательны' },
                { status: 400 }
            );
        }

        // ✅ Создаём контакт со связью к пользователю
        const newContact = await prisma.contact.create({
            data: {
                name,
                phone,
                userId: parseInt(userId)  // ← Привязываем к пользователю!
            }
        });

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error('Ошибка при добавлении контакта:', error);
        return NextResponse.json(
            { error: 'Не удалось добавить контакт' },
            { status: 500 }
        );
    }
}