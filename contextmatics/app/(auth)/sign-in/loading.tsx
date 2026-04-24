import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="flex w-full max-w-sm flex-col items-center justify-center space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div className="space-y-2 text-center">
          <div className="h-6 w-32 animate-pulse rounded-md bg-zinc-800" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-zinc-800/50" />
        </div>
      </div>
    </div>
  );
}
