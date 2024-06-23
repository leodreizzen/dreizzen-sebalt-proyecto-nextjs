import RemoveCardButton from "@/ui/admin/RemoveCardButton";
import BaseGenreCard, {TagProp} from "@/ui/cards/BaseGenreCard";

export default function AdminFeaturedTagCard({ tag, className, removable, onRemove=()=>{} }: { tag: TagProp, className?: string, removable?: boolean, onRemove?: ()=>void}){
    return (
        <div className="relative">
            {removable && <div className="absolute top-0 right-0 z-10">
                <RemoveCardButton className="mr-3 mt-3 w-10" onPress={onRemove}/>
            </div>}
            <BaseGenreCard genre={tag} isPressable={false} className={className}/>
        </div>
    )
}
