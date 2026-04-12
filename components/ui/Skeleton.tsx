import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    className = "", 
    variant = 'rect', 
    animation = 'pulse' 
}) => {
    const baseClasses = "bg-zinc-800/50";
    const animationClasses = animation === 'pulse' ? "animate-pulse" : animation === 'wave' ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent" : "";
    const variantClasses = variant === 'text' ? "h-4 w-full rounded" : variant === 'circle' ? "rounded-full" : "rounded-lg";

    return (
        <div className={`${baseClasses} ${animationClasses} ${variantClasses} ${className}`} />
    );
};

export const DashboardSkeleton = () => (
    <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
        </div>
    </div>
);
