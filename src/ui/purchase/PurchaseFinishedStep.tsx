import {PurchaseResult} from "@/lib/definitions";


export default function PurchaseFinishedStep({purchaseResult}: {purchaseResult: PurchaseResult}){
    return(
        <div>{JSON.stringify(purchaseResult)}</div>
    )
}