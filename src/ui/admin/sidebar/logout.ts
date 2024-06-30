"use server"
import {signOut} from "@/auth";


export async function manageLogout() {
    await signOut();
}