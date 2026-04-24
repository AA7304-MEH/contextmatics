import { createClient } from '@/utils/supabase/server';
export const dynamic = 'force-dynamic';
import { 
  FileText, CalendarDays, Zap, Clock, Wand2, Sparkles, Youtube, 
  Video, Image as ImageIcon, MessageSquare, TrendingUp, Play,
  BarChart
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  // Fetch all stats in parallel
  const [
    profileReq,
    snippetsReq,
    scheduledReq,
    videosReq,
    assetsReq
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('snippets').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('scheduled_posts').select('*').eq('user_id', user.id).eq('status', 'scheduled').gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(5),
    supabase.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(2),
    supabase.from('monetisation_assets').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  ]);

  const profile = profileReq.data;
  const contentGenerated = snippetsReq.count || 0;
  const postsPublished = 0; // Derived from analytics in real app
  const creditsRemaining = profile?.credits_remaining || 0;
  const timeSavedHours = Math.round((contentGenerated * 20) / 60);

  // Fetch last 5 recent snippets
  const { data: recentSnippets } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const upcomingPosts = scheduledReq.data || [];
  const recentVideos = videosReq.data || [];
  const assetsCreated = assetsReq.count || 0;
  const isAyrshareConnected = Object.values(profile?.connected_platforms || {}).some(Boolean);

  const QUICK_ACTIONS = [
    { name: 'Write Post', icon: Wand2, href: '/content-creator', color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Repurpose', icon: Sparkles, href: '/repurpose', color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'YouTube Studio', icon: Youtube, href: '/repurpose-studio', color: 'text-red-400 bg-red-500/10' },
    { name: 'Schedule Posts', icon: CalendarDays, href: '/calendar', color: 'text-sky-400 bg-sky-500/10' },
    { name: 'Video Gen', icon: Video, href: '/video-generator', color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Logo Maker', icon: ImageIcon, href: '/logo-maker', color: 'text-pink-400 bg-pink-500/10' },
    { name: 'Hooks', icon: TrendingUp, href: '/hook-library', color: 'text-purple-400 bg-purple-500/10' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pt-20 md:pt-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
         <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
           <p className="text-zinc-400 mt-1">Welcome back, {profile?.full_name || 'Creator'}</p>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Content Generated', value: contentGenerated, icon: FileText, color: 'text-indigo-400' },
          { label: 'Posts Published', value: postsPublished, icon: CalendarDays, color: 'text-emerald-400' },
          { label: 'Credits Remaining', value: creditsRemaining, icon: Zap, color: creditsRemaining < 50 ? (creditsRemaining === 0 ? 'text-red-500' : 'text-amber-400') : 'text-amber-400' },
          { label: 'Time Saved', value: `${timeSavedHours}h`, icon: Clock, color: 'text-sky-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 flex flex-col hover:bg-zinc-900 transition-colors">
            <div className="flex items-center space-x-2 text-zinc-400 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs md:text-sm font-medium">{stat.label}</span>
            </div>
            <span className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 space-x-3 snap-x">
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} href={action.href} className="snap-start shrink-0">
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-[140px] h-[120px] flex flex-col justify-center items-center hover:bg-zinc-800 transition-colors group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white text-center">{action.name}</span>
               </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Generations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold text-white flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-400" /> Recent Generations</h2>
               <Link href="/snippets" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
            </div>
            <div className="space-y-4">
              {recentSnippets && recentSnippets.length > 0 ? (
                recentSnippets.map((snippet) => (
                  <div key={snippet.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                       <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{snippet.platform || 'General'}</span>
                          <span className="text-xs text-zinc-600">•</span>
                          <span className="text-xs text-zinc-600">{formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}</span>
                       </div>
                       <p className="text-sm text-zinc-300 line-clamp-2 md:line-clamp-1">{snippet.content.substring(0, 100)}...</p>
                     </div>
                     <Link href={`/content-creator?reuse=${snippet.id}`} className="shrink-0 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-white transition-colors text-center">Use again</Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                   No snippets generated yet. Click "Write Post" to start!
                </div>
              )}
            </div>
          </div>

          {/* Videos Row (Inside Left Column) */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold text-white flex items-center"><Video className="w-5 h-5 mr-2 text-rose-400" /> Recent Videos</h2>
               <Link href="/video-generator" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentVideos.length > 0 ? (
                recentVideos.map((video) => (
                  <div key={video.id} className="relative group rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-black flex items-center justify-center">
                     {video.thumbnail_url ? (
                       <img src={video.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                     ) : (
                       <div className="text-zinc-700 font-bold bg-zinc-950 w-full h-full flex items-center justify-center">No Thumbnail</div>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white mb-2" fill="white" />
                        <Link href={`/video-editor/${video.id}`} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg">Continue editing</Link>
                     </div>
                  </div>
                ))
              ) : (
                 <div className="col-span-1 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center aspect-video p-6 text-center text-zinc-500 text-sm">
                   Generate your first AI video to see it here.
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           {/* Upcoming Scheduled */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center mb-6"><CalendarDays className="w-5 h-5 mr-2 text-sky-400" /> Upcoming Posts</h2>
              <div className="space-y-3">
                 {upcomingPosts.length > 0 ? upcomingPosts.map((post) => (
                    <div key={post.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-start gap-3">
                       <div className="bg-sky-500/10 p-2 rounded-md shrink-0">
                          <CalendarDays className="w-4 h-4 text-sky-400" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-medium text-white line-clamp-1">{post.content}</p>
                          <p className="text-[10px] text-zinc-500 mt-1">{new Date(post.scheduled_at).toLocaleString()}</p>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
                       No upcoming posts.
                    </div>
                 )}
              </div>
           </div>

           {/* Monetisation Score */}
           <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles className="w-24 h-24 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2 relative z-10">Monetisation Studio</h2>
              <p className="text-sm text-indigo-200 mb-6 relative z-10">You've created <span className="font-bold text-white">{assetsCreated}</span> income-generating assets.</p>
              
              <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20 relative z-10">
                 <div className="flex items-center text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 mr-1" /> Next Opportunity
                 </div>
                 <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-4">
                    Based on your content, try generating a "Top 10 Tools" Lead Magnet to capture more email subscribers.
                 </p>
                 <Link href="/monetise" className="block w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center rounded-lg transition-colors">
                    Create Lead Magnet
                 </Link>
              </div>
           </div>

           {/* Content Performance */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center mb-6"><TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Performance</h2>
              {!isAyrshareConnected ? (
                 <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                       <BarChart className="w-6 h-6 text-zinc-500" />
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">Connect your social accounts to see real-time analytics and top performing posts.</p>
                    <Link href="/settings" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg inline-block">Connect Accounts</Link>
                 </div>
              ) : (
                 <div className="text-center py-4 text-zinc-500 text-sm">
                    Fetching latest metrics...
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
