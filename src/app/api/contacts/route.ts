import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - получить все контакты
export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
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

// POST - добавить новый контакт
export async function POST(request: NextRequest) {
    try {
        const { name, phone } = await request.json();
        
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Имя и телефон обязательны' },
                { status: 400 }
            );
        }

        const newContact = await prisma.contact.create({
            data: {
                name,
                phone
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