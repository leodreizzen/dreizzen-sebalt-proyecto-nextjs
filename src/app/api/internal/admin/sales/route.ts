import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {AdminSalesAPIResponse} from "@/app/api/internal/admin/sales/types";

export async function GET(request: NextRequest): Promise<NextResponse<AdminSalesAPIResponse>>{

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
        return NextResponse.json(await prisma.productSale.findMany({
            where: {
                product:{
                    name:{
                        contains: query,
                        mode: "insensitive"
                    },
                }
            },
            include: {
                product:{
                    include:{
                        sale: true,
                        coverImage: true,
                        tags: {
                            include:{
                                tag: true
                            }
                        }
                    }
                }
            },
            take: 20
        }))
    }
}