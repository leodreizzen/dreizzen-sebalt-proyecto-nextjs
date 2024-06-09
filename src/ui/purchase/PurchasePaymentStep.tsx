"use client"
import "../mercadoPago.css"
import {initMercadoPago, Payment} from "@mercadopago/sdk-react";
import clsx from "clsx";

let mpPublicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
if (!mpPublicKey)
    throw new Error("NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY not set")
initMercadoPago(mpPublicKey, {locale: "en-US"})

export default function PurchasePaymentStep({amount_cents, className}: { amount_cents: number, className?:string}){

    return <div className={clsx(className)}>
        <Payment
            onSubmit={async()=>{}}
            initialization={{amount: amount_cents / 100}}
            customization={{
                paymentMethods: {creditCard: "all", debitCard: "all"},
                visual: {
                    style: {
                        theme: "dark",
                        customVariables: {
                            formBackgroundColor: "transparent",
                        }
                    },
                    hidePaymentButton: true,
                }
            }}

        />
    </div>
}