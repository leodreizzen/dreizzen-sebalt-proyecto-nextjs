
import { Card, CardContent } from "@/ui/shadcn/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/ui/shadcn/table"
import {AdminProduct} from "@/lib/definitions";
import Image from "next/image";
import { FaPen } from "react-icons/fa";
import {formatPrice} from "@/util/formatUtils";
import DeleteButton from "@/ui/admin/products/DeleteButton";
import {Button} from "@nextui-org/button";
import Link from "next/link";
import {currentPrice} from "@/util/productUtils";

export default function ProductTable({ products }: {products: AdminProduct[]}) {
    return (
        <div className="w-full bg-black rounded-md text-white border-white border-1">
            <div className="grid gap-4 sm:hidden">
                {products.map((product) => (
                    <Card key={product.id} className="dark">
                        <CardContent className="grid grid-cols-[80px_1fr] gap-4 items-center">
                            <Image src={product.coverImage.url} alt={product.coverImage.alt} width={240} height={190} className="rounded-md mt-4 select-none" />
                            <div className="grid gap-2">
                                <div className="font-medium mt-4">{product.name}</div>
                                <div className="flex flex-col items-start justify-start">
                                    <div><p className="text-tiny md:text-md font-bold">{<s>{ product.originalPrice_cents != currentPrice(product) ? <s>{formatPrice(product.originalPrice_cents)}<br /></s> : null }</s>}{formatPrice(currentPrice(product))}</p></div>
                                    <div className="text-gray-500">Purchases: {product.purchases.length}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button as={Link} href={`/admin/products/edit/${product.id}`} className={"text-white bg-gray-800 rounded-md min-w-6 h-9"} size="sm">
                                        <FaPen className="h-4 w-4" />
                                    </Button>
                                    <DeleteButton productId={product.id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="hidden sm:block">
                <Table color={"black"}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={"w-[120px]"}></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Sales</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className={"hover:bg-slate-100/50 dark:hover:bg-slate-800/50"}>
                                <TableCell>
                                    <Image src={product.coverImage.url} alt={product.coverImage.alt} width={100} height={80} className="rounded-md select-none" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{<s>{ product.originalPrice_cents != currentPrice(product) ? <s>{formatPrice(product.originalPrice_cents)}<br /></s> : null }</s>}{formatPrice(currentPrice(product))}</TableCell>
                                <TableCell>{product.purchases.length}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button as={Link} href={`/admin/products/edit/${product.id}`} className={"text-white bg-gray-800 rounded-md min-w-6 h-9"} size="sm">
                                            <FaPen className="h-4 w-4" />
                                        </Button>
                                        <DeleteButton productId={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}