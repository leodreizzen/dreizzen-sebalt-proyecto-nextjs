import {auth, signOut} from "@/auth";
import LoginForm from "@/ui/LoginForm";
import {redirect} from "next/navigation";
import {LogoutHelper} from "@/lib/logout-helper";

export default async function LoginPage() {
    const session = await auth()
    if(session) {
        if(session.user.isAdmin)
            redirect("/admin")
        else
            return <LogoutHelper/>  // For now, non-admin users are not supported
    }

    return (
        <LoginForm/>
    )
}