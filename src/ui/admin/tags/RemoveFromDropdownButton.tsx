import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {FaStar} from "react-icons/fa";
import React from "react";
import {FaX} from "react-icons/fa6";

export default function RemoveFromDropdownButton({ tagId }: { tagId: number }) {


    const putInDropdown = async () => {
        //TODO: Implement putting in dropdown
    };

    const {isOpen, onOpen, onOpenChange} = useDisclosure();



    return (
        <>
            <Button
                onClick={onOpen}
                className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                size={"sm"}
            >
                <FaX className={"h-4 w-4"}/>
            </Button>
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