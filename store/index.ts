import { create } from 'zustand';

interface AppState {
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string | null) => void;
  credits: number;
  setCredits: (n: number) => void;
  plan: string;
  setPlan: (plan: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceId: null,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  credits: 0,
  setCredits: (n) => set({ credits: n }),
  plan: 'free',
  setPlan: (plan) => set({ plan }),
}));
