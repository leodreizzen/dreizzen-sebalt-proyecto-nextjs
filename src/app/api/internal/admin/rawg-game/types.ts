export type RAWGGame = {
    id: number,
    name: string,
    slug: string,
    released: string,
    background_image: string,
    description: string,
    genres: [
        {
            id: number,
            name: string,
            slug: string
        }
    ],
    publishers: [
        {
            id: number,
            name: string,
            slug: string
        }
    ],
    developers: [
        {
            id: number,
            name: string,
            slug: string
        }
    ],
    screenshots: [
        {
            id: number,
            image: string
        }
    ],
    movies: [
        {
            id: number,
            preview: string,
            video: string
        }
    ]
}