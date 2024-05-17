export type ProductDTO = {
    id: number;
    name: string;
    originalPrice_cents: number;
    currentPrice_cents: number;
    description: string;
    shortDescription: string | null;
    launchDate: Date;
    coverImage: ImageDTO;
    descriptionImages: ImageDTO[];
    videos: VideoDTO[];
}

export type ImageDTO = {
    id: number;
    url: string;
    alt: string;
}

export type VideoDTO = {
    id: number;
    source: VideoSource;
    description: string;
    url: string;
    productId: number | null;
}

export enum VideoSource{
    YOUTUBE,
    CLOUDINARY
}