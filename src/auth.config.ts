import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            if (!isLoggedIn) {
                return false
            } else
                return !!auth?.user?.isAdmin
        },
        session({session, token, user}) {
            session.user.isAdmin = token.isAdmin
            return session
        },
        jwt({token, user, account, profile}) {
            if (user)
                token.isAdmin = user.isAdmin
            return token
        },
        redirect({url, baseUrl}) {
            const urlObject = new URL(url)
            const callbackUrl = urlObject.searchParams.get('callbackUrl')
            if (callbackUrl) {
                url = callbackUrl
            }

            // default behavior
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl

        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;