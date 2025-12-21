import { Video, User } from "@/types";

// Mock data for development
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Epic Sunset Timelapse",
    caption: "Captured this stunning sunset from the rooftop. The colors were absolutely unreal! 🌅",
    thumbnailUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    location: "Los Angeles, CA",
    people: ["@nature_lover", "@photo_pro"],
    creatorId: "creator1",
    creatorName: "Alex Johnson",
    creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    views: 125400,
    likes: 8900,
    comments: 342,
    rating: 4.7,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Street Dance Battle",
    caption: "When the music hits different! 🔥 #dance #streetstyle",
    thumbnailUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    location: "New York, NY",
    people: ["@dancer_mike", "@beatbox_queen"],
    creatorId: "creator2",
    creatorName: "Maya Rodriguez",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    views: 89000,
    likes: 5600,
    comments: 189,
    rating: 4.5,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "3",
    title: "Cooking Pasta Like a Pro",
    caption: "My secret recipe for the perfect carbonara 🍝 #cooking #food",
    thumbnailUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    location: "Rome, Italy",
    people: ["@chef_marco"],
    creatorId: "creator3",
    creatorName: "Marco Bellini",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: 234000,
    likes: 15200,
    comments: 567,
    rating: 4.9,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "4",
    title: "Mountain Hiking Adventure",
    caption: "Reached the summit after 6 hours! Worth every step 🏔️ #hiking #adventure",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    location: "Swiss Alps",
    people: ["@mountain_mike", "@adventure_anna"],
    creatorId: "creator1",
    creatorName: "Alex Johnson",
    creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    views: 67800,
    likes: 4300,
    comments: 156,
    rating: 4.6,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "5",
    title: "Cat Does Tricks",
    caption: "Teaching my cat to high-five! 🐱 #cats #pets #funny",
    thumbnailUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    location: "Portland, OR",
    people: ["@whiskers_the_cat"],
    creatorId: "creator4",
    creatorName: "Sarah Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    views: 456000,
    likes: 32100,
    comments: 1245,
    rating: 4.8,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "6",
    title: "Urban Skateboarding",
    caption: "New trick unlocked! 🛹 #skateboarding #urban #sports",
    thumbnailUrl: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    location: "San Francisco, CA",
    people: ["@sk8r_boy"],
    creatorId: "creator5",
    creatorName: "Jake Wilson",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    views: 98700,
    likes: 7400,
    comments: 289,
    rating: 4.4,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export const mockUser: User = {
  id: "creator1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  role: "creator",
};

// API placeholder functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    // Placeholder for POST /auth/login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email && password) {
      return { user: mockUser, token: "mock-token-123" };
    }
    throw new Error("Invalid credentials");
  },

  logout: async () => {
    // Placeholder for POST /auth/logout
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  // Videos
  getVideos: async (page = 1, limit = 10) => {
    // Placeholder for GET /videos
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      videos: mockVideos,
      page,
      limit,
      total: mockVideos.length,
      hasMore: false,
    };
  },

  getVideo: async (id: string) => {
    // Placeholder for GET /videos/:id
    await new Promise((resolve) => setTimeout(resolve, 500));
    const video = mockVideos.find((v) => v.id === id);
    if (!video) throw new Error("Video not found");
    return video;
  },

  searchVideos: async (query: string) => {
    // Placeholder for GET /videos/search
    await new Promise((resolve) => setTimeout(resolve, 600));
    const results = mockVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.caption.toLowerCase().includes(query.toLowerCase()) ||
        v.location?.toLowerCase().includes(query.toLowerCase()) ||
        v.people?.some((p) => p.toLowerCase().includes(query.toLowerCase()))
    );
    return { videos: results, total: results.length };
  },

  uploadVideo: async (formData: FormData) => {
    // Placeholder for POST /upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newVideo: Video = {
      id: String(mockVideos.length + 1),
      title: formData.get("title") as string,
      caption: formData.get("caption") as string,
      thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=600&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      location: formData.get("location") as string,
      people: (formData.get("people") as string)?.split(",").map((p) => p.trim()) || [],
      creatorId: mockUser.id,
      creatorName: mockUser.name,
      creatorAvatar: mockUser.avatar,
      views: 0,
      likes: 0,
      comments: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
    };
    mockVideos.unshift(newVideo);
    return newVideo;
  },

  getCreatorVideos: async (creatorId: string) => {
    // Placeholder for GET /videos?creatorId=
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockVideos.filter((v) => v.creatorId === creatorId);
  },

  // Comments
  getComments: async (videoId: string) => {
    // Placeholder for GET /comments?videoId=
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      {
        id: "c1",
        videoId,
        userId: "user1",
        userName: "John Doe",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop",
        content: "This is amazing! 🔥",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "c2",
        videoId,
        userId: "user2",
        userName: "Jane Smith",
        userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop",
        content: "Love the vibes! Keep creating 💪",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "c3",
        videoId,
        userId: "user3",
        userName: "Mike Brown",
        userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
        content: "How did you do that? Tutorial please!",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
  },

  postComment: async (videoId: string, content: string) => {
    // Placeholder for POST /comments
    await new Promise((resolve) => setTimeout(resolve, 500));
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

  // Ratings
  rateVideo: async (videoId: string, rating: number) => {
    // Placeholder for POST /ratings
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { videoId, rating, success: true };
  },
};
