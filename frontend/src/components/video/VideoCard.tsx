import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Eye, Heart, MapPin } from "lucide-react";
import { Video } from "@/types";
import { formatNumber, formatTimeAgo } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  index?: number;
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/watch/${video.id}`} className="group block">
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-secondary">
          <video
            src={video.videoUrl}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
            poster="https://via.placeholder.com/400x700?text=Loading..."
            />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow"
            >
              <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
            </motion.div>
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatNumber(video.likes)}
              </span>
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-background/80 text-xs font-medium">
            0:30
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-start gap-2">
            <img
              src={video.creatorAvatar}
              alt={video.creatorName}
              className="w-8 h-8 rounded-full border border-border flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {video.creatorName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{formatNumber(video.views)} views</span>
                <span>•</span>
                <span>{formatTimeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {video.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pl-10">
              <MapPin className="w-3 h-3" />
              {video.location}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
