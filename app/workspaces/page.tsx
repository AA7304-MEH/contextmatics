"use client";

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Layout, Settings, Shield, Trash2, UserPlus, X, ChevronRight, Briefcase, Sparkles } from 'lucide-react';
import { Profile, Workspace, WorkspaceMember } from '@/types/database';

interface WorkspaceWithRole {
    role: string;
    status: string;
    workspace: Workspace;
}

interface MemberWithProfile extends WorkspaceMember {
    profile: Partial<Profile> | null;
}

export default function WorkspacesPage() {
    const { user: authUser } = useAuth();
    const user = authUser as unknown as Profile | null;
    const { showToast } = useToast();
    const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWsName, setNewWsName] = useState('');
    
    // Member management state
    const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);
    const [members, setMembers] = useState<MemberWithProfile[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
    const [isInviting, setIsInviting] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    useEffect(() => {
        if (user?.id) {
            fetchWorkspaces();
        }
    }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchWorkspaces = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('workspace_members')
                .select(`
                    role,
                    status,
                    workspace:workspace_id (
                        id,
                        name,
                        brand_voice,
                        brand_description,
                        created_at,
                        owner_id,
                        plan,
                        ayrshare_profile_key
                    )
                `)
                .eq('user_id', user?.id);

            if (error) throw error;
            setWorkspaces((data as unknown as WorkspaceWithRole[]) || []);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error loading workspaces';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWsName.trim()) return;

        try {
            const res = await fetch('/api/workspaces/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newWsName })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create workspace');
            
            showToast('Workspace created successfully! 🎉', 'success');
            setShowCreateModal(false);
            setNewWsName('');
            fetchWorkspaces();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error';
            showToast(msg, 'error');
        }
    };

    const fetchMembers = async (wsId: string) => {
        try {
            const { data, error } = await supabase
                .from('workspace_members')
                .select(`
                    id,
                    role,
                    status,
                    invited_email,
                    workspace_id,
                    user_id,
                    created_at,
                    profile:user_id (
                        id,
                        full_name,
                        email,
                        avatar_url
                    )
                `)
                .eq('workspace_id', wsId);

            if (error) throw error;
            setMembers((data as unknown as MemberWithProfile[]) || []);
        } catch (error: unknown) {
            showToast('Failed to load members', 'error');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim() || !selectedWs) return;

        setIsInviting(true);
        try {
            const res = await fetch('/api/workspaces/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteEmail,
                    workspace_id: selectedWs.id,
                    role: inviteRole
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Invite failed');

            showToast(`Invitation sent to ${inviteEmail} 📧`, 'success');
            setInviteEmail('');
            fetchMembers(selectedWs.id);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error';
            showToast(msg, 'error');
        } finally {
            setIsInviting(false);
        }
    };

    const selectWorkspaceForManagement = (ws: Workspace) => {
        setSelectedWs(ws);
        fetchMembers(ws.id);
    };

    return (
        <PageLayout>
            <SEO title="Agency Workspaces | ContextMatic" description="Manage your teams, clients, and collaboration hubs." />
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto flex flex-col gap-12">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Agency Workspaces</h1>
                            <p className="text-lg text-text-secondary">Manage your teams, clients, and collaboration hubs.</p>
                        </div>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary px-8 py-4 flex items-center gap-2 text-base font-bold shadow-lg hover:shadow-brand-primary/20"
                        >
                            <Plus className="w-5 h-5" /> New Workspace
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: Workspaces List */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest pl-2">Your Workspaces</h3>
                            {loading ? (
                                <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-t-2 border-brand-primary rounded-full"></div></div>
                            ) : (
                                <div className="space-y-3">
                                    {workspaces.map((entry) => (
                                        <button
                                            key={entry.workspace.id}
                                            onClick={() => selectWorkspaceForManagement(entry.workspace)}
                                            className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between group transition-all ${selectedWs?.id === entry.workspace.id ? 'bg-brand-primary/10 border-brand-primary shadow-lg' : 'bg-background-surface/50 border-white/5 hover:border-white/10 hover:bg-background-surface'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedWs?.id === entry.workspace.id ? 'bg-brand-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-white transition-colors'}`}>
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-brand-primary transition-colors">{entry.workspace.name}</div>
                                                    <div className="text-xs text-text-muted font-medium capitalize">{entry.role} • {entry.status}</div>
                                                </div>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedWs?.id === entry.workspace.id ? 'text-brand-primary translate-x-1' : 'text-text-muted opacity-0 group-hover:opacity-100'}`} />
                                        </button>
                                    ))}
                                    {workspaces.length === 0 && (
                                        <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-text-secondary italic">
                                            No workspaces found. Create one to get started!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Selected Workspace Details / Members */}
                        <div className="lg:col-span-8">
                            {selectedWs ? (
                                <div className="card bg-background-surface/50 border border-white/5 p-8 animate-fade-in-up">
                                    <div className="flex justify-between items-start mb-10 text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                                                <Layout className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-white">{selectedWs.name}</h2>
                                                <p className="text-text-secondary text-sm">Created on {new Date(selectedWs.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                                            <Settings className="w-5 h-5 text-text-muted hover:text-white" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                        {/* Invite Section */}
                                        <div className="card bg-black/20 p-6 border border-white/5 text-left">
                                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                                <UserPlus className="w-4 h-4 text-brand-primary" /> Invite Member
                                            </h4>
                                            <form onSubmit={handleInvite} className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-2 block">Email Address</label>
                                                    <input 
                                                        type="email"
                                                        value={inviteEmail}
                                                        onChange={(e) => setInviteEmail(e.target.value)}
                                                        placeholder="collaborator@example.com"
                                                        className="input w-full p-3 bg-black/40 border-white/10 rounded-xl"
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-2 block">Role</label>
                                                        <select 
                                                            value={inviteRole}
                                                            onChange={(e) => setInviteRole(e.target.value as any)}
                                                            className="input w-full p-3 bg-black/40 border-white/10 rounded-xl text-sm"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="editor">Editor</option>
                                                            <option value="viewer">Viewer</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button 
                                                            type="submit"
                                                            disabled={isInviting || !inviteEmail}
                                                            className="btn btn-primary px-6 h-[46px] disabled:opacity-50"
                                                        >
                                                            {isInviting ? 'Sending...' : 'Invite'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Brand Settings Section */}
                                        <div className="card bg-black/20 p-6 border border-white/5 text-left flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-amber-400" /> Shared Brand Persona
                                                </h4>
                                                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                                                    Members of this workspace will automatically use these voice guidelines for all generations.
                                                </p>
                                                <div className="text-xs font-mono p-3 bg-white/5 rounded-lg border border-white/5 text-text-muted h-24 overflow-y-auto">
                                                    {selectedWs.brand_description || 'No description set. Update in workspace settings.'}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <span className="text-[10px] uppercase font-bold tracking-tighter px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                                                    Voice: {selectedWs.brand_voice || 'Neutral'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Members Table */}
                                    <div className="text-left">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-400" /> Team Members
                                        </h4>
                                        <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">User</th>
                                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">Role</th>
                                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {members.map((member) => (
                                                        <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold uppercase">
                                                                        {member.profile?.full_name?.[0] || member.profile?.email?.[0] || member.invited_email?.[0] || 'A'}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-bold text-white">{member.profile?.full_name || 'Pending User'}</div>
                                                                        <div className="text-[10px] text-text-muted">{member.profile?.email || member.invited_email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${member.role === 'owner' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                                    {member.role}
                                                                </span>
                                                                {member.status === 'pending' && <span className="ml-2 text-[9px] text-text-muted italic">(Invited)</span>}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {member.role !== 'owner' && (
                                                                    <button className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors">
                                                                        <Trash2 className="w-4 h-4 text-text-muted group-hover:text-red-500" />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-background-surface/30">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <Briefcase className="w-10 h-10 text-text-muted" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Select a Workspace</h3>
                                    <p className="text-text-secondary text-sm max-w-xs mx-auto mb-8">
                                        Choose a workspace from the list to manage its members, settings, and shared brand configurations.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-background-surface border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-bold text-white">New Workspace</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateWorkspace} className="p-8 space-y-6 text-left">
                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-2 block">Workspace Name</label>
                                    <input 
                                        type="text"
                                        value={newWsName}
                                        onChange={(e) => setNewWsName(e.target.value)}
                                        placeholder="Phoenix Marketing Team"
                                        className="input w-full p-4 bg-black/40 border-white/10 rounded-xl"
                                        autoFocus
                                    />
                                    <p className="text-[10px] text-text-muted mt-2 italic">A workspace allows shared projects, billing, and team members.</p>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary flex-1 py-4 justify-center">Cancel</button>
                                    <button type="submit" disabled={!newWsName.trim()} className="btn btn-primary flex-1 py-4 justify-center">Create ✨</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
