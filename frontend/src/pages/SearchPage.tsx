import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Video } from "@/types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.searchVideos(searchQuery);
      setVideos(response.videos);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
    setVideos([]);
    setHasSearched(false);
  };

  return (
    <Layout>
      <div className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Search <span className="gradient-text">Videos</span>
          </h1>

          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, caption, location, or people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          {/* Popular searches */}
          {!hasSearched && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Popular searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["dance", "cooking", "travel", "pets", "music"].map((term) => (
                  <Button
                    key={term}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {loading
                  ? "Searching..."
                  : `${videos.length} result${videos.length !== 1 ? "s" : ""} for "${query}"`}
              </h2>
            </div>

            <VideoGrid videos={videos} loading={loading} />
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
