"use server"
import {signOut} from "@/auth";


export async function manageLogout(redirect: boolean = true) {
    await signOut({redirect: redirect});
}