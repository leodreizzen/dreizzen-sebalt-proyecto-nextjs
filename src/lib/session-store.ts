import 'server-only';
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";

type SessionId = string;

export function getSessionId(): SessionId | undefined {
  const cookieStore = cookies();
  return cookieStore.get("session-id")?.value;
}

function setSessionId(sessionId: SessionId): void {
  const cookieStore = cookies();
  cookieStore.set("session-id", sessionId);
}

export function getSessionIdAndCreateIfMissing() {
  const sessionId = getSessionId();
  if (!sessionId) {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    return newSessionId;
  }

  return sessionId;
}

export function get(key: string, namespace: string = "") {
  const sessionId = getSessionId();
  if (!sessionId) {
    return null;
  }
  return kv.hget(`session-${namespace}-${sessionId}`, key);
}

export function getAll(namespace: string = "") {
  const sessionId = getSessionId();
  if (!sessionId) {
    return null;
  }
  return kv.hgetall(`session-${namespace}-${sessionId}`);
}

export async function set(key: string, value: any, namespace: string = "") {
  const sessionId = getSessionIdAndCreateIfMissing();
  const hName = `session-${namespace}-${sessionId}`
  await kv.hset(hName, { [key]: value });
  await kv.expire(hName, 60 * 60 * 24 * 7);
}
