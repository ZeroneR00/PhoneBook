import { Contact } from "./contactsData";


interface EditableInputProps {
    contact: Contact;
    editingId: number | null;
    onStartEdit: (id: number) => void;
    onStopEdit: () => void;
    onEditName: (id: number, newName: string) => void;
    onEditPhone: (id: number, newPhone: string) => void;
}

export default function EditableInput({
    contact,
    editingId,
    onStartEdit,
    onStopEdit,
    onEditName,
    onEditPhone
}: EditableInputProps) {

    const isEditing = editingId === contact.id;

    return (
        <tr key={contact.id} className="border-b border-gray-300">
            {isEditing ?
                <>
                    <td className="px-4 py-2 w-64 ">
                        <input type="text" className="px-2 py-1 bg-zinc-800 w-52" placeholder="Name"  />
                    </td>
                    <td className="px-4 py-2 w-64 ">
                        <input type="text" className="px-2 py-1 bg-zinc-800 w-52" placeholder="Phone" />
                    </td>
                    <td className="px-4 py-2">{contact.id}</td>
                    <td className="px-4 py-2 ">
                        <button
                            className="bg-amber-700 text-white px-4 py-2 rounded-md mx-2 w-20 "
                            onClick={onStopEdit}>
                            Save
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
                            onClick={() => onStartEdit(contact.id)}>
                            Edit
                        </button>
                    </td>
                </>
            }
        </tr>
    )
};