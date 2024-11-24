'use client' // Error components must be Client Components

import {useEffect} from 'react'
import {CircleX} from "lucide-react";
import {Button} from "@nextui-org/button";
import {Card, CardHeader, CardBody} from "@nextui-org/card";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="m-auto flex flex-col items-center">
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Card className="bg-content1 rounded-xl p-4 border border-borders">
                <CardHeader className="flex-col">
                    <CircleX className="h-24 w-24"/>
                    <h1 className="font-bold text-xl mt-1">Error</h1>
                </CardHeader>
                <CardBody className="!pt-0">
                    <h2 className="text-medium">Something went wrong!</h2>
                    <Button className="mt-3"
                            onClick={
                                // Attempt to recover by trying to re-render the segment
                                () => reset()
                            }
                    >
                        Try again
                    </Button>
                </CardBody>
            </Card>
        </div>
    )
}