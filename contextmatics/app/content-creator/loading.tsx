import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-6 py-12 space-y-8">
            <div className="text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-[600px]" />
                <Skeleton className="h-[600px]" />
            </div>
        </div>
    );
}
