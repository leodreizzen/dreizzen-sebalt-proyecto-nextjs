import {PurchaseError, PurchaseResult} from "@/lib/definitions";
import clsx from "clsx";
import {IoCheckmarkCircleOutline} from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import Link from "next/link";
import {Button} from "@nextui-org/button";

export default function PurchaseFinishedStep({purchaseResult, className, onRetry}: {
    purchaseResult: PurchaseResult,
    className?: string,
    onRetry: () => void
}) {
    if (purchaseResult.success)
        return <PurchaseSuccess className={className} purchaseResult={purchaseResult}/>
    else
        return <PurchaseFailed className={className} purchaseResult={purchaseResult} onRetry={onRetry}/>
}

function PurchaseSuccess({className, purchaseResult}: {
    className?: string,
    purchaseResult: PurchaseResult & { success: true }
}) {
    return <div className={clsx(className, "flex flex-col items-center")}>
        <div className="w-3/12 aspect-square text-secondary my-2">
            <IoCheckmarkCircleOutline className="size-full"/>
        </div>
        <div>
            <h2 className="font-bold">Thanks for your purchase!</h2>
            <p>You will receive an email with the download links for your games</p>
            <p>If you don`t see it, check your spam folder</p>
            <p>Purchase id: #{purchaseResult.purchaseId}</p>
            <Button as={Link} href="/" color="primary" className="mt-2">Return to home</Button>
        </div>
    </div>
}

function PurchaseFailed({className, purchaseResult, onRetry}: { className?: string, purchaseResult: PurchaseResult & { success: false }, onRetry: () => void }) {
    return (
        <div className={clsx(className, "flex flex-col items-center")}>
            <div className="w-4/12 aspect-square text-red-500 my-2">
                <VscError className="size-full"/>
            </div>
            <div>
                <h2 className="font-bold">We could not process your purchase</h2>
                <PurchaseErrorMessage purchaseResult={purchaseResult}/>
                <Button color="primary" onPress={onRetry}>Try again</Button>

            </div>
        </div>
    )
}

function PurchaseErrorMessage({purchaseResult}: { purchaseResult: PurchaseResult & { success: false } }) {
    switch (purchaseResult.error) {
        case PurchaseError.PAYMENT_REJECTED_CALL_AUTHORIZE:
            return <p className="text-justify">{`You need to call your card's issuer to authorize this transaction. Call the number in the back of
                your card and try again.`}</p>
        case PurchaseError.PAYMENT_REJECTED_GENERIC:
            return <p>Your payment was rejected. You can try again with another payment method, or retry later.</p>
        case PurchaseError.VALIDATION_ERROR:
            return <p>There was an error validating your information. Check your information and try again.</p>
        case PurchaseError.PURCHASE_FAILED:
            return <p>There was an error processing your purchase. Please try again later.</p>
        case PurchaseError.PAYMENT_REJECTED_BAD_FILLED:
            return <p>Your payment information is incorrect. Please correct it and try again</p>
    }
}