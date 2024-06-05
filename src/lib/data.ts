import "server-only";
import { taintObjectReference } from 'next/dist/server/app-render/entry-base';
import prisma from './prisma';

export async function fetchUser( email: string ) {
    const data =  await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if(data)
        taintObjectReference("User data must not be exposed to the client side.", data)
    return data;
}