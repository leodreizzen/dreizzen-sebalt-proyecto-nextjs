"use client"
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/modal";
import {FaTrash} from "react-icons/fa";
import React from "react";
import {Button} from "@nextui-org/button";
import {deleteProduct} from "@/lib/actions";
import {useToast} from "@/ui/shadcn/use-toast";


export default function DeleteButton({ productId }: { productId: number}) {


    const {isOpen, onOpen,onClose, onOpenChange} = useDisclosure();

    const {toast} = useToast();


    async function handleDelete() {
        const result = await deleteProduct(productId)
        if(!result.success)
            toast({title: "Error deleting product", description: result.error, duration: 5000, variant: "destructive"})
        onClose()
    }

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
                            <ModalHeader className="flex flex-col gap-1">Delete product</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Are you sure you want to delete this product? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleDelete}>
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