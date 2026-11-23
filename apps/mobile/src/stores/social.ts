import { normalizePersisted } from "../features/social/persistence";
import {
  applySwipe,
  undoSwipe,
  blockRider,
  appendMessage,
  type DemoSocialData,
} from "../features/social/logic";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "../services/storage";
import {
  defaultIdentity,
  eligibility,
  type Identity,
} from "../features/identity/model";
import {
  defaultRegion,
  type RegionPreferences,
} from "../features/regions/model";
import {
  defaultFilters,
  demoRepository,
  type DiscoveryFilters,
} from "../features/social/demoRepository";
export const DEMO_STORAGE_KEY = "snowmate:m1.1:demo:v1";
interface SocialState extends DemoSocialData {
  language: "en" | "zh";
  region: RegionPreferences;
  identity: Identity;
  filters: DiscoveryFilters;
  discoveryVisible: boolean;
  setLanguage: (language: "en" | "zh") => void;
  setRegion: (patch: Partial<RegionPreferences>) => void;
  updateIdentity: (patch: Partial<Identity>) => void;
  setFilters: (patch: Partial<DiscoveryFilters>) => void;
  swipe: (id: string, decision: "like" | "pass") => boolean;
  undo: () => void;
  block: (id: string) => void;
  send: (id: string, body: string) => void;
  resetViewed: () => void;
  setVisibility: (value: boolean) => void;
}
export const useSocial = create<SocialState>()(
  persist(
    (set, get) => ({
      language: "en",
      region: defaultRegion,
      identity: defaultIdentity,
      filters: defaultFilters,
      viewed: [],
      likes: [],
      matches: [],
      blocked: [],
      chats: {},
      lastSwipe: null,
      discoveryVisible: true,
      setLanguage: (language) => set({ language }),
      setRegion: (patch) => set((s) => ({ region: { ...s.region, ...patch } })),
      updateIdentity: (patch) =>
        set((s) => ({ identity: { ...s.identity, ...patch } })),
      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch } })),
      swipe: (id, decision) => {
        const s = get();
        if (
          eligibility(s.identity) ||
          !s.discoveryVisible ||
          !demoRepository.list(s.region, s.filters, s).some((r) => r.id === id)
        )
          return false;
        const next = applySwipe(s, id, decision);
        set(next);
        return next.lastSwipe?.matched === true;
      },
      undo: () => set((s) => undoSwipe(s)),
      block: (id) => set((s) => blockRider(s, id)),
      send: (id, body) => {
        if (!eligibility(get().identity))
          set((s) => appendMessage(s, id, body));
      },
      resetViewed: () => set({ viewed: [], likes: [], lastSwipe: null }),
      setVisibility: (discoveryVisible) => set({ discoveryVisible }),
    }),
    {
      name: DEMO_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      // Local demo only. Do not reuse this storage for tokens, real account authority or private raw motion.
      merge: (stored, current) => ({
        ...current,
        ...normalizePersisted(stored),
      }),
      partialize: (s) => ({
        language: s.language,
        region: s.region,
        identity: s.identity,
        filters: s.filters,
        viewed: s.viewed,
        likes: s.likes,
        matches: s.matches,
        blocked: s.blocked,
        chats: s.chats,
        discoveryVisible: s.discoveryVisible,
      }),
    },
  ),
);
