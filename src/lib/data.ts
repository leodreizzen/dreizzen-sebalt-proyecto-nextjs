import "server-only";
import prisma from './prisma';
import {
    AdminProduct,
    FeaturedProductWithProduct,
    FeaturedTagWithTagAndImage,
    ProductForDetail,
    ProductSaleWithProduct,
    ProductWithCoverImage,
    ProductWithTagsAndCoverImage,
    PurchaseWithCompleteItemsAndInvoiceData,
    PurchaseWithItemsAndInvoiceData,
    removeReadOnlyForNumArray,
    TagWithProducts
} from "./definitions";
import {getCart} from "@/lib/session-data";
import {Tag} from "@prisma/client";
import {cache} from "react";

const TOTAL_ITEMS_PER_PAGE = 6;
const PURCHASE_ITEMS_PER_PAGE = 8;

export async function fetchUser(email: string) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })

}

export async function fetchFeaturedProducts() {
    const data: FeaturedProductWithProduct[] = await prisma.featuredProduct.findMany({
        where: {
            product: {
                available: true
            }
        },
        include: {
            product: {
                include: {
                    sale: true,
                    tags: {
                        include: {
                            tag: true
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    },
                    coverImage: true,
                }
            },
        },
        orderBy: {
            order: 'asc'
        }
    });
    return data
}

export async function fetchFeaturedTags() {
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

export async function fetchDropdownTags(): Promise<Tag[]> {
    const data = await prisma.tag.findMany({
        where: {
            inDropdown: true
        }
    });
    return data
}

export async function fetchFeaturedSales() {
    const data: ProductSaleWithProduct[] = await prisma.productSale.findMany({
        where: {
            isFeatured: true,
            product: {
                available: true
            }
        },
        include: {
            product: {
                include: {
                    sale: true,
                    tags: {
                        include: {
                            tag: true
                        },
                        orderBy: {
                            order: 'asc'
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
                    product: {
                        available: true
                    },
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
                    product: {
                        available: true
                    }
                    ,
                    tag: {
                        id: tagId
                    }
                }
            }
        },
        include: {
            sale: true,
            coverImage: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
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
            available: true,
            id: {
                in: removeReadOnlyForNumArray(cartIds)
            }
        },
        include: {
            coverImage: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
                }
            },
            sale: true
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

export async function validateProduct(id: number): Promise<boolean> {
    return await prisma.product.findUnique({
        where: {
            available: true,
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

export async function fetchAllTags() {
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
                                available: true,
                                name: {
                                    contains: query,
                                    mode: 'insensitive'
                                },
                                OR: [
                                    {
                                        sale: null,
                                        originalPrice_cents: {
                                            gte: priceRange[0] * 100,
                                            lte: priceRange[1] * 100
                                        }
                                    }, {
                                        sale: {
                                            currentPrice_cents: {
                                                gte: priceRange[0] * 100,
                                                lte: priceRange[1] * 100
                                            }
                                        }
                                    }
                                ],
                                AND: filter.map((tagId) => ({
                                    tags: {
                                        some: {
                                            tag: {
                                                id: tagId
                                            }
                                        }
                                    }
                                })),
                                sale: onSale ? {isNot: null} : {},
                            }
                        }
                    }
                }
            }
        )
    ;
    return data
}

export async function fetchSaleSearch(query: string) {
    const data: ProductSaleWithProduct[] = await prisma.productSale.findMany({
        where: {
            product: {
                name: {
                    contains: query,
                },
                available: true
            }
        },
        include: {
            product: {
                include: {
                    sale: true,
                    coverImage: true,
                    tags: {
                        include: {
                            tag: true
                        },
                        orderBy: {
                            order: 'asc'
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
            available: true,
            name: {
                contains: query,
                mode: 'insensitive'
            },
            OR: [
                {
                    sale: null,
                    originalPrice_cents: {
                        gte: priceRange[0] * 100,
                        lte: priceRange[1] * 100
                    }
                }, {
                    sale: {
                        currentPrice_cents: {
                            gte: priceRange[0] * 100,
                            lte: priceRange[1] * 100
                        }
                    }
                }
            ], AND: filter.map((tagId) => ({
                tags: {
                    some: {
                        tag: {
                            id: tagId
                        }
                    }
                }
            })),
            sale: onSale ? {isNot: null} : {},
        },
        include: {
            sale: true,
            coverImage: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
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
            available: true,
            name: {
                contains: query,
                mode: 'insensitive'
            },
            OR: [
                {
                    sale: null,
                    originalPrice_cents: {
                        gte: priceRange[0] * 100,
                        lte: priceRange[1] * 100
                    }
                }, {
                    sale: {
                        currentPrice_cents: {
                            gte: priceRange[0] * 100,
                            lte: priceRange[1] * 100
                        }
                    }
                }
            ],
            AND: filter.map((tagId) => ({
                tags: {
                    some: {
                        tag: {
                            id: tagId
                        }
                    }
                }
            })),
            sale: onSale ? {isNot: null} : {},
        }
    })
    return Math.ceil(data / TOTAL_ITEMS_PER_PAGE)
}

export async function fetchMostSold(currentPage: number) {
    const data = await prisma.product.findMany({
        where: {
            available: true,
            purchases: {
                some: {}
            },
        },
        include: {
            sale: true,
            coverImage: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
                }
            },
            _count: {
                select: {
                    purchases: true
                }
            }
        },
    })
    const filteredData = data.filter((product) => product._count.purchases > 1)
    return filteredData.slice((currentPage - 1) * TOTAL_ITEMS_PER_PAGE, currentPage * TOTAL_ITEMS_PER_PAGE)
}

export async function fetchMostSoldPages() {
    const data = await prisma.product.findMany({
        where: {
            available: true,
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
            id: id,
            available: true,
        },
        include: {
            sale: true,
            coverImage: true,
            publishers: true,
            developers: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
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
                available: true,
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
            available: true,
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        include: {
            sale: true,
            coverImage: true,
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    order: 'asc'
                }
            },
            purchases: true
        },
        skip: (page - 1) * TOTAL_ITEMS_PER_PAGE,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return data
}

export async function fetchPurchases(page: number) {
    //We dont check available product as we want to see old purchases
    const data: PurchaseWithItemsAndInvoiceData[] = await prisma.purchase.findMany({
        include: {
            products: true,
            invoiceData: true
        },
        orderBy: {
            purchaseDate: 'desc'
        },
        skip: (page - 1) * PURCHASE_ITEMS_PER_PAGE,
        take: PURCHASE_ITEMS_PER_PAGE
    })
    return data
}

export async function fetchPurchasesPages() {
    const data = await prisma.purchase.count()
    return Math.ceil(data / PURCHASE_ITEMS_PER_PAGE)
}

export async function fetchPurchase(id: number) {
    const data: PurchaseWithCompleteItemsAndInvoiceData | null = await prisma.purchase.findUnique({
        where: {
            id: id
        },
        include: {
            products: {
                include: {
                    product: {
                        include: {
                            sale: true,
                            coverImage: true
                        }
                    }
                }
            },
            invoiceData: true
        }
    })
    return data
}

export async function fetchTagsAdmin(page: number) {
    const data: TagWithProducts[] = await prisma.tag.findMany({
        include: {
            productTags: true
        },
        skip: (page - 1) * TOTAL_ITEMS_PER_PAGE,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return data
}

export async function fetchTagsAdminPages() {
    const data = await prisma.tag.count()
    return Math.ceil(data / TOTAL_ITEMS_PER_PAGE)
}

export const fetchProductCached = cache(fetchProduct);