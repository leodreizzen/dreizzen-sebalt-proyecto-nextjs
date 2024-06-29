"use client"
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import '@leodreizzen/react-awesome-button/dist/styles.css';
import AwesomeButtonStyles from '../buttonProgress.module.scss';
import {useToast} from "@/ui/shadcn/use-toast";
import SortableList from "@/ui/admin/featured/SortableList";
import {itemsDifferCheckOrder} from "@/ui/admin/featured/utils";
import AdminFeaturedTagCard from "@/ui/admin/featured/tags/AdminFeaturedTagCard";
import AddFeaturedTagModal from "@/ui/admin/featured/tags/AddFeaturedTagModal";
import {MAX_FEATURED_TAGS} from "@/lib/config";
import {saveFeaturedTagsClient, TagAndImage} from "@/lib/clientActions";
import {FeaturedTagWithTagAndImage} from "@/lib/definitions";

interface TagAndImageWithID extends TagAndImage {
    id: number
}

export default function FeaturedTagsForm({className, featuredTags: savedFeaturedTags}: {
    featuredTags: FeaturedTagWithTagAndImage[],
    className?: string
}) {
    const savedFeaturedTagsWithId: (TagAndImage & {id: number, image: {isNew: false}})[] = savedFeaturedTags.map(t=>({...t, id:t.tag.id, image: {...t.image, isNew: false}}))
    const [tags, setTags] = useState<TagAndImageWithID[]>(savedFeaturedTagsWithId)
    const [previousSavedFeaturedProducts, setPreviousSavedFeaturedProducts] = useState<TagAndImageWithID[]>(savedFeaturedTagsWithId)
    const [modalOpen, setModalOpen] = useState(false);
    const [changed, setChanged] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        setChanged(itemsDifferCheckOrder(savedFeaturedTagsWithId, tags))
    }, [tags, savedFeaturedTagsWithId]);

    useEffect(() => {
        if (itemsDifferCheckOrder(savedFeaturedTagsWithId, tags)) {
            setButtonEnabled(true)
        } else {
            if (itemsDifferCheckOrder(previousSavedFeaturedProducts, savedFeaturedTagsWithId)) {
                const timeoutId = setTimeout(() => {
                    setPreviousSavedFeaturedProducts(tags)
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
                return () => clearTimeout(timeoutId)
            }
            else
                setButtonEnabled(false)
        }
    }, [savedFeaturedTagsWithId, previousSavedFeaturedProducts, tags, setPreviousSavedFeaturedProducts, setButtonEnabled, setChanged])

    function handleAddPress() {
        setModalOpen(true);
    }

    function handleAddModalSubmit(tag: TagAndImage) {
        if (!tags.find(p => p.tag.id === tag.tag.id)) {
            setTags([{...tag, id: tag.tag.id}, ...tags])
        }
        setModalOpen(false);
    }

    function handleResetPress() {
        setTags(savedFeaturedTagsWithId);
    }

    function handleRemove(index: number) {
        setTags(tags.filter((_, i) => i !== index));
    }

    async function handleSave(_: React.MouseEvent<Element, MouseEvent>, next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void) {
        if (changed) {
            const result = await saveFeaturedTagsClient(tags);
            if (result.success) {
                next(true)
                setChanged(false);
                setTimeout(()=>{
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
            } else {
                toast({
                    title: "Error saving tags",
                    description: result.error,
                    variant: "destructive",
                    duration: 5000
                })
                next(false, "Error")
            }
        } else
            next(false, "No changes")
    }

    return (
        <div className={clsx(className, "border border-borders rounded-xl p-2 @container")}>
            <div className="flex flex-col items-center w-5/6 @lg:w-11/12 @4xl:w-5/6 mx-auto">
                <p className="w-full my-2 font-bold">Drag the cards to change their order in the home page</p>
                <SortableList className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4 @4xl:gap-6 w-full auto-rows-[1fr]" items={tags} onItemsOrderChange={setTags} onAddPress={handleAddPress} maxCount={MAX_FEATURED_TAGS}>
                    {(tag, index) => (
                            <AdminFeaturedTagCard tag={tag} removable
                                                      onRemove={() => handleRemove(index)}/>
                    )}
                </SortableList>

                <div className="flex gap-2 mt-4 items-center">
                    <Button color="danger" className="w-30 h-10" onPress={handleResetPress}
                            isDisabled={!changed}>Reset</Button>
                    <AwesomeButtonProgress type="primary" disabled={!buttonEnabled} onPress={handleSave}
                                           cssModule={AwesomeButtonStyles}>Save</AwesomeButtonProgress>
                </div>
            </div>
            <AddFeaturedTagModal isOpen={modalOpen} onSubmit={handleAddModalSubmit}
                                     onClose={() => setModalOpen(false)}/>
        </div>
    )
}