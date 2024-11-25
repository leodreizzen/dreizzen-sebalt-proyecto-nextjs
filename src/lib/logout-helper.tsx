"use client"
import {useEffect} from "react";
import {manageLogout} from "@/ui/admin/sidebar/logout";
import {useRouter} from "next/navigation";

export function LogoutHelper(){
    const router = useRouter();
    useEffect(()=>{
        manageLogout(false)
            .then(router.refresh)
            .catch(console.error);
    }, [router.refresh]);
    return <></>
}