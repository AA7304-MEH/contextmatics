export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
