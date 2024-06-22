import "server-only";
import prisma from './prisma';
import {
    AdminProduct, FeaturedProductSaleWithProduct,
    FeaturedProductWithProduct,
    ProductSaleWithProduct,
    FeaturedTagWithTagAndImage,
    ProductForDetail,
    ProductWithCoverImage,
    ProductWithTagsAndCoverImage, removeReadOnlyForNumArray
} from "./definitions";
import {getCart} from "@/lib/session-data";
import {Tag} from "@prisma/client";

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

export async function fetchDropdownTags(): Promise<Tag[]>{
    const data = await prisma.tag.findMany({
        where: {
            inDropdown: true
        }
    });
    return data
}

export async function fetchFeaturedSales(){
    const data: ProductSaleWithProduct[] = await prisma.productSale.findMany({
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

export async function fetchCartProducts(): Promise<ProductWithCoverImage[]> {
    const cartIds = await getCart()
    const data = await prisma.product.findMany({
        where: {
            id: {
                in: removeReadOnlyForNumArray(cartIds)
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                }
            }
        }
    })
    return data
}

export async function fetchValidProducts(ids: number[]): Promise<number[]> {
    const data = await prisma.product.findMany({
        where: {
            id: {
                in: removeReadOnlyForNumArray(ids)
            }
        }
    })
    return data.map(product => product.id)
}

export async function validateProduct(id: number): Promise<boolean>{
    return await prisma.product.findUnique({
        where: {
            id: id
        }
    }) !== null
}

export async function fetchTagName(id: number) {
    const data = await prisma.tag.findUnique({
        where: {
            id: id
        }
    })
    return data
}

export async function fetchAllTags(){
    const data = await prisma.tag.findMany()
    return data
}

export async function fetchTags(query: string, filter: number[], priceRange: number[], onSale: boolean) {
    const data = await prisma.tag.findMany(
        {
            where: {
                productTags: {
                    some: {
                        product: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
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
                        }
                    }
                }
            }
        }
    );
    return data
}

export async function fetchSaleSearch(query: string) {
    const data: FeaturedProductSaleWithProduct[] = await prisma.productSale.findMany({
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
                contains: query,
                mode: 'insensitive'
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
                contains: query,
                mode: 'insensitive'
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

export async function fetchProduct(id: number): Promise<ProductForDetail | null> {
    const data: ProductForDetail | null = await prisma.product.findUnique({
        where: {
            id: id
        },
        include: {
            coverImage: true,
            publishers: true,
            developers: true,
            tags: {
                include: {
                    tag: true
                }
            },
            videos: {
                include: {
                    thumbnail: true,
                }
            },
            descriptionImages: true
        }
    })
    return data
}

export async function fetchProductPages(query: string) {
    const data = await prisma.product.count(
        {
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        }
    )
    return Math.ceil(data / TOTAL_ITEMS_PER_PAGE)
}

export async function fetchProducts(page: number, query: string) {
    const data: AdminProduct[] = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                }
            },
            purchases: true
        },
        skip: (page - 1) * TOTAL_ITEMS_PER_PAGE,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return data
}