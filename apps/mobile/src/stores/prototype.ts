import { create } from "zustand";
// Ephemeral visual review state. No identity, analytics, network, or persistence.
interface PrototypeState {
  name: string;
  stance: "Regular" | "Goofy";
  level: string;
  savedTrip: boolean;
  notice: string | null;
  updateProfile: (
    patch: Partial<Pick<PrototypeState, "name" | "stance" | "level">>,
  ) => void;
  toggleTrip: () => void;
  notify: (notice: string | null) => void;
}
export const usePrototype = create<PrototypeState>((set) => ({
  name: "Alex Morgan",
  stance: "Regular",
  level: "Intermediate",
  savedTrip: false,
  notice: null,
  updateProfile: (patch) => set(patch),
  toggleTrip: () => set((s) => ({ savedTrip: !s.savedTrip })),
  notify: (notice) => set({ notice }),
}));
