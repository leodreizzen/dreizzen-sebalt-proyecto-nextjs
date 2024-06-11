import React from "react";
import {FormField} from "@/ui/purchase/FormField";
import {UseFormReturn} from "react-hook-form";
import {purchaseInvoiceDataFields} from "@/lib/purchase-zod-model";
import clsx from "clsx";

export default function PurchaseInvoiceDataStep({methods: {register, formState: {errors}}, className}: {
    methods: UseFormReturn<purchaseInvoiceDataFields>,
    className?: string
}) {
    return (
        <div className={clsx(className, "flex flex-col")}>
            <h2 className="text-large font-bold">Invoice data</h2>
            <form className="flex flex-col min-[375px]:grid gap-y-2 gap-x-4 mt-1">
                <FormField label="ID number" type="number" registerRes={register("id")} errors={errors}
                           className="col-span-2" required/>
                <FormField label="First name" type="text" registerRes={register("firstName")} errors={errors} required/>
                <FormField label="Last name" type="text" registerRes={register("lastName")} errors={errors} required/>

                <FormField label="Country" type="text" className="col-span-2" registerRes={register("country")}
                           errors={errors}
                           autoComplete="billing country-name" required/>
                <FormField label="Province / state" type="text" autoComplete="billing address-level1"
                           registerRes={register("state")} errors={errors}
                           required/>
                <FormField label="City" type="text" autoComplete="billing address-level2" registerRes={register("city")}
                           errors={errors}
                           required/>
                <FormField label="Address (line 1)" type="text" autoComplete="address-line1"
                           registerRes={register("address1")}
                           errors={errors} required/>
                <FormField label="Address (line 2)" type="text" autoComplete="address-line2"
                           registerRes={register("address2")}
                           errors={errors}/>
            </form>
        </div>
    )
}
