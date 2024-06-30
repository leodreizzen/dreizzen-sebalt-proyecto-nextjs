import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {RAWGSearchResult} from "@/app/api/internal/admin/rawg-search/types";

export async function GET(request: NextRequest): Promise<NextResponse<RAWGSearchResult>>{

    const authorized = (await auth())?.user?.isAdmin!!
    if(!authorized){
        return new NextResponse('Unauthorized', {status: 401})
    }
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if(query === null){
        return new NextResponse('Missing query parameter', {status: 400})
    }

    else {
        const baseUrl = "https://api.rawg.io/api/games"
        const requestSearchParams = new URLSearchParams()
        const pageSize = 20
        requestSearchParams.set("key", process.env.RAWG_API_KEY!!)
        requestSearchParams.set("search", query)
        requestSearchParams.set("page_size", pageSize.toString())


        const queryUrl = `${baseUrl}?${requestSearchParams.toString()}`
        const response = await fetch(queryUrl)
        const data = await response.json()
        const results = data.results.map((result: any) => {
            return {
                id: result.id,
                name: result.name,
                slug: result.slug
            }
        })
        return NextResponse.json(results, {status: 200})
    }

}