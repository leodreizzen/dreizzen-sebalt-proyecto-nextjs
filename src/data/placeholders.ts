import { Product } from "@prisma/client";
import { ProductDTO, ImageDTO, VideoSource, TagDto, FeaturedTagDTO } from "./DTO";

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
            url: "https://onigamers.com/wp-content/uploads/2021/08/Cookie-Clicker.jpg",
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
                alt: "Product 1 video",
                sourceId: "nq3GI-fK8fs",
                thumbnail: {
                    id: 8,
                    url: "https://i3.ytimg.com/vi/nq3GI-fK8fs/hqdefault.jpg",
                    alt: "Product 1 video thumbnail",
                }
            },
            {
                id: 2,
                source: VideoSource.CLOUDINARY,
                alt: "Product 1 video",
                sourceId: "ejlzzt3ad1kxbbmvmgt8",
                thumbnail: {
                    id: 9,
                    url: "https://i.ytimg.com/vi/D9nZ6wzrcBg/maxresdefault.jpg",
                    alt: "Product 1 video thumbnail",
                }
            }
        ]
    },
    {
        id: 2,
        name: "Hollow Knight",
        description: `
        Hollow Knight es una aventura de acción clásica en 2D ambientada en un vasto mundo interconectado. Explora cavernas tortuosas, ciudades antiguas y páramos mortales. Combate contra criaturas corrompidas, haz amistad con extraños insectos y resuelve los antiguos misterios que yacen en el corazón de reino.
        Características del juego
        Acción clásica de desplazamiento lateral, con todos los avances modernos.
        Controles para 2D perfectamente ajustados. Esquiva, corre y golpea para abrirte camino incluso frente a los adversarios más mortales.
        Explora un vasto mundo interconectado de caminos olvidados, vegetación salvaje y ciudades en ruinas.
        ¡Forja tu propio camino! El mundo de Sacronido es extenso y abierto. Elige qué rutas seguir, a qué enemigos enfrentarte y encuentra tu propio camino.
        ¡Evoluciona con habilidades nuevas y poderosas! Adquiere hechizos, fuerza y velocidad. Llega a nuevas alturas con las alas etéreas. Avanza rápidamente en un destello fulminante. ¡Acaba con los enemigos con el Alma Ígnea!
        ¡Equipa amuletos! Antiguas reliquias que proporcionan poderes y habilidades extrañas. ¡Elige las que prefieras y emprende un viaje único!
        Un inmenso elenco de personajes adorables y extraños que cobran vida gracias a una animación tradicional fotograma a fotograma en 2D.
        ¡Más de 130 enemigos! ¡30 jefes épicos! Enfréntate a bestias feroces y vence a caballeros antiguos durante tu búsqueda a través del reino. ¡Rastrea hasta el último enemigo y añádelo a tu Diario del Cazador!
        Entra en sus mentes con el Aguijón Onírico. Descubre un lado nuevo de los personajes con los que te encuentres y de los enemigos a los que te enfrentes.
        Los bellos paisajes coloreados con una perspectiva extravagante consiguen que este mundo transmita una sensación de profundidad.
        Registra tu viaje con numerosas herramientas de cartografía. Compra brújulas, plumas, mapas y marcadores para entender mejor los paisajes serpenteantes de Hollow Knight.
        Una banda sonora íntima e inquietante, compuesta por Christopher Larkin, acompaña al jugador durante su viaje. La música evoca la majestuosidad y tristeza de una civilización llevada a la ruina.
        Completa Hollow Knight para desbloquear el modo Alma de acero, ¡el desafío definitivo!
        `,
        shortDescription: "¡Forja tu propio camino en Hollow Knight! Una aventura épica a través de un vasto reino de insectos y héroes que se encuentra en ruinas. Explora cavernas tortuosas, combate contra criaturas corrompidas y entabla amistad con extraños insectos, todo en un estilo clásico en 2D dibujado a mano.",
        originalPrice_cents: 740756,
        currentPrice_cents: 740756,
        launchDate: new Date(),
        coverImage: {
            id: 10,
            url: "https://images3.alphacoders.com/806/806257.jpg",
            alt: "Cookie Clicker",
        },
        descriptionImages: [
            {
                id: 11,
                url: "https://assets1.ignimgs.com/thumbs/2017/02/12/3-8bca6c464b8df7acc024a45a83443096-1486939880/frame_0001.jpg",
                alt: "Primera imagen",
            },
            {
                id: 12,
                url: "https://i.ytimg.com/vi/guiYMjOVnOo/maxresdefault.jpg",
                alt: "Segunda imagen",
            },
            {
                id: 13,
                url: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/hollow-knight-wiki/1/13/Hornet_6.png?width=1280",
                alt: "Tercera imagen",
            },
            {
                id: 14,
                url: "https://miro.medium.com/v2/da:true/resize:fit:1200/0*MtLRck7UuzvvMuO4",
                alt: "Cuarta imagen",
            },

        ],
        videos: [
            {
                id: 3,
                source: VideoSource.YOUTUBE,
                alt: "Product 2 video",
                sourceId: "UAO2urG23S4",
                thumbnail: {
                    id: 15,
                    url: "https://img.youtube.com/vi/UAO2urG23S4/default.jpg",
                    alt: "Product 2 video thumbnail",
                }
            },
        ]
    },

]


export const tagPlaceholders: TagDto[] = [
    {
        id: 1,
        name: "Acción",
        inDropdown: true
    },
    {
        id: 2,
        name: "Deportes",
        inDropdown: true
    },
    {
        id: 3,
        name: "Aventura",
        inDropdown: true
    },
    {
        id: 4,
        name: "Simulación",
        inDropdown: true
    },
    {
        id: 5,
        name: "Estrategia",
        inDropdown: true
    },
    {
        id: 6,
        name: "Terror",
        inDropdown: true
    }
]


export const featuredTagsPlaceholders: FeaturedTagDTO[] = [
    {
        tag: tagPlaceholders[0],
        image: {
            id: 16,
            url: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png",
            alt: "Logo de Elden Ring",
        }
    }, {
        tag: tagPlaceholders[1],
        image: {
            id: 17,
            url: "https://image.api.playstation.com/vulcan/ap/rnd/202310/0214/2d303f56b705633886b50c56e34f12de0ff12d0453c10623.png",
            alt: "Logo de FC24",
        }
    }, {
        tag: tagPlaceholders[2],
        image: {
            id: 18,
            url: "https://cdn.cloudflare.steamstatic.com/steam/apps/72850/header.jpg",
            alt: "Logo de Skyrim",
        }
    },
    {
        tag: tagPlaceholders[3],
        image: {
            id: 19,
            url: "https://cdn.cloudflare.steamstatic.com/steam/apps/227300/capsule_616x353.jpg",
            alt: "Logo de Euro Truck Simulator 2"
        }
    },
    {
        tag: tagPlaceholders[4],
        image: {
            id: 20,
            url: "https://image.api.playstation.com/gs2-sec/appkgo/prod/CUSA15381_00/1/i_8d2404a5e0689b9e5e8e833773152215e991801c8979def7c86e31ecadfe2e83/i/icon0.png",
            alt: "Logo de Civilization VI"
        }
    }, {
        tag: tagPlaceholders[5],
        image: {
            id: 21,
            url: "https://assets1.ignimgs.com/2014/06/19/outlast-buttonjpg-b68b20.jpg",
            alt: "Logo de Outlast"
        }
    }
]