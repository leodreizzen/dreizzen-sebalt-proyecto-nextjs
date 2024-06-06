import "server-only";
import prisma from './prisma';
import { FeaturedProductWithProduct, FeaturedProductWithProductAndOrder, FeaturedSaleWithProduct, FeaturedTagWithTagAndImage, ProductWithCoverImage, ProductWithTagsAndCoverImage } from "./definitions";

const TOTAL_ITEMS_PER_PAGE = 6;

export async function fetchUser( email: string ) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })

}

export async function fetchFeaturedProducts(){
    const data: FeaturedProductWithProduct[] = await prisma.featuredProduct.findMany({
        include: {
            product: {
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    coverImage: true
                }
            }
        },
    });
    return data
}

export async function fetchFeaturedTags(){
    const data: FeaturedTagWithTagAndImage[] = await prisma.featuredTag.findMany(
        {
            include: {
                tag: true,
                image: true
            }
        }
    );
    return data
}

export async function fetchFeaturedSales(){
    const data: FeaturedSaleWithProduct[] = await prisma.productSale.findMany({
        where: {
            isFeatured: true
        },
        include: {
            product: {
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    coverImage: true
                }
            }
        },
    })
    return data
}

export async function fetchGenrePages(id: number) {
    const data = await prisma.product.count({
        where: {
            tags: {
                some: {
                    tag: {
                        id: id
                    }   
                }
            }
        }
    })
    return data / TOTAL_ITEMS_PER_PAGE
}

export async function fetchByGenre(tagId: number, page: number) {
    const data: ProductWithTagsAndCoverImage[] = await prisma.product.findMany({
        where: {
            tags: {
                some: {
                    tag: {
                        id: tagId
                    }
                }
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                }
            }
        },
        skip: (page - 1) * TOTAL_ITEMS_PER_PAGE,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return data
}

export async function fetchTagName(id: number) {
    const data = await prisma.tag.findUnique({
        where: {
            id: id
        }
    })
    return data
}



export async function fetchTags() {
    const data = await prisma.tag.findMany();
    return data
}

export async function fetchSaleSearch(query: string) {
    const data: FeaturedProductWithProduct[] = await prisma.productSale.findMany({
        where: {
            product: {
                name: {
                    contains: query
                }
            }
        },
        include: {
            product: {
                include: {
                    coverImage: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            }
        }
    })
    return data
}

export async function fetchSalePages() {
    const data = await prisma.productSale.count();
    return data / TOTAL_ITEMS_PER_PAGE
}

export async function fetchSearch(query: string, page: number, filter: number[], priceRange: number[], onSale: boolean) {
    let data: ProductWithTagsAndCoverImage[] = await prisma.product.findMany({
        where: {
            name: {
                contains: query
            },
            currentPrice_cents: {
                gte: priceRange[0] * 100,
                lte: priceRange[1] * 100
            },
            AND: filter.map((tagId) => ({
                tags: {
                    some: {
                        tag: {
                            id: tagId
                        }
                    }
                }
            })),
            sale: onSale ? { isNot: null } : {},
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                }
            }
        },
        skip: (page - 1) * TOTAL_ITEMS_PER_PAGE,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return data
}

export async function fetchSearchPages(query: string, filter: number[], priceRange: number[], onSale: boolean) {
    const data = await prisma.product.count({
        where: {
            name: {
                contains: query
            },
            currentPrice_cents: {
                gte: priceRange[0] * 100,
                lte: priceRange[1] * 100
            },
            AND: filter.map((tagId) => ({
                tags: {
                    some: {
                        tag: {
                            id: tagId
                        }
                    }
                }
            })),
            sale: onSale ? { isNot: null } : {is: null},
        }
    })
    return Math.ceil(data / TOTAL_ITEMS_PER_PAGE)
}

export async function fetchMostSold(currentPage: number) {
    const data = await prisma.product.findMany({
            where: {
                purchases: {
                    some: {}
                }
            },
            include: {
                coverImage: true,
                tags: {
                    include: {
                    tag: true
                    }
                },
                _count: {
                    select: {
                        purchases: true
                    }
                }
            }
    })

    const filteredData = data.filter((product) => product._count.purchases > 1)

    return filteredData
}

export async function fetchMostSoldPages() {
    const data = await prisma.product.findMany({
        where: {
            purchases: {
                some: {}
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                tag: true
                }
            },
            _count: {
                select: {
                    purchases: true
                }
            }
        }
    })

    const filteredData = data.filter((product) => product._count.purchases > 1)
    return Math.ceil(filteredData.length / TOTAL_ITEMS_PER_PAGE)
}