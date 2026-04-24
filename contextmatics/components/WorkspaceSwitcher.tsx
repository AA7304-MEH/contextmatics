'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Building2, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);
  const setActiveWorkspace = useAppStore((state) => state.setActiveWorkspace);
  const plan = useAppStore((state) => state.plan);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadWorkspaces() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('workspaces')
        .select('*, workspace_members!inner(user_id)')
        .eq('workspace_members.user_id', user.id);

      if (data) setWorkspaces(data);
    }
    loadWorkspaces();
  }, [supabase]);

  const activeWorkspace = activeWorkspaceId 
    ? workspaces.find(w => w.id === activeWorkspaceId) 
    : { id: null, name: 'Personal Workspace' };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400">
            {activeWorkspaceId ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
          </div>
          <span className="truncate">{activeWorkspace?.name || 'Personal Workspace'}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-zinc-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl">
            <button
              onClick={() => {
                setActiveWorkspace(null);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-zinc-500" />
                Personal Workspace
              </div>
              {!activeWorkspaceId && <Check className="h-4 w-4 text-indigo-500" />}
            </button>

            {workspaces.length > 0 && <div className="my-1 h-px bg-zinc-800" />}
            
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4 text-zinc-500" />
                  <span className="truncate max-w-[150px]">{ws.name}</span>
                </div>
                {activeWorkspaceId === ws.id && <Check className="h-4 w-4 text-indigo-500" />}
              </button>
            ))}

            <div className="my-1 h-px bg-zinc-800" />

            <button
              onClick={() => {
                if (plan === 'agency' || plan === 'enterprise') {
                  router.push('/settings/team?new=true');
                } else {
                  window.dispatchEvent(new CustomEvent('contextmatic:upgrade-required', { detail: { reason: 'workspaces' } }));
                }
                setIsOpen(false);
              }}
              className="flex w-full items-center rounded-md p-2 text-left text-sm text-indigo-400 hover:bg-zinc-900 hover:text-indigo-300 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Workspace
            </button>
          </div>
        </>
      )}
    </div>
  );
}
