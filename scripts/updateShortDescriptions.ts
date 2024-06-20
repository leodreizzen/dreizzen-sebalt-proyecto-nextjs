import prisma from "@/lib/prisma";
import summarizedProducts from "@/../summarizedProducts-Final.json"
prisma.$transaction(
    summarizedProducts.filter(p=>p.shortDescription !== null).map(p => prisma.product.update({
        where: {
            id: p.productId
        },
        data: {
            shortDescription: p.shortDescription
        }
    }))
).then(() => console.log("Done!") ).catch(console.error)
