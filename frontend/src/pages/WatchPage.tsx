import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Users,
  Star,
  Send,
  ArrowLeft,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Video, Comment } from "@/types";
import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadVideo(id);
      loadComments(id);
    }
  }, [id]);

  const loadVideo = async (videoId: string) => {
    try {
      const data = await api.getVideo(videoId);
      setVideo(data);
    } catch (error) {
      console.error("Failed to load video:", error);
      toast.error("Failed to load video");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (videoId: string) => {
    try {
      const data = await api.getComments(videoId);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      const comment = await api.postComment(id, newComment);
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  const handleRate = async (rating: number) => {
    if (!id) return;
    setUserRating(rating);
    try {
      await api.rateVideo(id, rating);
      toast.success(`Rated ${rating} stars!`);
    } catch (error) {
      toast.error("Failed to rate video");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed like" : "Liked!");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="animate-pulse space-y-6">
            <div className="aspect-[9/16] max-w-lg mx-auto rounded-xl bg-secondary" />
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="h-8 bg-secondary rounded w-2/3" />
              <div className="h-4 bg-secondary rounded w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!video) return null;

  return (
    <Layout>
      <div className="container py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Video Section */}
          <div className="space-y-6">
            <div className="max-w-lg mx-auto lg:max-w-none">
              <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} autoPlay />
            </div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>

              {/* Creator Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={video.creatorAvatar}
                    alt={video.creatorName}
                    className="w-12 h-12 rounded-full border-2 border-primary/50"
                  />
                  <div>
                    <p className="font-semibold">{video.creatorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "secondary"}
                    size="sm"
                    onClick={handleLike}
                    className="gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    {formatNumber(video.likes + (isLiked ? 1 : 0))}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Caption */}
              <Card className="p-4">
                <p className="text-foreground">{video.caption}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {video.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {video.location}
                    </span>
                  )}
                  {video.people && video.people.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {video.people.join(", ")}
                    </span>
                  )}
                </div>
              </Card>

              {/* Rating */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-2">Rate this video</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= userRating
                                ? "text-primary fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">
                      {video.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto hide-scrollbar">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
