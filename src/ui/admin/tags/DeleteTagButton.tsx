import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {FaTrash} from "react-icons/fa";
import React from "react";
import {useToast} from "@/ui/shadcn/use-toast";
import {Tooltip} from "@nextui-org/tooltip";
import {deleteTag, setTagDropdown} from "@/lib/actions/tags";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import AwesomeButtonStyles from "@/ui/admin/tags/deleteButtonProgress.module.scss";
export default function DeleteTagButton({tagId}: { tagId: number }) {

    const {toast} = useToast();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

    async function handleDelete(
        _: React.MouseEvent<Element, MouseEvent>,
        next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void
    ) {
        const result = await deleteTag(tagId)
        if(result.success) {
            next(true)
        }
        if (!result.success) {
            toast({title: "Error deleting product", description: result.error, duration: 5000, variant: "destructive"})
            next(false, "Error")
        }
        setTimeout(() => {
            onClose()
        }, 1000) // allow animation to finish
    };


    return (
        <>
            <Tooltip content="Delete">
                <Button
                    onClick={onOpen}
                    className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                    size={"sm"}
                >
                    <FaTrash className={"h-4 w-4 text-danger"}/>
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete tag</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Are you sure you want to delete this tag? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <AwesomeButtonProgress type="primary" onPress={handleDelete} loadingLabel="Deleting..."
                                                       cssModule={AwesomeButtonStyles}>Delete</AwesomeButtonProgress>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}