import { Video, User } from "@/types";

// IMPORTANT —  API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Temporary mock user until Cognito/Auth is added
export const mockUser: User = {
  id: "creator1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  role: "creator",
};

/**
 * ---------------------------
 * Helper
 * ---------------------------
 */
async function jsonRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} - ${text}`);
  }
  return res.json();
}

/**
 * ---------------------------
 * REAL API
 * ---------------------------
 */
export const api = {
  /**
   * LOGIN (still mock for now)
   */
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email && password) return { user: mockUser, token: "mock-token" };
    throw new Error("Invalid credentials");
  },

  logout: async () => ({ success: true }),

  /**
   * -------------------------------------
   *  VIDEOS - REAL AWS BACKEND CONNECTED
   * -------------------------------------
   */

  /**
   * GET ALL VIDEOS
   * GET /videos  -> Lambda -> DynamoDB
   */
  getVideos: async (page = 1, limit = 10) => {
    const videos: Video[] = await jsonRequest(`${API_BASE_URL}/videos`);

    return {
      videos,
      page,
      limit,
      total: videos.length,
      hasMore: false,
    };
  },

  /**
   * GET SINGLE VIDEO
   * Currently pulls from list and finds match
   * (We can switch to /videos/:id later)
   */
  getVideo: async (id: string) => {
    const videos: Video[] = await jsonRequest(`${API_BASE_URL}/videos`);
    const video = videos.find((v: any) => v.videoId === id);
    if (!video) throw new Error("Video not found");
    return video;
  },

  /**
   * SEARCH
   * Currently client-side filtering
   * Upgrade later to backend search if needed
   */
  searchVideos: async (query: string) => {
    const videos: Video[] = await jsonRequest(`${API_BASE_URL}/videos`);

    const results = videos.filter((v: any) => {
      const text =
        `${v.title} ${v.caption} ${v.location ?? ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });

    return { videos: results, total: results.length };
  },

  /**
   * ----------------------------
   * UPLOAD VIDEO (REAL AWS FLOW)
   * ----------------------------
   *
   * 1️⃣ POST /upload-url  -> Lambda
   * 2️⃣ upload to S3 using signed URL
   * 3️⃣ POST /videos metadata
   */
  uploadVideo: async (formData: FormData) => {
    const file = formData.get("file") as File;
    const title = (formData.get("title") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const location = (formData.get("location") as string) || "";

    if (!file) throw new Error("No video file selected");

    // 1️⃣ request signed upload URL
    const uploadData = await jsonRequest(`${API_BASE_URL}/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        title,
        caption,
        location,
      }),
    });

    const { uploadUrl, videoId, key, videoUrl } = uploadData;

    // 2️⃣ upload video to S3 directly
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 3️⃣ save metadata in DynamoDB
    const saved = await jsonRequest(`${API_BASE_URL}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        title,
        caption,
        location,
        videoUrl,
        s3Key: key,
      }),
    });

    return saved.item ?? saved;
  },

  /**
   * Creator-specific list
   */
  getCreatorVideos: async (creatorId: string) => {
    const videos: any[] = await jsonRequest(`${API_BASE_URL}/videos`);
    return videos.filter((v) => v.creatorId === creatorId);
  },

  /**
   * -----------------------------------
   * COMMENTS & RATING (mock for now)
   * -----------------------------------
   */
  getComments: async (videoId: string) => {
    return [
      {
        id: "c1",
        videoId,
        userId: "user1",
        userName: "John Doe",
        userAvatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50",
        content: "This is amazing!",
        createdAt: new Date().toISOString(),
      },
    ];
  },

  postComment: async (videoId: string, content: string) => {
    return {
      id: `c${Date.now()}`,
      videoId,
      userId: mockUser.id,
      userName: mockUser.name,
      userAvatar: mockUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
  },

  rateVideo: async (videoId: string, rating: number) => {
    return { videoId, rating, success: true };
  },
};
