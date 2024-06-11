"use client"
import PurchaseInvoiceDataStep from "@/ui/purchase/PurchaseInvoiceDataStep";
import React, {useState} from "react";
import PurchasePaymentStep from "@/ui/purchase/PurchasePaymentStep";
import PurchaseEmailStep from "@/ui/purchase/PurchaseEmailStep";
import PurchaseFinishedStep from "@/ui/purchase/PurchaseFinishedStep";
import FormProgressIndicator from "@/ui/purchase/FormProgressIndicator";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    purchaseEmailFields,
    purchaseEmailModel,
    purchaseInvoiceDataFields,
    purchaseInvoiceDataModel
} from "@/lib/purchase-zod-model";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {purchase} from "@/lib/paymentAction"
import {ICardPaymentBrickPayer, ICardPaymentFormData} from "@mercadopago/sdk-react/bricks/cardPayment/type";
import {v4 as uuidv4} from "uuid";
import {PurchaseError, PurchaseResult} from "@/lib/definitions";

enum PurchaseStep {
    EMAIL,
    INVOICE_DATA,
    PAYMENT,
    FINISHED,
}

function generateIdempotencyKey() {
    return uuidv4()
}

declare global {
    var paymentBrickController: {
        getFormData: () => Promise<{ formData: ICardPaymentFormData<Required<ICardPaymentBrickPayer>> | null }>
    } | undefined
}

export default function PurchaseForm({amount_cents}: { amount_cents: number }) {
    const [step, setStep] = React.useState<PurchaseStep>(PurchaseStep.EMAIL)
    const emailMethods = useForm<purchaseEmailFields>({resolver: zodResolver(purchaseEmailModel), mode: "all"})
    const invoiceDataMethods = useForm<purchaseInvoiceDataFields>({
        resolver: zodResolver(purchaseInvoiceDataModel),
        mode: "all"
    })
    const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey())
    const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | undefined>()
    const router = useRouter();
    const [finishButtonClicked, setFinishButtonClicked] = useState(false)

    function handleReturnToCart() {
        router.push("/cart")
    }

    async function handleNavigateNext() {
        switch (step) {
            case PurchaseStep.EMAIL:
                await emailMethods.trigger()
                if (emailMethods.formState.isValid)
                    setStep(PurchaseStep.INVOICE_DATA)
                break;
            case PurchaseStep.INVOICE_DATA:
                await invoiceDataMethods.trigger()
                if (invoiceDataMethods.formState.isValid)
                    setStep(PurchaseStep.PAYMENT)
                break;
        }
    }

    function handleNavigatePrevious() {
        switch (step) {
            case PurchaseStep.INVOICE_DATA:
                setStep(PurchaseStep.EMAIL)
                break;
            case PurchaseStep.PAYMENT:
                setStep(PurchaseStep.INVOICE_DATA)
                break;
        }

    }

    async function handleFinish() {
        if (!finishButtonClicked) {
            if (globalThis.paymentBrickController) {
                const paymentData = (await globalThis.paymentBrickController.getFormData()).formData
                if (paymentData) {
                    setFinishButtonClicked(true)
                    const result = await purchase(emailMethods.getValues(), invoiceDataMethods.getValues(), paymentData, idempotencyKey)
                    if(!(!result.success && result.error === PurchaseError.DUPLICATE_PURCHASE)){
                        setPurchaseResult(result)
                        setStep(PurchaseStep.FINISHED)
                    }
                }
            }
        }
    }

    function handleRetry() {
        if (purchaseResult?.success === false) {
            if (purchaseResult.error !== PurchaseError.VALIDATION_ERROR) {
                setIdempotencyKey(generateIdempotencyKey());
                setPurchaseResult(undefined);
                setFinishButtonClicked(false)
                setStep(PurchaseStep.PAYMENT);
            } else
                window.location.reload()
        }
    }

    let stepContent;
    switch (step) {
        case PurchaseStep.EMAIL:
            stepContent = <PurchaseEmailStep methods={emailMethods} className="w-full"/>
            break;
        case PurchaseStep.INVOICE_DATA:
            stepContent = <PurchaseInvoiceDataStep methods={invoiceDataMethods} className="w-full"/>
            break;
        case PurchaseStep.PAYMENT:
            stepContent = <PurchasePaymentStep amount_cents={amount_cents} className="w-full"/>
            break;
        case PurchaseStep.FINISHED:
            stepContent = purchaseResult ?
                <PurchaseFinishedStep purchaseResult={purchaseResult} onRetry={handleRetry} className="w-full"/> : null
            break;
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <h1 className="text-xl">Purchase</h1>
            <div
                className="flex flex-col items-center mx-4 xs:w-9/12 sm:w-7/12 md:w-5/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mt-2 mb-2">
                <FormProgressIndicator currentStep={step}
                                       steps={["Email", "Invoice data", "Payment", purchaseResult?.success !== false ? "Finished" : "Error"]}
                                       className="w-full mb-3"/>
                {stepContent}
                <div className="flex gap-2 justify-between w-full mt-4">
                    <div>
                        {step === PurchaseStep.EMAIL &&
                            <Button onPress={handleReturnToCart} color="primary">Return to cart</Button>}
                        {step !== PurchaseStep.EMAIL && step !== PurchaseStep.FINISHED &&
                            <Button onPress={handleNavigatePrevious} color="primary">Previous</Button>}
                    </div>
                    {step !== PurchaseStep.PAYMENT && step !== PurchaseStep.FINISHED &&
                        <Button onPress={handleNavigateNext} color="primary">Next</Button>}
                    {step === PurchaseStep.PAYMENT &&
                        <Button onPress={handleFinish} color="secondary" isDisabled={finishButtonClicked}>
                            Finish purchase
                        </Button>
                    }
                </div>
            </div>
        </div>

    )
}
