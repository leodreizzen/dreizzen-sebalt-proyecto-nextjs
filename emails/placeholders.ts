import {EmailProduct} from "./PurchaseEmail";
import {InvoiceData} from "@prisma/client";
import {PurchaseWithInvoiceData} from "@/lib/definitions";
import {randomUUID} from "node:crypto";

export const productPlaceholders: EmailProduct[] = [{
    productKey: "1234-5678-9012-3456",
    id: 1,
    name: "Cocoon",
    originalPrice_cents: 8600,
    currentPrice_cents: 8600,
    description: "<p>From Jeppe Carlsen, the lead gameplay designer of LIMBO and INSIDE — COCOON takes you on an adventure across worlds within worlds. Master world-leaping mechanics to unravel a cosmic mystery.</p>\n<p>Worlds within Worlds<br />\nCOCOON is a unique take on the puzzle adventure genre, where each world exists within an orb that you can carry on your back. Wrap your head around the core mechanic of leaping between worlds—and combine, manipulate, and rearrange them to solve intricate puzzles</p>\n<p>Alien Machinery<br />\nInteract with alien environments and biomechanical devices left behind by an ancient civilization. Journey through unique and diverse biomes, from industrial structures to massive organic caverns, and discover how they are connected to one another.</p>\n<p>Orb Abilities<br />\nEach orb has an ability that can be unlocked, thereby turning the orb into a unique tool for you to utilize within other worlds. Use these abilities to uncover hidden pathways and objects, fire projectiles to trigger switches, and more.</p>\n<p>Monstrous Guardians<br />\nMighty guardians protect every world, and you must face them in fierce battles. Each fight is unique and requires you to master new and satisfying mechanics.</p>",
    shortDescription: "",
    launchDate: new Date("2023-09-29T00:00:00.000Z"),
    coverImageId: 1,
    available: true,
    coverImage: {
        "id": 1,
        "url": "https://media.rawg.io/media/games/153/153e8d78ac19e959214dadefb8c27310.jpg",
        "alt": "Cover art for Cocoon",
        "inProductDescriptionId": null
    },
    downloadLink: "https://bit.ly/3XpvyDR"
},
    {
        "id": 2,
        "name": "Cookie Clicker",
        "originalPrice_cents": 3000,
        "currentPrice_cents": 3000,
        "description": "<p>Cookie Clicker is an idle clicker game with a baking theme. Bake cookies by clicking on a giant cookie. Use the collected cookies to buy upgrades. Which will get you even more cookies, and more, and more... you get the idea! Start by clicking the giant cookie to produce cookies – each time you click you generate one additional cookie. As your number of cookies increase you can purchase upgrades and a workforce.<br />\nThere are two categories of upgrades – Buildings and Upgrades. The buildings section includes various different items that automatically create cookies such as a cursor and grandma. The cost of these buildings increases incrementally. The upgrades section contains upgrades to improve your clicking rate and the amount of cookies you generate per click. This game is progressive and in no time at all you will be creating thousands of cookies and your popularity will grow! Can you create a cookie empire and sell your produce to millions?</p>",
        "shortDescription": "",
        "coverImageId": 7,
        "available": true,
        "coverImage": {
            "id": 7,
            "url": "https://media.rawg.io/media/games/8ba/8ba1178d043aa752838d68b14fffb922.jpg",
            "alt": "Cover art for Cookie Clicker",
            "inProductDescriptionId": null
        },
        productKey: "1234-5678-9012-3456",
        downloadLink: "https://bit.ly/3XpvyDR",
        launchDate: new Date("2023-09-29T00:00:00.000Z")
    }];

const invoiceDataPlaceholder: InvoiceData = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "a@a.com",
    address1: "1234 Main St",
    address2: "Suite 123",
    city: "Springfield",
    state: "IL",
    country: "USA",
    customerId: 12345678
}

export const purchasePlaceholder:PurchaseWithInvoiceData = {
    invoiceData: invoiceDataPlaceholder,
    paymentId: 10,
    id: 10,
    idempotencyKey: randomUUID(),
    invoiceDataId: 1
}