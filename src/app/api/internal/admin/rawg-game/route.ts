import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {RAWGGame} from "@/app/api/internal/admin/rawg-game/types";

export async function GET(request: NextRequest): Promise<NextResponse<RAWGGame>>{

    const authorized = (await auth())?.user?.isAdmin!!
    if(!authorized){
        return new NextResponse('Unauthorized', {status: 401})
    }
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if(id === null){
        return new NextResponse('Missing ID parameter', {status: 400})
    }

    else{
        const gameUrl = `https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_API_KEY}`
        const gameResponse = await fetch(gameUrl)
        const gameData = await gameResponse.json()

        const screenshotsUrl = `https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.RAWG_API_KEY}`
        const screenshotsResponse = await fetch(screenshotsUrl)
        const screenshotsData = await screenshotsResponse.json()

        const moviesUrl = `https://api.rawg.io/api/games/${id}/movies?key=${process.env.RAWG_API_KEY}`
        const moviesResponse = await fetch(moviesUrl)
        const moviesData = await moviesResponse.json()

        const result = {
            id: gameData.id,
            name: gameData.name,
            slug: gameData.slug,
            description: gameData.description,
            background_image: gameData.background_image,
            released: gameData.released,
            genres: gameData.genres.map((tag: any) => {
                return {
                    id: tag.id,
                    name: tag.name,
                    slug: tag.slug
                }
            }),
            publishers: gameData.publishers.map((publisher: any) => {
                return {
                    id: publisher.id,
                    name: publisher.name,
                    slug: publisher.slug
                }
            }),
            developers: gameData.developers.map((developer: any) => {
                return {
                    id: developer.id,
                    name: developer.name,
                    slug: developer.slug
                }
            }),
            screenshots: screenshotsData.results.map((screenshot: any) => {
                if (!screenshot.is_deleted)
                    return {
                        id: screenshot.id,
                        image: screenshot.image
                    }
            }),
            movies: moviesData.results.map((movie: any) => {
                return {
                    id: movie.id,
                    preview: movie.preview,
                    video: movie.data.max
                }
            })
        }
        return NextResponse.json(result, {status: 200})
    }

}