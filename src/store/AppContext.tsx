import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { SakePost, Shelf, UserProfile, TimelinePost } from "../types";
import * as storage from "./storage";
import { DEFAULT_SHELVES } from "../constants/theme";

interface AppState {
  shelves: Shelf[];
  posts: SakePost[];
  profile: UserProfile;
  timeline: TimelinePost[];
  loading: boolean;
  addShelf: (name: string, emoji: string, description: string) => Promise<void>;
  deleteShelf: (id: string) => Promise<void>;
  addPost: (post: Omit<SakePost, "id" | "createdAt" | "likes">) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (postId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getShelfPosts: (shelfId: string) => SakePost[];
}

const AppContext = createContext<AppState | null>(null);

const DEMO_USERS: UserProfile[] = [
  {
    id: "demo-1",
    displayName: "酒蔵めぐり太郎",
    bio: "全国の酒蔵を巡っています🍶",
    avatarUri: "",
    favoriteBrewing: "新潟県",
    joinedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "demo-2",
    displayName: "日本酒ソムリエ花子",
    bio: "唎酒師の資格持ち。食とのペアリングが好き",
    avatarUri: "",
    favoriteBrewing: "山形県",
    joinedAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "demo-3",
    displayName: "地酒ハンター",
    bio: "隠れた名酒を発掘するのが趣味です",
    avatarUri: "",
    favoriteBrewing: "福島県",
    joinedAt: "2025-06-10T00:00:00.000Z",
  },
];

const DEMO_TIMELINE: TimelinePost[] = [
  {
    id: "tl-1",
    name: "獺祭 純米大吟醸 磨き二割三分",
    brewery: "旭酒造",
    region: "山口県",
    type: "junmai-daiginjo",
    rating: 5,
    comment: "華やかな香りとすっきりした味わい。やっぱり獺祭は別格！",
    imageUri: "",
    shelfId: "",
    createdAt: "2026-02-28T18:00:00.000Z",
    likes: 24,
    user: DEMO_USERS[0],
  },
  {
    id: "tl-2",
    name: "十四代 本丸",
    brewery: "高木酒造",
    region: "山形県",
    type: "honjozo",
    rating: 5,
    comment: "幻の酒をついにゲット！フルーティーで上品な甘みが最高です",
    imageUri: "",
    shelfId: "",
    createdAt: "2026-02-27T20:30:00.000Z",
    likes: 42,
    user: DEMO_USERS[1],
  },
  {
    id: "tl-3",
    name: "飛露喜 特別純米",
    brewery: "廣木酒造",
    region: "福島県",
    type: "tokubetsu-junmai",
    rating: 4,
    comment: "バランスが良くて飲みやすい。食中酒として最高のパートナー",
    imageUri: "",
    shelfId: "",
    createdAt: "2026-02-26T19:15:00.000Z",
    likes: 18,
    user: DEMO_USERS[2],
  },
  {
    id: "tl-4",
    name: "而今 純米吟醸 山田錦",
    brewery: "木屋正酒造",
    region: "三重県",
    type: "junmai-ginjo",
    rating: 5,
    comment: "ジューシーな旨味と爽やかな酸味。文句なしの一本！",
    imageUri: "",
    shelfId: "",
    createdAt: "2026-02-25T21:00:00.000Z",
    likes: 35,
    user: DEMO_USERS[0],
  },
  {
    id: "tl-5",
    name: "新政 No.6 X-type",
    brewery: "新政酒造",
    region: "秋田県",
    type: "junmai",
    rating: 4,
    comment: "酸味が効いたモダンな日本酒。ワイン好きにもおすすめ",
    imageUri: "",
    shelfId: "",
    createdAt: "2026-02-24T17:45:00.000Z",
    likes: 29,
    user: DEMO_USERS[1],
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [posts, setPosts] = useState<SakePost[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    id: "me",
    displayName: "日本酒ファン",
    bio: "日本酒が大好きです🍶",
    avatarUri: "",
    favoriteBrewing: "",
    joinedAt: new Date().toISOString(),
  });
  const [timeline, setTimeline] = useState<TimelinePost[]>(DEMO_TIMELINE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [savedShelves, savedPosts, savedProfile] = await Promise.all([
          storage.getShelves(),
          storage.getPosts(),
          storage.getProfile(),
        ]);

        if (savedShelves.length === 0) {
          const defaults: Shelf[] = DEFAULT_SHELVES.map((s) => ({
            id: uuidv4(),
            name: s.name,
            description: s.description,
            emoji: s.emoji,
            createdAt: new Date().toISOString(),
          }));
          await storage.saveShelves(defaults);
          setShelves(defaults);
        } else {
          setShelves(savedShelves);
        }

        setPosts(savedPosts);
        if (savedProfile) setProfile(savedProfile);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addShelf = useCallback(
    async (name: string, emoji: string, description: string) => {
      const newShelf: Shelf = {
        id: uuidv4(),
        name,
        emoji,
        description,
        createdAt: new Date().toISOString(),
      };
      const updated = [...shelves, newShelf];
      setShelves(updated);
      await storage.saveShelves(updated);
    },
    [shelves]
  );

  const deleteShelf = useCallback(
    async (id: string) => {
      const updated = shelves.filter((s) => s.id !== id);
      setShelves(updated);
      await storage.saveShelves(updated);
      // Also remove posts in this shelf
      const updatedPosts = posts.filter((p) => p.shelfId !== id);
      setPosts(updatedPosts);
      await storage.savePosts(updatedPosts);
    },
    [shelves, posts]
  );

  const addPost = useCallback(
    async (post: Omit<SakePost, "id" | "createdAt" | "likes">) => {
      const newPost: SakePost = {
        ...post,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      const updated = [newPost, ...posts];
      setPosts(updated);
      await storage.savePosts(updated);

      // Also add to timeline as own post
      const timelinePost: TimelinePost = { ...newPost, user: profile };
      setTimeline((prev) => [timelinePost, ...prev]);
    },
    [posts, profile]
  );

  const deletePost = useCallback(
    async (id: string) => {
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);
      await storage.savePosts(updated);
    },
    [posts]
  );

  const toggleLike = useCallback((postId: string) => {
    setTimeline((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      await storage.saveProfile(updated);
    },
    [profile]
  );

  const getShelfPosts = useCallback(
    (shelfId: string) => posts.filter((p) => p.shelfId === shelfId),
    [posts]
  );

  return (
    <AppContext.Provider
      value={{
        shelves,
        posts,
        profile,
        timeline,
        loading,
        addShelf,
        deleteShelf,
        addPost,
        deletePost,
        toggleLike,
        updateProfile,
        getShelfPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
