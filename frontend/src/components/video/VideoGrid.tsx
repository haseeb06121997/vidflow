import { Video } from "@/types";
import { VideoCard } from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
}

export function VideoGrid({ videos, loading = false }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[9/16] rounded-xl bg-secondary" />
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded" />
                  <div className="h-3 bg-secondary rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  );
}
