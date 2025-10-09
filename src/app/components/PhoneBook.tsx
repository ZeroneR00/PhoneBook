"use client"

import { useState, useEffect } from "react";
import { phoneBookAPI, Contact } from "./contactsData";
import EditableInput from "./EditableInput";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PhoneBook() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newPhone, setNewPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [loginForm, actualLoginForm] = useState<boolean>(false);

    // 🆕 ВАЖНО: Храним информацию о залогиненном пользователе!
    const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [isLoginMode, setIsLoginMode] = useState<boolean>(true); // true = вход, false = регистрация
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");



    // Загружаем контакты только если пользователь залогинен
    useEffect(() => {
        if (isLoggedIn && currentUser) {
            loadContacts();
        }
    }, [isLoggedIn, currentUser]);

    const loadContacts = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            // 🆕 Передаём userId!
            const contactsList = await phoneBookAPI.getAllContacts(currentUser.id);
            setContacts(contactsList);
        } catch (error) {
            console.error("Ошибка загрузки контактов:", error);
        } finally {
            setLoading(false);
        }
    };

    const editNameContactHandler = async (id: number, newName: string) => {
        if (!currentUser) return;
        
        try {
            // 🆕 Передаём userId!
            await phoneBookAPI.updateContact(id, { name: newName }, currentUser.id);
            await loadContacts();
        } catch (error) {
            console.error("Ошибка обновления имени:", error);
        }
    };

    const editNumContactHandler = async (id: number, newPhone: string) => {
        if (!currentUser) return;
        
        try {
            // 🆕 Передаём userId!
            await phoneBookAPI.updateContact(id, { phone: newPhone }, currentUser.id);
            await loadContacts();
        } catch (error) {
            console.error("Ошибка обновления телефона:", error);
        }
    };

    const deleteIdHandler = async (id: number) => {
        if (!currentUser) return;
        
        try {
            // 🆕 Передаём userId!
            const success = await phoneBookAPI.deleteContact(id, currentUser.id);
            if (success) {
                await loadContacts();
            } else {
                alert("Не удалось удалить контакт");
            }
        } catch (error) {
            console.error("Ошибка удаления контакта:", error);
        }
    };

    const startEdit = (id: number) => {
        setEditingId(id);
        console.log('Редактирование началось для ID: ' + id);
    };

    const stopEdit = () => {
        setEditingId(null);
    };

    // Обработчик добавления нового контакта
    const addContactHandler = async () => {
        if (!currentUser) {
            alert("Сначала войдите в систему!");
            return;
        }
        
        if (newName.trim() === "" || newPhone.trim() === "") {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        try {
            // 🆕 Передаём userId!
            const result = await phoneBookAPI.addContact({
                name: newName,
                phone: newPhone,
                userId: currentUser.id  // ← Привязываем к текущему пользователю
            });

            if (result) {
                await loadContacts();
                setNewName("");
                setNewPhone("");
            } else {
                alert("Не удалось добавить контакт");
            }
        } catch (error) {
            console.error("Ошибка добавления контакта:", error);
            alert("Произошла ошибка при добавлении контакта");
        }
    };

    const handleRegister = async () => {
        setAuthError("");

        if (!email || !password || !confirmPassword) {
            setAuthError("Заполните все поля!");
            return;
        }

        if (password !== confirmPassword) {
            setAuthError("Пароли не совпадают!");
            return;
        }

        if (password.length < 6) {
            setAuthError("Пароль должен быть минимум 6 символов!");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Регистрация успешна! Теперь войдите.");
                setIsLoginMode(true);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } else {
                setAuthError(data.error || "Ошибка регистрации");
            }
        } catch (error) {
            setAuthError("Ошибка соединения с сервером");
            console.error(error);
        }
    };

    // Функция для входа
   // 🆕 ВАЖНО: При успешном логине сохраняем данные пользователя!
   const handleLogin = async () => {
    setAuthError("");

    if (!email || !password) {
        setAuthError("Заполните все поля!");
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 🆕 Сохраняем пользователя в state!
            setCurrentUser(data.user);
            setIsLoggedIn(true);
            actualLoginForm(false);
            alert(`Добро пожаловать, ${data.user.email}!`);
        } else {
            setAuthError(data.error || "Неверный email или пароль");
        }
    } catch (error) {
        setAuthError("Ошибка соединения с сервером");
        console.error(error);
    }
};

    // Переключение между входом и регистрацией
    const toggleAuthMode = () => {
        setIsLoginMode(!isLoginMode);
        setAuthError("");
        setConfirmPassword("");
    };

    // 🆕 Если не залогинен - показываем форму входа
    if (!isLoggedIn) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Пожалуйста, войдите в систему</div>
                <div></div>
                <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>
                                {isLoginMode ? "Вход в аккаунт" : "Регистрация"}
                            </CardTitle>
                            <CardDescription>
                                {isLoginMode
                                    ? "Введите email и пароль для входа"
                                    : "Создайте новый аккаунт"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {!isLoginMode && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                {authError && (
                                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                        {authError}
                                    </div>
                                )}

                                <Button
                                    onClick={isLoginMode ? handleLogin : handleRegister}
                                    className="w-full"
                                >
                                    {isLoginMode ? "Войти" : "Зарегистрироваться"}
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2">
                            <Button
                                variant="link"
                                onClick={toggleAuthMode}
                                className="w-full"
                            >
                                {isLoginMode
                                    ? "Нет аккаунта? Зарегистрируйтесь"
                                    : "Уже есть аккаунт? Войдите"}
                            </Button>

                            {isLoginMode && (
                                <Button variant="outline" className="w-full">
                                    Войти через Google
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center p-4">Загрузка контактов...</div>;
    }

    return (
        <div>

            <div className="flex flex-col w-full text-left border-collapse w-[80%]">

                <table className="flex flex-col w-full text-left border-collapse w-[80%]">
                    <thead className="px-4 py-2">
                        <tr className="border-b border-gray-300">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                                    Контактов пока нет. Добавьте первый!
                                </td>
                            </tr>
                        ) : (
                            contacts.map((contact) => (
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
                            ))
                        )}
                    </tbody>
                </table>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="bg-blue-500 text-white px-4 py-2 hover:scale-105 rounded-md mx-2">
                                Add Contact
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="mt-5 mb-5 bg-gray-900 w-160 p-12 border border-gray-400">
                                <div className="flex flex-row">
                                    <div>
                                        <div className="mb-5">
                                            <span className="mr-14">Введите имя</span>
                                            <input
                                                type="text"
                                                className="px-2 py-1 bg-zinc-200 w-52 text-black"
                                                placeholder="Name"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <span className="mr-7">Введите телефон</span>
                                            <input
                                                type="text"
                                                className="px-2 py-1 bg-zinc-200 w-52 text-black"
                                                placeholder="Phone"
                                                value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="bg-amber-900 text-white px-4 py-2 rounded-md mx-2 ml-20 w-20 hover:scale-105"
                                        onClick={addContactHandler}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {loginForm && <div className="flex justify-center items-center mt-10">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>
                                {isLoginMode ? "Вход в аккаунт" : "Регистрация"}
                            </CardTitle>
                            <CardDescription>
                                {isLoginMode
                                    ? "Введите email и пароль для входа"
                                    : "Создайте новый аккаунт"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {!isLoginMode && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                {authError && (
                                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                        {authError}
                                    </div>
                                )}

                                <Button
                                    onClick={isLoginMode ? handleLogin : handleRegister}
                                    className="w-full"
                                >
                                    {isLoginMode ? "Войти" : "Зарегистрироваться"}
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2">
                            <Button
                                variant="link"
                                onClick={toggleAuthMode}
                                className="w-full"
                            >
                                {isLoginMode
                                    ? "Нет аккаунта? Зарегистрируйтесь"
                                    : "Уже есть аккаунт? Войдите"}
                            </Button>

                            {isLoginMode && (
                                <Button variant="outline" className="w-full">
                                    Войти через Google
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>}
            </div>
        </div>
    );
}