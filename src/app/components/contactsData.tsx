// Интерфейс для контакта

export interface Contact {
    id: number;
    name: string;
    phone: string;
   
}

// // Временная заглушка - массив контактов
export const contactsData: Contact[] = [
    {
        id: 1,
        name: "John Doe",
        phone: "1234567890",
    },
    {
        id: 2,
        name: "Jane Doe",
        phone: "0987654321",
    },
    {
        id: 3,
        name: "Bob Smith",
        phone: "5551234567",
    },
    {
        id: 4,
        name: "Alice Johnson",
        phone: "9876543210",
    },
    {
        id: 5,
        name: "Charlie Brown",
        phone: "1112223333",
    }
];

// Функции для работы с данными (имитация API)
export const phoneBookAPI = {
    // Получить все контакты
    getAllContacts: (): Contact[] => {
        return contactsData;
    },
    
    // Добавить новый контакт
    addContact: (contact: Omit<Contact, 'id'>): Contact => {
        const newContact: Contact = {
            ...contact,
            id: Math.max(...contactsData.map(c => c.id)) + 1
        };
        contactsData.push(newContact);
        return newContact;
    },
    
    // Удалить контакт по ID
    deleteContact: (id: number): boolean => {
        const index = contactsData.findIndex(c => c.id === id);
        if (index !== -1) {
            contactsData.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Обновить контакт
    updateContact: (id: number, updates: Partial<Contact>): Contact | null => {
        const contact = contactsData.find(c => c.id === id);
        if (contact) {
            Object.assign(contact, updates);
            return contact;
        }
        return null;
    }
};