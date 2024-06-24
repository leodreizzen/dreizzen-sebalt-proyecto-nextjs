import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {FaStar} from "react-icons/fa";
import React from "react";
import {useToast} from "@/ui/shadcn/use-toast";
import {setTagDropdown} from "@/lib/actions";

export default function PutInDropdownButton({ tagId }: { tagId: number }) {

    const {toast} = useToast();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const putInDropdown = async () => {
        const result = await setTagDropdown(tagId, true)
        if(!result.success)
            toast({title: "Error putting product in dropdown", description: result.error, duration: 5000, variant: "destructive"})
        onClose()
    };


    return (
        <>
            <Button
                onClick={onOpen}
                className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                size={"sm"}
            >
                <FaStar className={"h-4 w-4"}/>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Put tag in dropdown</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Are you sure you want this tag in the dropdown?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={putInDropdown}>
                                    Yes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}