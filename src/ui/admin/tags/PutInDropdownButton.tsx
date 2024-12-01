import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {FaStar} from "react-icons/fa";
import React from "react";
import {useToast} from "@/ui/shadcn/use-toast";
import {Tooltip} from "@nextui-org/tooltip";
import {setTagDropdown} from "@/lib/actions/tags";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import AwesomeButtonStyles from "@/ui/admin/tags/addButtonProgress.module.scss";
export default function PutInDropdownButton({tagId}: { tagId: number }) {

    const {toast} = useToast();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const putInDropdown = async (
        _: React.MouseEvent<Element, MouseEvent>,
        next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void
    ) => {
        const result = await setTagDropdown(tagId, true)
        if(result.success) {
            next(true)
        }
        if (!result.success) {
            toast({
                title: "Error putting product in dropdown",
                description: result.error,
                duration: 5000,
                variant: "destructive"
            })
            next(false, "Error");
        }
        setTimeout(() => {
            onClose();
        }, 1000) // allow animation to finish
    };


    return (
        <>
            <Tooltip content="Add to dropdown">
                <Button
                    onClick={onOpen}
                    className={"text-white bg-gray-800 rounded-md min-w-6 h-9"}
                    size={"sm"}
                >
                    <FaStar className={"h-4 w-4"}/>
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add tag to dropdown</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Are you sure you want this tag in the dropdown?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <AwesomeButtonProgress type="primary" onPress={putInDropdown} loadingLabel="Adding..."
                                                       cssModule={AwesomeButtonStyles}>Add</AwesomeButtonProgress>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}