import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import React from "react";
import {FaRegStar} from "react-icons/fa6";
import {useToast} from "@/ui/shadcn/use-toast";
import {Tooltip} from "@nextui-org/tooltip";
import {setTagDropdown} from "@/lib/actions/tags";

export default function RemoveFromDropdownButton({tagId}: { tagId: number }) {
    const {toast} = useToast();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const removeFromDropdown = async () => {
        const result = await setTagDropdown(tagId, false)
        if (!result.success)
            toast({
                title: "Error removing product from dropdown",
                description: result.error,
                duration: 5000,
                variant: "destructive"
            })
        onClose()
    };

    return (
        <>
            <Tooltip content="Remove from dropdown">
                <Button
                    onClick={onOpen}
                    className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                    size={"sm"}
                >
                    <FaRegStar className={"h-4 w-4 text-danger"}/>
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Remove tag from dropdown</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Are you sure you want to remove this tag from the dropdown?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={removeFromDropdown}>
                                    Remove
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}