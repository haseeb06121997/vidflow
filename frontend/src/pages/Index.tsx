import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Video } from "@/types";

type FilterType = "trending" | "latest" | "popular";

const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "latest", label: "Latest", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
];

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("trending");

  useEffect(() => {
    loadVideos();
  }, [activeFilter]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await api.getVideos();
      let sorted = [...response.videos];

      // 🔒 prevent crashes if backend doesn't send fields yet
      sorted = sorted.map((v: any) => ({
        ...v,
        likes: v.likes ?? 0,
        views: v.views ?? 0,
        createdAt: v.createdAt ?? new Date().toISOString(),
      }));

      // ⭐ FILTER SORTING
      switch (activeFilter) {
        case "latest":
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
          break;

        case "popular":
          sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
          break;

        case "trending":
        default:
          sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
          break;
      }

      setVideos(sorted);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover <span className="gradient-text">Amazing</span> Videos
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore trending content from creators around the world. Share your
            moments, connect with others.
          </p>
        </motion.section>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="gap-2"
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Video Grid */}
        <VideoGrid videos={videos} loading={loading} />

        {/* Load More (not real pagination yet — reload for now) */}
        {!loading && videos.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" onClick={loadVideos}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
