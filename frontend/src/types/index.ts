export interface Video {
  id: string;
  title: string;
  caption: string;
  thumbnailUrl: string;
  videoUrl: string;
  location?: string;
  people?: string[];
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  views: number;
  likes: number;
  comments: number;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "creator" | "consumer";
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
