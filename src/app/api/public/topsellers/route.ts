import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse>{

    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')

    const queryPage = page === null ? 1 : parseInt(page)
    const queryTake = 20

    const data = await prisma.product.findMany({
        where: {
            purchases: {
                some: {}
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                }
            },
            _count: {
                select: {
                    purchases: true
                }
            }
        },
        skip: (queryPage - 1) * queryTake,
        take: 20
    })

    const filteredData = data.filter((product) => product._count.purchases > 1)

    return NextResponse.json(filteredData)
}
