import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {FaTrash} from "react-icons/fa";
import React from "react";

export default function DeleteTagButton({ tagId }: { tagId: number }) {


    const handleDelete = async () => {
        //TODO: Implement delete
    };

    const {isOpen, onOpen, onOpenChange} = useDisclosure();



    return (
        <>
            <Button
                onClick={onOpen}
                className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                size={"sm"}
            >
                <FaTrash className={"h-4 w-4"}/>
            </Button>
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
                                <Button color="primary" onPress={onClose}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}