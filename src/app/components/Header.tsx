import { useState } from "react";

interface HeaderProps {
    actualLoginForm: (loginForm: boolean) => void;
    loginForm: boolean;
}


export default function Header({ actualLoginForm, loginForm }: HeaderProps) {

    return (
        <div className="flex flex-row justify-between items-center pb-0">
            <h1 className="text-2xl font-bold">Phone Book</h1>
            <div className="flex flex-row justify-between items-center">
                <button className="bg-amber-900 text-white px-4 py-2 rounded-md mx-2" onClick={() => actualLoginForm(!loginForm)}>
                    Login
                </button>
            </div>
        </div>
    );
}  