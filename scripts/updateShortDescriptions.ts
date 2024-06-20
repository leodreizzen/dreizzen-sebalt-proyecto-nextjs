import prisma from "@/lib/prisma";
import {z} from "zod";
const SummarizedProductModel = z.object({
    productName: z.string(),
    productId: z.number(),
    shortDescription: z.string().nullable()
})
//@ts-ignore
import("@/../summarizedProducts-Final.json").then((data)=>{
    const summarizedProducts = z.array(SummarizedProductModel).parse(data)
    {
        prisma.$transaction(
            summarizedProducts.filter(p=>p.shortDescription !== null).map(p => prisma.product.update({
                where: {
                    id: p.productId
                },
                data: {
                    shortDescription: p.shortDescription
                }
            }))
        ).then(() => console.log("Done!")).catch(console.error)
    }
}).catch(console.error)
