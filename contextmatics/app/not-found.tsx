import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-8xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Page not found</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
