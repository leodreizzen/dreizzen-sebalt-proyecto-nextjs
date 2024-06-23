import {fetchFeaturedTags} from "@/lib/data";
import FeaturedTagsForm from "@/ui/admin/featured/tags/FeaturedTagsForm";

export default async function AdminFeaturedTagsPage() {
    const featuredTags = await fetchFeaturedTags()
    const sortedTags = featuredTags.sort((a, b) => a.order - b.order)
    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-large text-center">Featured tags</h1>
            <FeaturedTagsForm featuredTags={sortedTags}/>
        </div>
    )
}