import {User as VaporUser} from "@prisma/client"
import { JWT } from "next-auth/jwt"
import {CredentialsInputs} from "next-auth/providers/credentials"

declare module 'next-auth' {
    interface User extends Omit<VaporUser, "id">{
        id?: string | undefined
    }
    interface Session {
        user: User
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        isAdmin: boolean
    }
}
