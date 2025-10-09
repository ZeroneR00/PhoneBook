import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT - обновить контакт (только свой!)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { userId, ...updates } = await request.json();
        
        // 🆕 БЕЗОПАСНОСТЬ: Проверяем что контакт принадлежит этому пользователю
        if (userId) {
            const contact = await prisma.contact.findUnique({
                where: { id }
            });
            
            if (!contact) {
                return NextResponse.json(
                    { error: 'Контакт не найден' },
                    { status: 404 }
                );
            }
            
            // ✅ Проверка владельца
            if (contact.userId !== parseInt(userId)) {
                return NextResponse.json(
                    { error: 'Нет доступа к этому контакту' },
                    { status: 403 }
                );
            }
        }

        const updatedContact = await prisma.contact.update({
            where: { id },
            data: updates
        });

        return NextResponse.json(updatedContact);
    } catch (error) {
        console.error('Ошибка при обновлении контакта:', error);
        return NextResponse.json(
            { error: 'Не удалось обновить контакт' },
            { status: 500 }
        );
    }
}

// DELETE - удалить контакт (только свой!)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const userId = request.nextUrl.searchParams.get('userId');
        
        // 🆕 БЕЗОПАСНОСТЬ: Проверяем что контакт принадлежит этому пользователю
        if (userId) {
            const contact = await prisma.contact.findUnique({
                where: { id }
            });
            
            if (!contact) {
                return NextResponse.json(
                    { error: 'Контакт не найден' },
                    { status: 404 }
                );
            }
            
            // ✅ Проверка владельца
            if (contact.userId !== parseInt(userId)) {
                return NextResponse.json(
                    { error: 'Нет доступа к этому контакту' },
                    { status: 403 }
                );
            }
        }

        await prisma.contact.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении контакта:', error);
        return NextResponse.json(
            { error: 'Не удалось удалить контакт' },
            { status: 500 }
        );
    }
}