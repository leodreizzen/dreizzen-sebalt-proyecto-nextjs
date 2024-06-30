import "server-only";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { fetchUser } from '@/lib/data';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(1) })
                .safeParse(credentials);
            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await fetchUser(email);
                if (user && await bcrypt.compare(password, user.passwordHash)) {
                    return {...user, id: user.id.toString()};
                } else
                    return null;
            }
            return null;
        }
    })]
});