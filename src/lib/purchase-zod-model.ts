import {z} from "zod";

export const purchaseEmailModel = z.object({
    email: z.string().email("Enter a valid email address"),
    email_confirm: z.string().email("Enter a valid email address")
}).refine(
    data => data.email === data.email_confirm,
    {
        message: "Emails don't match",
        path: ["email_confirm"]
    })

export type purchaseEmailFields = z.infer<typeof purchaseEmailModel>


export const purchaseInvoiceDataModel = z.object({
    id: z.coerce.number({errorMap: (e)=> {
            return {message: "Enter a valid ID"}
        }})
        .int().nonnegative().positive("Enter your id").gte(1000000).lte(1000000000),
    firstName: z.string().min(1, {message: "Enter your name"}),
    lastName: z.string().min(1, {message: "Enter your last name"}),
    country: z.string().min(1, {message: "Enter your country"}),
    state: z.string().min(1, {message: "Enter your province or state"}),
    city: z.string().min(1, {message: "Enter your city"}),
    address1: z.string().min(1, {message: "Enter your address"}),
    address2: z.string().optional()
    })

export type purchaseInvoiceDataFields = z.infer<typeof purchaseInvoiceDataModel>

export const purchasePaymentDataModel = z.object({
    token: z.string(),
    issuer_id: z.coerce.number(),
    payment_method_id: z.string(),
    transaction_amount: z.number(),
    installments: z.number(),
    payer: z.object({
        email: z.string().email(),
        identification: z.object({
            type: z.string(),
            number: z.string()
        })
    }),
    payment_method_option_id: z.string().optional(),
    processing_mode: z.string().optional()
    })


export interface purchasePaymentDataFieldsCoerced extends z.infer<typeof purchasePaymentDataModel>{}

export interface purchasePaymentDataFieldsOriginal extends Omit<z.infer<typeof purchasePaymentDataModel>, "issuer_id">{
    issuer_id: string
}