import { demoRepository } from "./demoRepository";
export interface ChatMessage {
  id: string;
  author: "you" | "rider";
  body: string;
}
export interface DemoSocialData {
  viewed: string[];
  likes: string[];
  matches: string[];
  blocked: string[];
  chats: Record<string, ChatMessage[]>;
  lastSwipe: { id: string; matched: boolean } | null;
}
export const initialSocial: DemoSocialData = {
  viewed: [],
  likes: [],
  matches: [],
  blocked: [],
  chats: {},
  lastSwipe: null,
};
export function applySwipe(
  s: DemoSocialData,
  id: string,
  decision: "like" | "pass",
): DemoSocialData {
  if (s.viewed.includes(id) || s.blocked.includes(id)) return s;
  const matched =
    decision === "like" &&
    demoRepository.mutualLike(id) &&
    !s.matches.includes(id);
  return {
    ...s,
    viewed: [...s.viewed, id],
    likes: decision === "like" ? [...new Set([...s.likes, id])] : s.likes,
    matches: matched ? [...s.matches, id] : s.matches,
    chats: matched
      ? {
          ...s.chats,
          [id]: [
            {
              id: "greeting",
              author: "rider",
              body: "Hi! Ready for a mountain day? This is a fictional demo chat.",
            },
          ],
        }
      : s.chats,
    lastSwipe: { id, matched },
  };
}
export function undoSwipe(s: DemoSocialData): DemoSocialData {
  if (!s.lastSwipe || s.blocked.includes(s.lastSwipe.id)) return s;
  const id = s.lastSwipe.id;
  // A conversation containing authored messages is no longer undoable; avoid silent message deletion.
  if (s.lastSwipe.matched && s.chats[id]?.some((m) => m.author === "you"))
    return s;
  const chats = { ...s.chats };
  if (s.lastSwipe.matched) delete chats[id];
  return {
    ...s,
    viewed: s.viewed.filter((v) => v !== id),
    likes: s.likes.filter((v) => v !== id),
    matches: s.lastSwipe.matched
      ? s.matches.filter((v) => v !== id)
      : s.matches,
    chats,
    lastSwipe: null,
  };
}
export function blockRider(s: DemoSocialData, id: string): DemoSocialData {
  const chats = { ...s.chats };
  delete chats[id];
  return {
    ...s,
    blocked: [...new Set([...s.blocked, id])],
    matches: s.matches.filter((v) => v !== id),
    chats,
    lastSwipe: null,
  };
}
export function appendMessage(
  s: DemoSocialData,
  id: string,
  body: string,
): DemoSocialData {
  const text = body.trim();
  if (
    !s.matches.includes(id) ||
    s.blocked.includes(id) ||
    !text ||
    text.length > 2000
  )
    return s;
  return {
    ...s,
    chats: {
      ...s.chats,
      [id]: [
        ...(s.chats[id] ?? []).slice(-499),
        {
          id: `local-${Number(s.chats[id]?.at(-1)?.id.match(/\d+$/)?.[0] ?? 0) + 1}`,
          author: "you",
          body: text,
        },
      ],
    },
  };
}
