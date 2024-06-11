import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const router = useRouter();
    function sendData(formData: FormData) {
        const query = formData.get("query") as string;
        if (query !== "") {
            router.push(`/products/search?q=${query}`);
            onOpenChange(false);
        }
    }

    const handleBlur = (e: React.FocusEvent) => {
        const currentTarget = e.currentTarget;
        const relatedTarget = e.relatedTarget as HTMLElement | null;

        if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
            setTimeout(
                () => onOpenChange(false),
                150
            ); // Allow user to click on other buttons without being annoying 

        }
    };


    return (
        <div className="h-full flex items-center flex-shrink overflow-clip flex-grow">
            {!isOpen ?
                <Button onPress={() => onOpenChange(true)} className="bg-transparent min-w-0 w-5 h-5 p-0 mr-2"><FaSearch className="text-foreground w-full h-full" /></Button>
                :
                <>
                    <div className="bg-content1 max-w-full h-10 border border-foreground rounded-xl flex-shrink" onBlur={handleBlur}>
                        <form className="flex items-center w-full h-full" action={sendData}>
                            <input name="query" type="text" className="w-32 lg:w-40 2xl:w-48 bg-transparent text-foreground flex-grow min-w-0 ml-2 rounded px-1 focus:outline-none flex-shrink" placeholder="Buscar" autoFocus />
                            <Button type="submit" aria-label="search" className="bg-transparent min-w-5 w-5 h-5 mr-2 p-0"><FaSearch className="text-foreground w-full h-full" /></Button>
                        </form>
                    </div>
                </>
            }
        </div>
    )
}