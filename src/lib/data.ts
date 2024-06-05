import "server-only";
import prisma from './prisma';

export async function fetchUser( email: string ) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })

}