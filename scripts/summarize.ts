import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv"
import prisma from "@/lib/prisma";
import fs from "fs";

dotenv.config()
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Please set the ANTHROPIC_API_KEY environment variable.")
    process.exit(1)

}
const MAX_RETRIES = 3
const anthropic = new Anthropic();

async function summarize(name: string, description: string, tagNames: string[]): Promise<string | null> {
    let retries = 0;
    let ok = false;
    do {
        const tagsXML = tagNames.map(tag => `<Tag>${tag}</Tag>`).join("")
        const prompt = `<Description>${description}</Description><Tags>${tagsXML}</Tags>`;
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 100,
            temperature: 0,
            system: "You will receive a description for a game, and you have to summarize it to get an appealing short description for a store. Max 150 characters, only 1 paragraph.\nThe description will be in html format, but you MUST output plain text without any html tags.\nYou will also be given a list of tags, which you can use to have more context.\nThe input will have this form:\n\n<Description>\nDESCRIPTION\n</Description>\n<Tags>\n<Tag>Tag1</Tag>\n<Tag>Tag2</Tag>\n</Tags>\n\nOutput only the summarized description, without any comments. If you can't answer, say \"NULL\"",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        });
        if (response.content[0].type == "text") {
            const msg = response.content[0].text
            if (msg.length < 30) {
                console.log("The model refused to generate a response, or it was too short. Retrying.")
            } else if (msg.length > 250) {
                console.log(`The response is too long (${msg.length} chars). Retrying.`)
            } else {
                ok = true;
                return msg
            }
        } else
            return null

        if (!ok) {
            if (retries >= MAX_RETRIES) {
                console.error(`Failed to summarize description for ${name}`)
                return null
            } else retries++
        }
    } while (!ok)
    return null
}


async function summarizeAll() {
    let summarizedProducts: {
        productId: number,
        productName: string,
        shortDescription: string | null
    }[] = []
    const productsToSummarize = await prisma.product.findMany({
        where: {
            OR: [
                {
                    shortDescription: ""
                },
                {
                    shortDescription: null
                }
            ]

        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    })
    console.log(productsToSummarize.map(p => p.name))
    for(let i = 0; i < productsToSummarize.length; i++){
        const product = productsToSummarize[i]
        console.log(`Summarizing ${product.name} (${(i / productsToSummarize.length*100).toFixed(2)}%)`)
        summarizedProducts.push({
            productId: product.id,
            productName: product.name,
            shortDescription: await summarize(product.name,
                product.description,
                product.tags.toSorted((t1, t2) => t1.productId - t2.order)
                    .map(tag => tag.tag.name))
        })
    }
    return summarizedProducts
}

summarizeAll().then(summarizedProducts => {
    console.log(summarizedProducts)
    fs.writeFile('summarizedProducts.json', JSON.stringify(summarizedProducts), 'utf8', console.log);
})