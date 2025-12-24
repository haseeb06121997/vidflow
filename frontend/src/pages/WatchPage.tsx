import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

interface Video {
  videoId: string;
  title: string;
  caption?: string;
  videoUrl: string;
  createdAt?: string;
}

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        if (!id) {
          setError("Missing video id");
          setLoading(false);
          return;
        }

        const data = await api.getVideo(id);
        setVideo(data);
      } catch (err: any) {
        console.error("Failed to load video:", err);
        setError(err?.message || "Video not found");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading video...
      </div>
    );

  if (error || !video)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p className="mb-4 text-xl">❌ {error || "Video not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-pink-500 rounded-md"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button onClick={() => navigate(-1)} className="mb-4 underline">
        ← Back
      </button>

      <div className="flex flex-col items-center">
        <video
          src={video.videoUrl}
          controls
          playsInline
          muted={false}
          className="w-full max-w-4xl rounded-xl shadow-lg"
          poster={video.videoUrl}
        />

        <h1 className="mt-4 text-2xl font-bold">{video.title}</h1>
        {video.caption && (
          <p className="mt-2 opacity-80 max-w-3xl text-center">
            {video.caption}
          </p>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
