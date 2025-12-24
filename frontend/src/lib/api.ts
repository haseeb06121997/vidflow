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
 * Small helper to make JSON requests and surface useful errors
 */
async function jsonRequest<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    // Helps a LOT when debugging Lambda / API Gateway
    throw new Error(`API Error: ${res.status} - ${text}`);
  }

  // If body is empty (204 etc) just return null
  const text = await res.text();
  if (!text) return null as T;

  return JSON.parse(text) as T;
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
    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email && password) {
      return { user: mockUser, token: "mock-token" };
    }

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
      hasMore: false, // no real pagination yet
    };
  },

  /**
   * GET SINGLE VIDEO
   * Right now: fetches all and finds the one we need.
   * (We can switch to /videos/:id later)
   */
  getVideo: async (id: string) => {
    const videos: any[] = await jsonRequest(`${API_BASE_URL}/videos`);

    const video =
      videos.find((v) => v.videoId === id) ||
      videos.find((v) => v.id === id); // fallback shape

    if (!video) throw new Error("Video not found");
    return video as Video;
  },

  /**
   * SEARCH
   * Currently client-side filtering
   */
  searchVideos: async (query: string) => {
    const videos: any[] = await jsonRequest(`${API_BASE_URL}/videos`);

    const q = query.toLowerCase();

    const results = videos.filter((v) => {
      const text = `${v.title ?? ""} ${v.caption ?? ""} ${v.location ?? ""}`.toLowerCase();
      return text.includes(q);
    });

    return { videos: results as Video[], total: results.length };
  },

  /**
   * ----------------------------
   * UPLOAD VIDEO (REAL AWS FLOW)
   * ----------------------------
   *
   * 1️⃣ POST /upload-url  -> Lambda (returns signed URL + ids)
   * 2️⃣ PUT to S3 using signed URL (browser → S3, no backend hop)
   * 3️⃣ POST /videos -> save metadata in DynamoDB
   */
  uploadVideo: async (formData: FormData, creatorIdOverride?: string) => {
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const location = (formData.get("location") as string) || "";
    const creatorId =
      (formData.get("creatorId") as string) ||
      creatorIdOverride ||
      mockUser.id;

    if (!file) {
      throw new Error("No video file selected");
    }

    // 1️⃣ ask backend for signed upload URL
    const uploadData = await jsonRequest<{
      uploadUrl: string;
      videoId: string;
      key: string;
      videoUrl: string;
    }>(`${API_BASE_URL}/upload-url`, {
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

    // 2️⃣ upload file directly to S3
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    // 3️⃣ save metadata in DynamoDB
    const saved = await jsonRequest<any>(`${API_BASE_URL}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        title,
        caption,
        location,
        videoUrl,
        s3Key: key,
        creatorId, // <— important: so /videos can be filtered per creator
      }),
    });

    // Lambda returns { message, item } in our code
    return (saved.item ?? saved) as Video;
  },

  /**
   * Creator-specific list
   * (Currently just filters the list returned by GET /videos)
   */
  getCreatorVideos: async (creatorId: string) => {
    const videos: any[] = await jsonRequest(`${API_BASE_URL}/videos`);

    // If backend doesn’t yet save creatorId, this will just return all videos.
    const filtered =
      videos.some((v) => "creatorId" in v)
        ? videos.filter((v) => v.creatorId === creatorId)
        : videos;

    return filtered as Video[];
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
:contentReference[oaicite:0]{index=0}
