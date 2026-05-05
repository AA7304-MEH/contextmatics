import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 shadow-xl backdrop-blur-xl">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div className="space-y-4 w-full max-w-xs text-center mx-auto">
          <div className="h-2 w-full animate-pulse rounded-full bg-zinc-800" />
          <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-800 mx-auto" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-zinc-800/50 mx-auto" />
        </div>
      </div>
    </div>
  );
}
