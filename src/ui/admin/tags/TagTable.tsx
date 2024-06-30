"use client"

import {TagWithProducts} from "@/lib/definitions";
import {Card, CardContent} from "@/ui/shadcn/card";
import {Button} from "@nextui-org/button";
import {IoMdEye} from "react-icons/io";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/ui/shadcn/table";
import DeleteTagButton from "@/ui/admin/tags/DeleteTagButton";
import PutInDropdownButton from "@/ui/admin/tags/PutInDropdownButton";
import RemoveFromDropdownButton from "@/ui/admin/tags/RemoveFromDropdownButton";


export default function TagTable({tags}: { tags: TagWithProducts[] }) {
    return (
        <div className="w-full rounded-md text-white @container">
            <div className="grid gap-4 @sm:hidden">
                {tags.map((tag) => (
                    <Card key={tag.id} className="rounded-2xl dark">
                        <CardContent className="flex flex-col items-center !p-3 w-full">
                            <div className="flex w-full justify-center">
                                <div className="flex flex-col w-fit items-center">
                                    <span>#{tag.id}</span>
                                    <span className="font-bold">{tag.name}</span>
                                    <span className="">{tag.productTags.length} games</span>
                                </div>
                            </div>
                            <div className="flex items-center col-span-2 mt-2 gap-2">
                                {!tag.inDropdown ? <PutInDropdownButton tagId={tag.id}/> :
                                    <RemoveFromDropdownButton tagId={tag.id}/>}
                                <DeleteTagButton tagId={tag.id}/>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="hidden @sm:block border border-borders bg-black rounded-xl">
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
                                <TableCell className="flex gap-2">
                                    {!tag.inDropdown ? <PutInDropdownButton tagId={tag.id}/> :
                                        <RemoveFromDropdownButton tagId={tag.id}/>}
                                    <DeleteTagButton tagId={tag.id}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}