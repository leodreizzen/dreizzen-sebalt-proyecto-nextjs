import React, {ChangeEventHandler, HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute} from "react";
import clsx from "clsx";
import {FieldErrors, FieldName, FieldValues, UseFormRegisterReturn} from "react-hook-form";
import {ErrorMessage, FieldValuesFromFieldErrors} from "@hookform/error-message";
interface FormFieldProps<T extends FieldValues> {
    label: string;
    type: HTMLInputTypeAttribute;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    required?: boolean;
    value?: string;
    className?: string;
    registerRes:  UseFormRegisterReturn<FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>>
    errors: FieldErrors<T>
}

export function FormField<T extends FieldValues>({label, type, autoComplete, className, required, value, registerRes, errors}: FormFieldProps<T>) {
    const inputId = `input-${registerRes.name}`
    return (
        <div className={clsx("flex flex-col gap-0.5 min-w-0", className)}>
            <label htmlFor={inputId}><span>{label}</span> {required && <span className="text-red-300">*</span>}</label>
            <input type={type} className="text-black px-1 rounded-md" autoComplete={autoComplete}
                   required={required} value={value} {...registerRes} id={inputId}/>
            <ErrorMessage name={registerRes.name} errors={errors} as={<span className={"text-red-400"}/>}/>
        </div>
    )

}