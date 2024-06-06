import { PrismaClient, Product, VideoSource } from "@prisma/client";
import bcrypt from 'bcrypt';
import fs from 'fs';

const prisma = new PrismaClient();



function getJsonFromFile(path: string){
    let rawdata = fs.readFileSync(path).toString();
    let json = JSON.parse(rawdata);
    return json;
}

/* get random number between min and max */
function getRandomInt(min: number , max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createProducts(){
    const products = getJsonFromFile('prisma/gamesdata.json');
    for (const product of products) {
        let randomPrice = getRandomInt(1, 100) * 100
        let genres = (() => {
            const genres = []
            for (let genre of product.genres) {
                const genreName = genre.name
                genres.push(genreName)
            }
            return genres
        })
        const genreTag = []
        for (const genre of genres()) {
            const tag = await prisma.tag.upsert({
                where: {
                    name: genre,
                    inDropdown: false
                },
                update: {},
                create: {
                    name: genre,
                    inDropdown: false
                }
            })
            genreTag.push(tag)
        }
        let descriptionImages = (() => {
            const images = []
            for (let image of product.screenshots) {
                const imageUrl = image.image
                images.push(imageUrl)
            }
            return images
        })
        let videos = (() => {
            const videos = []
            for (let video of product.videos) {
                const videoUrl = video.data.max
                const videoThumbnail = video.preview
                videos.push([videoUrl, videoThumbnail])
            }
            return videos
        })
        console.log("Name: " + product.name)
        const productObject = await prisma.product.create({
            data: {
                name: product.name,
                originalPrice_cents: randomPrice,
                currentPrice_cents: randomPrice,
                launchDate: new Date(product.released),
                coverImage: {
                    create: {
                        url: product.background_image,
                        alt: "Cover art for " + product.name
                    }
                },
                description: product.description,
                shortDescription: "",
                descriptionImages: {
                    createMany: {
                        data: descriptionImages().map((url) => ({ url: url, alt: "Description image for " + product.name })),
                    }
                },
                videos: {
                    create: videos().map(([url, thumbnail]) => ({ source: VideoSource.CLOUDINARY, sourceId: url, alt: "Video for " + product.name ,thumbnail: { create: { url: thumbnail, alt: "Video thumbnail for " + product.name } } })),
                },
            }
        });
        let publishers = []
        if (product.publishers.length > 0) {
            for (const publisher of product.publishers) {
                const publisherObject = await prisma.company.upsert({
                    where: { name: publisher.name },
                    update: {},
                    create: {
                        name: publisher.name
                    }
                })
                publishers.push(publisherObject)
            }
        }
        await prisma.product.update({
            where: { id: productObject.id },
            data: {
                publishers: {
                    connect: publishers
                }
            }
        })
        let developers = []
        if (product.developers.length > 0) {
            for (const developer of product.developers) {
                const developerObject = await prisma.company.upsert({
                    where: { name: developer.name },
                    update: {},
                    create: {
                        name: developer.name
                    }
                })
                developers.push(developerObject)
            }
        }
        await prisma.product.update({
            where: { id: productObject.id },
            data: {
                developers: {
                    connect: developers
                }
            }
        })
        let order = 0
        for (const tag of genreTag) {
            await prisma.productTag.create({
                data: {
                    productId: productObject.id,
                    tagId: tag.id,
                    order: order
                }
            })
            order++
        }
        console.log(`Created product with id: ${productObject.id} and name: ${productObject.name}`)
    }
}

async function createFeaturedProducts(){
    const featuredProducts = getJsonFromFile('prisma/featuredproducts.json');
    for (const product of featuredProducts) {
        const productObject = await prisma.product.findFirst({
            where: {
                id: product.productId
            }
        });
        if (productObject) {
            await prisma.featuredProduct.create({
                data: {
                    productId: productObject.id,
                    order: product.order
                }
            })
            console.log(`Created featured product with id: ${productObject.id} and name: ${productObject.name}`)
        }
    }
}

async function createPurchases(){
    const purchases = getJsonFromFile('prisma/purchases.json');
    const invoices = getJsonFromFile('prisma/invoices.json');
    let index = 0
    for (const purchase of purchases) {
        let productObjects = []
        for (const game of purchase.games) {
            const productObject = await prisma.product.findFirstOrThrow({
                where: {
                    name: game
                }
            });
            productObjects.push(productObject)
        }
        const invoice = await prisma.invoiceData.create({
            data: {
                customerId: invoices[index].customerId,
                firstName: invoices[index].firstName,
                lastName: invoices[index].lastName,
                address1: invoices[index].address1,
                address2: invoices[index].address2,
                city: invoices[index].city,
                state: invoices[index].state,
                country: invoices[index].country,
                email: invoices[index].email,
            }
        })
        const purchaseObject = await prisma.purchase.create({
            data: {
                paymentId: purchase.paymentId,
                invoiceData: {
                    connect: {
                        id: invoice.id
                    }
                },
            }
        })
        for (const productObject of productObjects) {
            await prisma.purchaseItem.create({
                data: {
                    productId: productObject.id,
                    purchaseId: purchaseObject.id,
                    originalPrice_cents: productObject.originalPrice_cents,
                    currentPrice_cents: productObject.currentPrice_cents
                }
            })
        }
        console.log(`Created purchase with id: ${purchaseObject.id}`)
    }
}

async function createProductSales(){
    const productSales = getJsonFromFile('prisma/productsales.json');
    for (const productSale of productSales) {
        const productObject = await prisma.product.findFirstOrThrow({
            where: {
                name: productSale.game
            }
        });
        await prisma.productSale.create({
            data: {
                productId: productObject.id,
                originalPrice_cents: productObject.originalPrice_cents,
                currentPrice_cents: Math.floor(productObject.currentPrice_cents * ((100 - productSale.discount) / 100)),
                isFeatured: productSale.isFeatured,
            }
        })
        console.log(`Created product sale with id: ${productObject.id}`)
        await prisma.product.update({
            where: { id: productObject.id },
            data: {
                currentPrice_cents: Math.floor(productObject.currentPrice_cents * ((100 - productSale.discount) / 100))
            }
        })
    }

}

async function createUser(){
    const users = getJsonFromFile('prisma/admin.json');
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await prisma.user.create({
            data: {
                email: user.email,
                passwordHash: hashedPassword,
                isAdmin: true
            }
        })
        console.log(`Created user with email: ${user.email}`)
    }

}

async function createFeaturedTags(){
    const tags = getJsonFromFile('prisma/featuredtags.json');
    for (const tag of tags) {
        await prisma.featuredTag.create({
            data: {
                order: tag.order,
                tag: {
                    connect: {
                        name: tag.name
                    }
                },
                image: {
                    create: {
                        url: tag.image,
                        alt: "Featured tag image for " + tag.name
                    }
                }
            }
        })
        console.log(`Created featured tag with name: ${tag.name}`)
    }
}

async function putInDropdown(){
    const tags = getJsonFromFile('prisma/indropdown.json');
    for (const tag of tags) {
        await prisma.tag.update({
            where: {
                name: tag.name
            },
            data: {
                inDropdown: true
            }
        })
        console.log(`Updated tag with name: ${tag.name}`)
    }
}

async function main() {
    await createProducts()
    await createFeaturedProducts()
    await createPurchases()
    await createProductSales()
    await createUser()
    await createFeaturedTags()
    await putInDropdown()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })