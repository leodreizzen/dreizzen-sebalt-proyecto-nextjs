import {Metadata} from "next";
import AdminLayoutClient from "@/app/layout-client";


export const metadata: Metadata = {
    title: {
        template: `%s | Vapor (Admin)`,
        default: "Admin"
    }
}

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>
}