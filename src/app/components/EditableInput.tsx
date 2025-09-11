import { useState } from "react";
import { Contact } from "./contactsData";


interface EditableInputProps {
    contact: Contact;
    editingId: number | null;
    onStartEdit: (id: number) => void;
    onStopEdit: () => void;
    onEditName: (id: number, newName: string) => void;
    onEditPhone: (id: number, newPhone: string) => void;
    onDeleteId: (id: number) => void;

}

export default function EditableInput({
    contact,
    editingId,
    onStartEdit,
    onStopEdit,
    onEditName,
    onEditPhone,
    onDeleteId
}: EditableInputProps) {

    const isEditing = editingId === contact.id;

    const [tempName, setTempName] = useState(contact.name);
    const [tempPhone, setTempPhone] = useState(contact.phone);

    const valueSlave = () => {
        if (tempName !== contact.name) (
            onEditName(contact.id, tempName)
        )
        if (tempPhone !== contact.phone) (
            onEditPhone(contact.id, tempPhone)
        )
        onStopEdit();
    }

    const handleStartEdit = () => {
        setTempName(contact.name);
        setTempPhone(contact.phone);
        onStartEdit(contact.id);
    }

    return (

        <tr key={contact.id} className="border-b border-gray-300">
            {isEditing ?
                <>
                    <td className="px-4 py-2 w-64 ">
                        <input type="text" className="px-2 py-1 bg-zinc-800 w-52"
                            placeholder={tempName}
                            value={tempName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)} />
                    </td>
                    <td className="px-4 py-2 w-64 ">
                        <input type="text" className="px-2 py-1 bg-zinc-800 w-52"
                            placeholder={tempPhone}
                            value={tempPhone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempPhone(e.target.value)} />
                    </td>
                    <td className="px-4 py-2">{contact.id}</td>
                    <td className="px-4 py-2 ">
                        <button
                            className="bg-amber-300 text-white px-4 py-2 rounded-md mx-2 w-20 "
                            onClick={valueSlave}>
                            Save
                        </button>
                        <button
                            className="bg-amber-900 text-white px-4 py-2 rounded-md mx-2 w-20 "
                            onClick={onStopEdit}>
                            Cancel
                        </button>
                    </td>
                </>
                :
                <>
                    <td className="px-4 py-2 w-64 ">{contact.name}</td>
                    <td className="px-4 py-2 w-64 ">{contact.phone}</td>
                    <td className="px-4 py-2">{contact.id}</td>
                    <td className="px-4 py-2">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md mx-2 w-20"
                            onClick={handleStartEdit}>
                            Edit
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md mx-2"
                            onClick={() => onDeleteId(contact.id)}>
                            Delete
                        </button>
                    </td>
                </>
            }
        </tr>
    )
};