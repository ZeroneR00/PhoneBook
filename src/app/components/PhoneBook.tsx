"use client"


import { useState } from "react";
import { phoneBookAPI, Contact } from "./contactsData";
import EditableInput from "./EditableInput";


export default function PhoneBook() {

    const [contacts, setContacts] = useState<Contact[]>(phoneBookAPI.getAllContacts());
    const [editingId, setEditingId] = useState<number | null>(null);

    const editNameContactHandler = (id: number, newName: string) => {
        phoneBookAPI.updateContact(id, { name: newName });
        setContacts(phoneBookAPI.getAllContacts());
    }

    const editNumContactHandler = (id: number, newPhone: string) => {
        phoneBookAPI.updateContact(id, { phone: newPhone });
        setContacts(phoneBookAPI.getAllContacts());
    }

    const deleteIdHandler = (id: number) => {
        phoneBookAPI.deleteContact(id);
        setContacts(phoneBookAPI.getAllContacts());
    }

    const startEdit = (id: number) => {
        setEditingId(id)
        console.log('Редактирование началось для ID: ' + id);
    }

    const stopEdit = () => {
        setEditingId(null);
    };

    //новый кондакт обрабочкик
    const addContactHandler = () => {
        // Шаг 1: Вызываем API функцию для добавления контакта
        const result = phoneBookAPI.addContact({
            name: "New User",    // Пока захардкодим
            phone: "1234567890"  // Пока захардкодим
        });

        // Шаг 2: Обновляем состояние (самое важное!)
        setContacts(phoneBookAPI.getAllContacts());

        // Шаг 3: Опционально - покажем в консоли что добавилось
        console.log("Добавлен контакт:", result);
    };


    return (
        <div>
            <div className="flex flex-col w-full text-left border-collapse w-[80%]">
                <h1 className="text-2xl font-bold">Phone Book</h1>
                <table className="flex flex-col w-full text-left border-collapse w-[80%]">
                    <thead className="px-4 py-2">
                        <tr className="border-b border-gray-300">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <EditableInput
                                key={contact.id}
                                contact={contact}
                                editingId={editingId}
                                onStartEdit={startEdit}
                                onStopEdit={stopEdit}
                                onEditName={editNameContactHandler}
                                onEditPhone={editNumContactHandler}
                                onDeleteId={deleteIdHandler}
                            />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="text-center p-4">
                                <button onClick={addContactHandler}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">Add</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
};