import {Video, VideoSource} from "@prisma/client";

const {PrismaClient} = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    const videos: Video[] = await prisma.video.findMany({})

    videos.forEach(async video => {
        const pattern = /\/apps\/(\d+)\//;
        const match = video.sourceId.match(pattern);

        let newId;
        if (match && match[1]) {
            newId = match[1];
        } else {
            console.error(`Video id ${video.id} sourceId ${video.sourceId} does not match format`)
            return
        }
        await prisma.video.update({
                where: {
                    id: video.id,
                    source: VideoSource.CLOUDINARY
                },
                data: {
                    source: VideoSource.STEAMCDN,
                    sourceId: newId
                }
            }
        )
    })
}

main()