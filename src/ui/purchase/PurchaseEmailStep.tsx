import {FormField} from "@/ui/purchase/FormField";
import clsx from "clsx";
import {UseFormReturn} from "react-hook-form";
import {purchaseEmailFields} from "@/lib/purchase-zod-model";
import {useEffect} from "react";


export default function PurchaseEmailStep({className, methods: {register, watch, trigger, formState: {errors, dirtyFields}}}: {
    className?: string,
    methods: UseFormReturn<purchaseEmailFields>
}) {
    const emailValue = watch("email");
    useEffect(() => {
        if(dirtyFields.email)
            trigger("email_confirm").then();
    }, [emailValue, dirtyFields.email, trigger]);

    return (
        <div className={clsx(className, "flex flex-col")}>
            <p>We need your email address to send you the download links for your games.<br/> <strong>Make sure to enter
                a valid address</strong></p>
            <form className="flex flex-col gap-2 mt-2">
                <FormField label="Enter your email address" type="email" registerRes={register("email")} errors={errors}
                           autoComplete="shipping email"/>
                <FormField label="Confirm your email address" type="email" registerRes={register("email_confirm")} errors={errors}
                            autoComplete="shipping email" className={clsx(!dirtyFields.email && "hidden")}/>
            </form>
        </div>
    )
}