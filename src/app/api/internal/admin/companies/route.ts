import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {AdminCompaniesAPIResponse} from "@/app/api/internal/admin/companies/types";

export async function GET(request: NextRequest): Promise<NextResponse<AdminCompaniesAPIResponse>>{

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
        return NextResponse.json(await prisma.company.findMany({
            where: {
                name:{
                    contains: query,
                    mode: "insensitive"
                }
            },
            take: 20
        }))
    }
}