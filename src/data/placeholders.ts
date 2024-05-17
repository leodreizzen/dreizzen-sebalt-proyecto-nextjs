import { Product } from "@prisma/client";
import { ProductDTO, ImageDTO, VideoSource } from "./DTO";

export const productPlaceholders: ProductDTO[] = [
    {
        id: 1,
        name: "Cookie Clicker",
        description: `
        Cookie Clicker es un juego que consiste en hacer una cantidad obscena de galletas. Para ayudarte en esta empresa, reclutarás a una amplia variedad de serviciales fabricantes, como las entrañables abuelas, las granjas, las fábricas y los portales sobrenaturales.

        Cookie Clicker se publicó en 2013 en la web, pero se ha desarrollado muy activamente desde entonces. ¡Si has jugado alguna vez, echa un vistazo a las nuevas funciones!
        
        Acumula galletas y gástalas para hacer aún más galletas
        Más de 600 mejoras
        Más de 500 logros
        Mima a tu dragón
        Minijuegos
        Desbloquea mejoras celestiales permanentes
        Se guarda en la nube (se acabó lo de borrar galletas por error)
        Música de C418
        `,
        shortDescription: "¡Un juego incremental en el que hay que hacer galletas! Se publicó en 2013 en la web y se ha desarrollado activamente desde entonces. Esta es la versión oficial para Steam.",
        originalPrice_cents: 1000,
        currentPrice_cents: 800,
        launchDate: new Date(),
        coverImage: {
            id: 1,
            url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCookie_Clicker&psig=AOvVaw1WvxOfkMwoEjZDDeG2-iMB&ust=1715988990405000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCrhaOrk4YDFQAAAAAdAAAAABBA",
            alt: "Cookie Clicker",
        },
        descriptionImages: [
            {
                id: 2,
                url: "https://www.nme.com/wp-content/uploads/2021/08/Cookie-clicker-screenshot.jpg",
                alt: "Primera imagen",
            },
            {
                id: 3,
                url: "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2021/09/Cookie-Clicker-Long-Achievement.jpg",
                alt: "Segunda imagen",
            },
            {
                id: 4,
                url: "https://i.kinja-img.com/image/upload/c_fit,q_60,w_1315/f8099b7e053ebeff3c0f1b2e6d0c3cfc.jpg",
                alt: "Tercera imagen",
            },
            {
                id: 5,
                url: "https://www.godmindedgaming.com/images/screenshots/cookie_clicker_2.jpg",
                alt: "Cuarta imagen",
            },
            {
                id: 6,
                url: "https://preview.redd.it/started-playing-cookie-clicker-sharing-my-progress-after-24-v0-pl14hmzkzv4a1.jpg?auto=webp&s=487c4507cf20ccc54ec8eb46b4ea1f4b8dcb6325",
                alt: "Quinta imagen",
            },
            {
                id: 7,
                url: "https://i.blogs.es/56a3fa/20210907100634_1/450_1000.webp",
                alt: "Sexta imagen",
            }
        ],
        videos: [
            {
                id: 1,
                source: VideoSource.YOUTUBE,
                description: "Product 1 video",
                url: "https://www.youtube.com/watch?v=nq3GI-fK8fs",
                productId: null
            }
        ]
    },

]