import {
    Column,
    Container,
    Html,
    Img,
    Row,
    Section,
    Tailwind,
    Text,
    Head,
    Button,
    Body,
    Link
} from "@react-email/components";
import * as React from "react";
import {Heading} from "@react-email/components";
import tailwindConfig from "../tailwind.config";
import {ProductWithCoverImage, PurchaseWithInvoiceData} from "@/lib/definitions";
import {productPlaceholders, purchasePlaceholder} from "./placeholders";
import {formatPrice} from "@/util/formatUtils";

const tailwindConfigResolved = resolveConfig(tailwindConfig)
import clsx from "clsx";
import resolveConfig from "tailwindcss/resolveConfig";


export interface EmailProduct extends ProductWithCoverImage {
    productKey: string;
    downloadLink: string;
}

const totalPlaceholder = productPlaceholders.reduce((acc, product) => acc + product.currentPrice_cents, 0);

//@ts-ignore
const primaryColor = tailwindConfigResolved.theme.colors.primary;
//@ts-ignore
const bgColor = tailwindConfigResolved.theme.colors.background;
//@ts-ignore
const fgColor = tailwindConfigResolved.theme.colors.foreground;

export default function PurchaseEmail(props:
                                          {
                                              products: EmailProduct[],
                                              purchase: PurchaseWithInvoiceData,
                                              total_cents: number
                                          }) {
    const {products, purchase, total_cents} = Object.keys(props).length > 0 ? props :
        {products: productPlaceholders, purchase: purchasePlaceholder, total_cents: totalPlaceholder} //Placeholder for preview


    return (
        <Tailwind config={{...tailwindConfig}}>

            <Head>
                <style>
                    {`
            body {
              background-color: ${bgColor};
              color: ${fgColor}
            }
          `}
                </style>
            </Head>
            <Html>
                <EmailBodyFix className="bg-background text-foreground">
                    <Container className="p-1">
                        <Section align="center">
                            <Heading as="h1" mx="auto"><Link href="https://vaporstore.vercel.app"
                                                             className="text-foreground no-underline text-center">Vapor</Link></Heading>
                            <Heading className="!mb-2" as="h2" mx="auto">Thanks for purchasing</Heading>
                            <Text className="!mb-0">Hello, {purchase.invoiceData.firstName}:</Text>
                            <Text className="!mt-0">Thanks for your purchase in Vapor. Below you will find a summary of
                                your order and the download links for your products.</Text>
                            <Text>Purchase ID: #{purchase.id}</Text>
                            <Section align="center">
                                {products.map((product, index) => (
                                    <Row key={product.id} align="center" className={clsx(index > 0 && "mt-4")}>
                                        <Column align="center"
                                                className="bg-content1 rounded-2xl overflow-clip py-2">
                                            <CenterRow>
                                                <Img height={100} src={product.coverImage.url}
                                                     alt={product.coverImage.alt}
                                                     className="rounded-2xl overflow-clip mb-1"
                                                />
                                            </CenterRow>
                                            <CenterRow>{product.name}</CenterRow>
                                            <CenterRow> Key: {product.productKey}</CenterRow>
                                            <CenterRow>{formatPrice(product.currentPrice_cents)}</CenterRow>
                                            <CenterRow> <Button style={buttonStyle}
                                                                href={product.downloadLink}>Download
                                                now</Button></CenterRow>
                                        </Column>
                                    </Row>
                                ))}
                            </Section>
                            <Section>
                                <Text className="!mb-0 text-medium">Total amount: {formatPrice(total_cents)}</Text>
                                <Text className="!mt-1">Payment ID: #{purchase.paymentId}</Text>
                            </Section>
                        </Section>
                    </Container>
                </EmailBodyFix>
            </Html>
        </Tailwind>

    )
        ;
}

const buttonStyle = {
    padding: "5px",
    marginTop: "5px",
    backgroundColor: primaryColor,
    color: fgColor,
    borderRadius: "10px"
}


const EmailBodyFix = ({children, style, className}: {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}) => {
    return (
        <Body>
            <table width="100%" style={style} className={clsx(className)}>
                <tbody>
                <tr style={{width: "100%"}}>
                    <td>{children}</td>
                </tr>
                </tbody>
            </table>
        </Body>
    )
}

// Fix to work in Gmail
function CenterRow({children}: { children: React.ReactNode }) {
    return (
        <table align="center">
            <tbody>
            <tr>
                <td align="center">
                    <Row align="center">
                        {children}
                    </Row>
                </td>
            </tr>
            </tbody>
        </table>
    )
}