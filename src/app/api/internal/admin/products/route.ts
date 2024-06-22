import {getCart} from "@/lib/session-data";
import {NextRequest, NextResponse} from "next/server";
import {AdminProductsAPIResponse} from "@/app/api/internal/admin/products/types";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse<AdminProductsAPIResponse>>{

    const authorized = (await auth())?.user?.isAdmin!!
    if(!authorized){
        return new NextResponse('Unauthorized', {status: 401})
    }
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if(query === null){
        return new NextResponse('Missing query parameter', {status: 400})
    }

    else{
        return NextResponse.json(await prisma.product.findMany({
            where: {
                name:{
                    contains: query,
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
            take: 20
        }))
    }

}