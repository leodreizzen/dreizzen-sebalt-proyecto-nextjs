import {kv} from "@vercel/kv";
import {garbageCollectPending} from "@/lib/actions/media-garbarge-collection";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    await kv.set("refresh", crypto.randomUUID());
    await garbageCollectPending();

    return Response.json({ success: true });
}