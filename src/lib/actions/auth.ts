"use server";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {CallbackRouteError} from "@auth/core/errors";

export async function authenticate(_: string | undefined, formData: FormData): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error instanceof CallbackRouteError && (error.cause?.err as {
                code?: string
            })?.code === "credentials") {
                return 'Usuario o contraseña incorrectos';
            } else {
                return 'Ocurrió un error. Intente de nuevo más tarde';
            }
        }
        throw error;
    }
}