"use server"
import {
    purchaseEmailFields,
    purchaseEmailModel,
    purchaseInvoiceDataFields,
    purchaseInvoiceDataModel,
    purchasePaymentDataFieldsCoerced,
    purchasePaymentDataFieldsOriginal,
    purchasePaymentDataModel
} from "@/lib/purchase-zod-model";
import mercadoPago from "@/lib/mercadoPago";
import {fetchCartProducts} from "@/lib/data";
import {Product} from "@prisma/client";
import {z} from "zod";
import {PurchaseError, PurchaseResult} from "@/lib/definitions";
import {PaymentResponse} from "mercadopago/dist/clients/payment/commonTypes";
import {Payment, PaymentRefund} from "mercadopago";
import {v4 as uuidv4} from "uuid";
import {clearCart} from "@/lib/actions";

export async function purchase(form_emailData: purchaseEmailFields,
                               form_invoiceData: purchaseInvoiceDataFields,
                               form_paymentData: purchasePaymentDataFieldsOriginal,
                               form_idempotency_key: string): Promise<PurchaseResult> {
    const emailData = purchaseEmailModel.safeParse(form_emailData);
    const invoiceData = purchaseInvoiceDataModel.safeParse(form_invoiceData);
    const paymentData = purchasePaymentDataModel.safeParse(form_paymentData);
    const cartProducts = await fetchCartProducts();
    const cartAmount = cartProducts.reduce((acc, product) => acc + product.currentPrice_cents, 0);
    const idempotencyKey = z.string().length(36).safeParse(form_idempotency_key);
    //TODO AGREGAR CONDICION CON ITEMS DE CARRITO INVALIDOS
    if (cartAmount / 100 !== paymentData.data?.transaction_amount) {
        console.error("Cart amount does not match")
        return {success: false, error: PurchaseError.VALIDATION_ERROR}
    }

    if (!(emailData.success && invoiceData.success && paymentData.success && idempotencyKey.success)) {
        return {success: false, error: PurchaseError.VALIDATION_ERROR}
    } else {
        return await processPurchase(cartProducts, invoiceData.data, emailData.data, paymentData.data, idempotencyKey.data);
    }
}


async function processPurchase(cartProducts: Product[],
                               invoiceData: purchaseInvoiceDataFields,
                               emailData: purchaseEmailFields,
                               paymentData: purchasePaymentDataFieldsCoerced,
                               idempotencyKey: string): Promise<PurchaseResult> {
    let purchaseId
    let purchaseResult
    //TODO REVALIDAR RUTAS QUE DEPENDEN DE COMPRAS
    try {
        // For atomicity, save the purchase first, then process the payment
        // This protects against the case where the payment is successful but the purchase is not saved
        purchaseId = await saveUnpaidPurchase(cartProducts, invoiceData, emailData);

        purchaseResult = await processPayment(paymentData, cartProducts, invoiceData, idempotencyKey);
        if (purchaseResult.status === "approved") {
            savePaymentId(purchaseId, purchaseResult.id as number)
            try {
                await clearCart()
                //TODO ENVIAR EMAIL
            } catch (e) {
                // Don't rollback if this happens
                console.error(e)
            }
            return {success: true, purchaseId: purchaseId}
        } else {
            await deleteFailedPurchase(purchaseId)
            return {success: false, error: getErrorMessage(purchaseResult)};
        }
    } catch (e) {
        console.error(e)
        try {
            if (purchaseResult && purchaseResult.status === "approved" && purchaseResult.id) {
                console.log(await refundPayment(purchaseResult.id))
            }
            if (purchaseId) {
                // Only deletes if the paymentId was not saved.
                // If it is necessary to consider other errors, a Status field should be added to the purchase table
                await deleteFailedPurchase(purchaseId)
            }
        } catch (e) {
            console.error(e)
        }
        return {success: false, error: PurchaseError.PURCHASE_FAILED}
    }
}


async function saveUnpaidPurchase(products: Product[], invoiceData: purchaseInvoiceDataFields, emailData: purchaseEmailFields) {
    const createdPurchase = await prisma.purchase.create({
        data: {
            invoiceData: {
                create: {
                    email: emailData.email,
                    firstName: invoiceData.firstName,
                    lastName: invoiceData.lastName,
                    country: invoiceData.country,
                    state: invoiceData.state,
                    city: invoiceData.city,
                    address1: invoiceData.address1,
                    address2: invoiceData.address2,
                    customerId: invoiceData.id
                }
            },
            products: {
                create: products.map(product => ({
                    product: {
                        connect: {
                            id: product.id
                        }
                    },
                    originalPrice_cents: product.originalPrice_cents,
                    currentPrice_cents: product.currentPrice_cents
                }))
            }
        }
    })
    return createdPurchase.id
}

async function deleteFailedPurchase(purchaseId: number) {
    await prisma.purchase.deleteMany({
        where: {
            id: purchaseId,
            paymentId: null
        }
    })
}

async function processPayment(paymentData: purchasePaymentDataFieldsCoerced, cartProducts: Product[], invoiceData: purchaseInvoiceDataFields, idempotency_key: string): Promise<PaymentResponse> {
    const payments = new Payment(mercadoPago)
    return await payments.create({
        body: {
            description: "Payment for purchase in Vapor",
            installments: paymentData.installments,
            issuer_id: paymentData.issuer_id,
            payment_method_id: paymentData.payment_method_id,
            token: paymentData.token,
            transaction_amount: paymentData.transaction_amount,
            binary_mode: true,
            additional_info: {
                items: cartProducts.map(product => ({
                    id: product.id.toString(),
                    title: product.name,
                    description: product.description,
                    quantity: 1,
                    unit_price: product.currentPrice_cents / 100,
                }))
            },
            payer: {
                ...paymentData.payer,
                first_name: invoiceData.firstName,
                last_name: invoiceData.lastName,
            }
        },
        requestOptions: {
            idempotencyKey: idempotency_key
        }
    });
}


function savePaymentId(purchaseId: number, paymentId: number) {
    prisma.purchase.update({
        where: {
            id: purchaseId
        },
        data: {
            paymentId: paymentId
        }
    })
}

function getErrorMessage(paymentResponse: PaymentResponse) {
    if (paymentResponse.status_detail?.startsWith("cc_rejected_bad_filled")) {
        return PurchaseError.PAYMENT_REJECTED_BAD_FILLED
    } else if (paymentResponse.status_detail === "cc_rejected_call_for_authorize")
        return PurchaseError.PAYMENT_REJECTED_CALL_AUTHORIZE
    else
        return PurchaseError.PAYMENT_REJECTED_GENERIC
}

async function refundPayment(paymentId: number) {
    const refund = new PaymentRefund(mercadoPago)
    return await refund.create({
            payment_id: paymentId,
            requestOptions:{
                idempotencyKey: uuidv4()
            }
        }
    )
}
