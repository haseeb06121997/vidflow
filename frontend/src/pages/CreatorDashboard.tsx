import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  Video as VideoIcon,
  Eye,
  Heart,
  TrendingUp,
  Plus,
  MapPin,
  Users,
  X,
  FileVideo,
} from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Video } from "@/types";
import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [uploadForm, setUploadForm] = useState<{
    title: string;
    caption: string;
    location: string;
    people: string;
    file: File | null;
  }>({
    title: "",
    caption: "",
    location: "",
    people: "",
    file: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/creator/login");
      return;
    }

    loadVideos();
  }, [isAuthenticated, navigate]);

  const loadVideos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await api.getCreatorVideos(user.id);
      setVideos(data);
    } catch (error) {
      console.error("Failed to load videos:", error);
      toast.error("Failed to load your videos");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to upload");
      return;
    }

    if (!uploadForm.title || !uploadForm.caption) {
      toast.error("Please fill in title and caption");
      return;
    }

    if (!uploadForm.file) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("caption", uploadForm.caption);
      formData.append("location", uploadForm.location || "");
      formData.append("people", uploadForm.people || "");
      formData.append("file", uploadForm.file);
      formData.append("creatorId", user.id);

      await api.uploadVideo(formData, user.id);

      toast.success("Video uploaded successfully!");

      setShowUploadModal(false);
      setUploadForm({
        title: "",
        caption: "",
        location: "",
        people: "",
        file: null,
      });

      await loadVideos();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const totalViews = videos.reduce(
    (sum: number, v: any) => sum + (v.views ?? 0),
    0
  );

  const totalLikes = videos.reduce(
    (sum: number, v: any) => sum + (v.likes ?? 0),
    0
  );

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-primary"
            />

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Manage your videos and track performance
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowUploadModal(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Video
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Videos",
              value: videos.length,
              icon: VideoIcon,
            },
            {
              label: "Total Views",
              value: formatNumber(totalViews),
              icon: Eye,
            },
            {
              label: "Total Likes",
              value: formatNumber(totalLikes),
              icon: Heart,
            },
            {
              label: "Engagement",
              value: `${
                videos.length > 0 && totalViews > 0
                  ? ((totalLikes / totalViews) * 100).toFixed(1)
                  : 0
              }%`,
              icon: TrendingUp,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <stat.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="w-5 h-5" />
              Your Videos
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-32 h-20 rounded-lg bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary rounded w-1/2" />
                      <div className="h-3 bg-secondary rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No videos uploaded yet
                </p>

                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Upload Your First Video
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video: any, index) => (
                  <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-3 rounded-lg hover:bg-secondary/50 transition cursor-pointer"
                    onClick={() => navigate(`/watch/${video.videoId}`)}
                  >
                    <img
                      src={
                        video.thumbnailUrl ||
                        "https://via.placeholder.com/300x200?text=Video"
                      }
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{video.title}</h3>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {video.caption}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(video.views ?? 0)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatNumber(video.likes ?? 0)}
                        </span>

                        <span>
                          {video.createdAt
                            ? formatTimeAgo(video.createdAt)
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </CardTitle>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowUploadModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50">
                      <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            file: e.target.files?.[0] || null,
                          }))
                        }
                      />

                      <label htmlFor="video-upload" className="cursor-pointer">
                        <FileVideo className="w-12 h-12 mx-auto text-muted-foreground mb-2" />

                        {uploadForm.file ? (
                          <p className="text-sm font-medium">
                            {uploadForm.file.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm font-medium">
                              Click to upload video
                            </p>
                            <p className="text-xs text-muted-foreground">
                              MP4, WebM, MOV up to 100MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title *</label>
                      <Input
                        placeholder="Give your video a title"
                        value={uploadForm.title}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Caption *</label>
                      <Textarea
                        rows={3}
                        placeholder="Describe your video..."
                        value={uploadForm.caption}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            caption: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>

                      <Input
                        placeholder="Where was this filmed?"
                        value={uploadForm.location}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        People in video
                      </label>

                      <Input
                        placeholder="@user1, @user2"
                        value={uploadForm.people}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            people: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setShowUploadModal(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
