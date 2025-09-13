"use client"


import { useState } from "react";
import { phoneBookAPI, Contact } from "./contactsData";
import EditableInput from "./EditableInput";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function PhoneBook() {

    const [contacts, setContacts] = useState<Contact[]>(phoneBookAPI.getAllContacts());
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newPhone, setNewPhone] = useState<string>("");

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
        // Проверяем, что поля не пустые
        if (newName.trim() === "" || newPhone.trim() === "") {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        // Добавляем контакт с данными из полей ввода
        const result = phoneBookAPI.addContact({
            name: newName,    // Берем из поля ввода
            phone: newPhone   // Берем из поля ввода
        });

        // Обновляем список контактов
        setContacts(phoneBookAPI.getAllContacts());

        // Очищаем поля ввода
        setNewName("");
        setNewPhone("");

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
                </table>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div
                                // onClick={() => setCollapseMode(true)}
                                className="bg-blue-500 text-white px-4 py-2 hover:scale-105 rounded-md mx-2 ">
                                Add
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="mt-5 mb-5 bg-gray-900 w-160 p-12 border border-gray-400">
                                <div className="flex flex-row ">
                                    <div>
                                        <div className="mb-5"> <span className="mr-14"> Введите имя</span>
                                            <input type="text" className="px-2 py-1 bg-zinc-200 w-52 text-black" placeholder="Name"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)} />
                                        </div>
                                        <div> <span className="mr-7">Введите телефон</span>
                                            <input type="text" className="px-2 py-1 bg-zinc-200 w-52 text-black" placeholder="Phone"
                                                value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)} />
                                        </div>
                                    </div>
                                    <button
                                        className="bg-amber-900 text-white px-4 py-2 rounded-md mx-2 ml-20 w-20 hover:scale-105 "
                                        onClick={addContactHandler}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


            </div>

        </div>
    );
};