import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse>{

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const page = searchParams.get('page')

    const queryPage = page === null ? 1 : parseInt(page)
    const queryName = query === null ? "" : query
    const queryTake = 20


    return NextResponse.json(await prisma.product.findMany({
        where: {
            name:{
                contains: queryName,
                mode: "insensitive"
            },
        },
        include: {
            coverImage: true,
            tags: {
                include:{
                    tag: true
                }
            }
        },
        skip: (queryPage - 1) * queryTake,
        take: 20
    }))


}
