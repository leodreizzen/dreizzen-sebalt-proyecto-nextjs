"use client"

import {TagWithProducts} from "@/lib/definitions";
import {Card, CardContent} from "@/ui/shadcn/card";
import {Button} from "@nextui-org/button";
import {IoMdEye} from "react-icons/io";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/ui/shadcn/table";
import DeleteTagButton from "@/ui/admin/tags/DeleteTagButton";
import PutInDropdownButton from "@/ui/admin/tags/PutInDropdownButton";
import RemoveFromDropdownButton from "@/ui/admin/tags/RemoveFromDropdownButton";


export default function TagTable({tags}: { tags: TagWithProducts[]}) {
    return (
        <div className="w-full bg-black rounded-md text-white">
            <div className="grid gap-4 sm:hidden">
                {tags.map((tag) => (
                    <Card key={tag.id}>
                        <CardContent className="flex flex-col items-center !p-4 w-full">
                            <div className="flex w-full">
                                <div className="flex flex-col w-6/12">
                                    <div className="flex items-center grow">
                                        <p className="font-medium">#{tag.id}</p>
                                    </div>
                                    <div className="">{tag.productTags.length} games</div>
                                    <div className="flex flex-col w-7/12">
                                        <p className="font-medium">{tag.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center col-span-2 mt-2">
                                <DeleteTagButton tagId={tag.id}/>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="hidden sm:block border border-borders">
                <Table color={"black"}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Games with tag</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.map((tag) => (
                            <TableRow key={tag.id} className={"hover:bg-slate-100/50 dark:hover:bg-slate-800/50"}>
                                <TableCell className="font-medium">#{tag.id}</TableCell>
                                <TableCell
                                    className="font-medium">{tag.name}</TableCell>
                                <TableCell>{tag.productTags.length}</TableCell>
                                <TableCell>
                                    <DeleteTagButton tagId={tag.id}/>
                                    {!tag.inDropdown ? <PutInDropdownButton tagId={tag.id}/> : <RemoveFromDropdownButton tagId={tag.id}/>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}