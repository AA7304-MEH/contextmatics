import { 
  Wand2, 
  Sparkles, 
  Youtube, 
  CalendarDays, 
  Video, 
  ImageIcon, 
  TrendingUp 
} from 'lucide-react';

export default function DashboardLoading() {
  const QUICK_ACTIONS = [
    { name: 'Write Post', icon: Wand2 },
    { name: 'Repurpose', icon: Sparkles },
    { name: 'YouTube Studio', icon: Youtube },
    { name: 'Schedule Posts', icon: CalendarDays },
    { name: 'Video Gen', icon: Video },
    { name: 'Logo Maker', icon: ImageIcon },
    { name: 'Hooks', icon: TrendingUp },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pt-20 md:pt-8 w-full">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
         <div>
           <div className="h-8 w-40 bg-zinc-800 rounded-md animate-pulse mb-2" />
           <div className="h-4 w-60 bg-zinc-800/50 rounded-md animate-pulse" />
         </div>
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 flex flex-col">
            <div className="flex items-center space-x-2 text-zinc-600 mb-2">
              <div className="w-4 h-4 bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-3 w-24 bg-zinc-800 rounded-md animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-zinc-800 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <div className="h-6 w-32 bg-zinc-800 rounded-md animate-pulse mb-4" />
        <div className="flex overflow-x-hidden space-x-3 -mx-4 px-4 md:mx-0 md:px-0">
          {QUICK_ACTIONS.map((_action, i) => (
             <div key={i} className="shrink-0 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-[140px] h-[120px] flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse mb-3" />
                <div className="h-3 w-20 bg-zinc-800 rounded-md animate-pulse" />
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-zinc-800 rounded-sm animate-pulse" />
                  <div className="h-6 w-40 bg-zinc-800 rounded-md animate-pulse" />
               </div>
               <div className="h-4 w-12 bg-zinc-800 rounded-md animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="space-y-2 w-full">
                     <div className="flex items-center space-x-2 mb-1">
                        <div className="h-3 w-16 bg-zinc-800 rounded-md animate-pulse" />
                        <div className="h-3 w-3 bg-zinc-800 rounded-full animate-pulse" />
                        <div className="h-3 w-20 bg-zinc-800 rounded-md animate-pulse" />
                     </div>
                     <div className="h-4 w-3/4 bg-zinc-800 rounded-md animate-pulse" />
                   </div>
                   <div className="shrink-0 h-8 w-24 bg-zinc-800 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-zinc-800 rounded-sm animate-pulse" />
                  <div className="h-6 w-32 bg-zinc-800 rounded-md animate-pulse" />
               </div>
               <div className="h-4 w-12 bg-zinc-800 rounded-md animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                  <div className="w-5 h-5 bg-zinc-800 rounded-sm animate-pulse" />
                  <div className="h-6 w-36 bg-zinc-800 rounded-md animate-pulse" />
              </div>
              <div className="space-y-3">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-start gap-3">
                       <div className="w-8 h-8 rounded-md bg-zinc-800 animate-pulse shrink-0" />
                       <div className="space-y-2 w-full">
                          <div className="h-3 w-full bg-zinc-800 rounded-md animate-pulse" />
                          <div className="h-2 w-1/2 bg-zinc-800 rounded-md animate-pulse" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="border border-zinc-800 rounded-2xl p-6 relative overflow-hidden bg-zinc-900/20">
              <div className="h-6 w-48 bg-zinc-800 rounded-md animate-pulse mb-2" />
              <div className="h-4 w-32 bg-zinc-800 rounded-md animate-pulse mb-6" />
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                 <div className="h-3 w-24 bg-zinc-800 rounded-md animate-pulse mb-2" />
                 <div className="h-10 w-full bg-zinc-800 rounded-md animate-pulse mb-4" />
                 <div className="h-8 w-full bg-zinc-800 rounded-lg animate-pulse" />
              </div>
           </div>

           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                  <div className="w-5 h-5 bg-zinc-800 rounded-sm animate-pulse" />
                  <div className="h-6 w-32 bg-zinc-800 rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse mb-3" />
                 <div className="h-4 w-48 bg-zinc-800 rounded-md animate-pulse mb-4" />
                 <div className="h-8 w-32 bg-zinc-800 rounded-lg animate-pulse" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
