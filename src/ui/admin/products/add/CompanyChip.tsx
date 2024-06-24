import {Chip} from "@nextui-org/chip";
import clsx from "clsx";

export default function CompanyChip({className, name, onClose}: {className?: string, name: string, onClose: () => void}){
    return (
        <Chip color="primary" size="sm" onClose={onClose} className={clsx(className, "text-white")}>
            {name}
        </Chip>
    );
}