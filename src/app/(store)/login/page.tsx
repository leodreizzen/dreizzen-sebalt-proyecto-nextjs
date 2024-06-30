import {auth, signOut} from "@/auth";
import LoginForm from "@/ui/LoginForm";
import {redirect} from "next/navigation";

export default async function LoginPage() {
    const session = await auth()
    if(session) {
        if(session.user.isAdmin)
            redirect("/admin")
        else
            await signOut()  // For now, non-admin users are not supported
    }

    return (
        <LoginForm/>
    )
}