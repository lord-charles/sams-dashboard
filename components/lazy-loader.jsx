import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const LazyLoader = () => {
    return (
        <div className="flex flex-col gap-8 bg-card">
            {/* Skeleton for the main content */}
            <div className="2xl:flex flex-none gap-4 w-full items-center">
                <div className="2xl:w-5/5 md:w-[90%]">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-4 grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4">
                                <Skeleton className="h-24 w-full rounded-lg" />
                                <Skeleton className="h-6 w-5/5 mt-2" />
                                <Skeleton className="h-6 w-3/4 mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="2xl:w-2/5 md:w-[90%]">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-44 w-full rounded-lg mt-4" />
                </div>
            </div>

        </div>
    );
};

export default LazyLoader;
