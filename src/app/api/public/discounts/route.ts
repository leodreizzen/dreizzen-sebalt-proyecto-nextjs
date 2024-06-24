import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse>{

    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')

    const queryPage = page === null ? 1 : parseInt(page)
    const queryTake = 20


    return NextResponse.json(await prisma.productSale.findMany({
        include: {
            product: {
                include: {
                    coverImage: true,
                    tags: {
                        include:{
                            tag: true
                        }
                    }
                }
            }
        },
        skip: (queryPage - 1) * queryTake,
        take: 20
    }))


}
