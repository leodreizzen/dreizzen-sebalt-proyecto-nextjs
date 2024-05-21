import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    function sendData(formData: FormData) {
        const query = formData.get("query") as string;
        if (query !== "") {
            router.push(`/products/search?q=${query}`);
            setIsOpen(false);
        }
    }

    const handleBlur = (e: React.FocusEvent) => {
        const currentTarget = e.currentTarget;
        const relatedTarget = e.relatedTarget as HTMLElement | null;

        if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
            setIsOpen(false);
        }
    };


    return (
        <div>
            {!isOpen ?
                <Button onPress={() => setIsOpen(true)} className="bg-transparent min-w-0 w-10 h-10 p-0"><FaSearch className="text-foreground w-auto h-auto" /></Button>
                :
                <div className="bg-content1 w-40 h-10 border border-foreground rounded-xl" onBlur={handleBlur}>
                    <form className="flex items-center w-full h-full" action={sendData}>
                        <input name="query" type="text" className="bg-transparent text-foreground flex-grow min-w-0 ml-2 rounded px-1 focus:outline-none" placeholder="Buscar" autoFocus />
                        <Button type="submit" className="bg-transparent min-w-0 w-10 h-10 mr-2 p-0"><FaSearch className="text-foreground w-auto h-auto" /></Button>
                    </form>
                </div>
            }
        </div>
    )
}