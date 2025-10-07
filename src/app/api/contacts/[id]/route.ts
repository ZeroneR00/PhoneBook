import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT - обновить контакт
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const updates = await request.json();

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

// DELETE - удалить контакт
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

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