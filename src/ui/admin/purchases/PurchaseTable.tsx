import {Card, CardContent} from "@/ui/shadcn/card"
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/ui/shadcn/table"
import {PurchaseWithItemsAndInvoiceData} from "@/lib/definitions";
import {formatFullName, formatPrice, formatPurchaseDateTime} from "@/util/formatUtils";
import {Button} from "@nextui-org/button";
import {IoMdEye} from "react-icons/io";
import Link from "next/link";

function getTotalPriceCents(purchase: PurchaseWithItemsAndInvoiceData) {
    return purchase.products.reduce((acc, item) => acc + item.currentPrice_cents, 0)

}

export default function PurchaseTable({purchases}: { purchases: PurchaseWithItemsAndInvoiceData[] }) {
    return (
        <div className="w-full bg-black rounded-md text-white">
            <div className="grid gap-4 sm:hidden">
                {purchases.map((purchase) => (
                    <Card key={purchase.id}>
                        <CardContent className="flex flex-col items-center !p-4 w-full">
                            <div className="flex w-full">
                                <div className="flex flex-col w-6/12">
                                    <div className="flex items-center grow">
                                        <p className="font-medium">#{purchase.id}</p>
                                    </div>
                                    <div className="">{purchase.products.length} items</div>
                                    <div className="">{formatPrice(getTotalPriceCents(purchase))}</div>
                                </div>
                                <div className="flex flex-col w67/12">
                                    <div className="font-medium">{formatPurchaseDateTime(purchase.purchaseDate)}</div>
                                    <p className="font-medium">{formatFullName(purchase.invoiceData.firstName, purchase.invoiceData.lastName)}</p>

                                </div>
                            </div>
                            <div className="flex items-center col-span-2 mt-2">
                                <Button as={Link} href={`/admin/purchase/${purchase.id}`}
                                        className={"text-white bg-gray-800 rounded-md min-w-0 !h-12 !w-12"} size="sm">
                                    <IoMdEye className="size-full"/>
                                </Button>
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
                            <TableHead>Date</TableHead>
                            <TableHead>Full name</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total amount</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((purchase) => (
                            <TableRow key={purchase.id} className={"hover:bg-slate-100/50 dark:hover:bg-slate-800/50"}>
                                <TableCell className="font-medium">#{purchase.id}</TableCell>
                                <TableCell
                                    className="font-medium">{formatPurchaseDateTime(purchase.purchaseDate)}</TableCell>
                                <TableCell
                                    className="font-medium">{formatFullName(purchase.invoiceData.firstName, purchase.invoiceData.lastName)}</TableCell>
                                <TableCell>{purchase.products.length}</TableCell>
                                <TableCell>{formatPrice(getTotalPriceCents(purchase))}</TableCell>
                                <TableCell>
                                    <Button as={Link} href={`/admin/purchase/${purchase.id}`}
                                            className={"text-white bg-gray-800 rounded-md min-w-6 h-9"} size="sm">
                                        <IoMdEye className="h-4 w-4"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}