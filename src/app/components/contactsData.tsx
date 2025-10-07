// Интерфейс для контакта
export interface Contact {
    id: number;
    name: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// API для работы с контактами через HTTP запросы
export const phoneBookAPI = {
    // Получить все контакты
    getAllContacts: async (): Promise<Contact[]> => {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) {
                throw new Error('Не удалось получить контакты');
            }
            const contacts = await response.json();
            return contacts;
        } catch (error) {
            console.error('Ошибка при получении контактов:', error);
            return [];
        }
    },
    
    // Добавить новый контакт
    addContact: async (contactData: { name: string; phone: string }): Promise<Contact | null> => {
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                throw new Error('Не удалось добавить контакт');
            }

            const newContact = await response.json();
            return newContact;
        } catch (error) {
            console.error('Ошибка при добавлении контакта:', error);
            return null;
        }
    },
    
    // Удалить контакт по ID
    deleteContact: async (id: number): Promise<boolean> => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
            });

            return response.ok;
        } catch (error) {
            console.error('Ошибка при удалении контакта:', error);
            return false;
        }
    },
    
    // Обновить контакт
    updateContact: async (id: number, updates: { name?: string; phone?: string }): Promise<Contact | null> => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Не удалось обновить контакт');
            }

            const updatedContact = await response.json();
            return updatedContact;
        } catch (error) {
            console.error('Ошибка при обновлении контакта:', error);
            return null;
        }
    }
};