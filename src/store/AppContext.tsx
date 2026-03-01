import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { SakePost, Shelf, UserProfile, PublicShelf } from "../types";
import * as storage from "./storage";
import { DEFAULT_SHELVES } from "../constants/theme";

interface AppState {
  shelves: Shelf[];
  posts: SakePost[];
  profile: UserProfile;
  publicShelves: PublicShelf[];
  loading: boolean;
  addShelf: (name: string, emoji: string, description: string, isPublic: boolean) => Promise<void>;
  deleteShelf: (id: string) => Promise<void>;
  updateShelf: (id: string, updates: Partial<Pick<Shelf, "name" | "emoji" | "description" | "isPublic">>) => Promise<void>;
  addPost: (post: Omit<SakePost, "id" | "createdAt">) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  toggleShelfLike: (shelfId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getShelfPosts: (shelfId: string) => SakePost[];
  likedShelfIds: Set<string>;
}

const AppContext = createContext<AppState | null>(null);

// --- デモユーザー ---
const DEMO_USERS: UserProfile[] = [
  {
    id: "demo-1",
    displayName: "酒蔵めぐり太郎",
    bio: "全国の酒蔵を巡っています。年間100蔵が目標",
    avatarUri: "",
    favoriteBrewing: "新潟県",
    joinedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "demo-2",
    displayName: "日本酒ソムリエ花子",
    bio: "唎酒師。食とのペアリングを日々研究中",
    avatarUri: "",
    favoriteBrewing: "山形県",
    joinedAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "demo-3",
    displayName: "地酒ハンター",
    bio: "地元でしか買えない隠れた名酒を発掘する人",
    avatarUri: "",
    favoriteBrewing: "福島県",
    joinedAt: "2025-06-10T00:00:00.000Z",
  },
  {
    id: "demo-4",
    displayName: "純米原理主義者",
    bio: "純米しか勝たん。醸造アルコールは認めない",
    avatarUri: "",
    favoriteBrewing: "秋田県",
    joinedAt: "2025-09-20T00:00:00.000Z",
  },
];

// --- デモ公開棚：棚がメインコンテンツ ---
const DEMO_PUBLIC_SHELVES: PublicShelf[] = [
  {
    id: "pub-1",
    name: "幻の銘酒コレクション",
    description: "なかなか手に入らない、出会えたら即買いの一本たち",
    emoji: "✨",
    createdAt: "2026-02-20T10:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[0],
    likes: 128,
    followers: 45,
    sakes: [
      { id: "ps-1-1", name: "十四代 本丸", brewery: "高木酒造", region: "山形県", type: "honjozo", rating: 5, comment: "フルーティーで上品な甘み。見つけたら迷わず買い", imageUri: "", shelfId: "pub-1", createdAt: "2026-02-20T10:00:00.000Z" },
      { id: "ps-1-2", name: "而今 純米吟醸 山田錦", brewery: "木屋正酒造", region: "三重県", type: "junmai-ginjo", rating: 5, comment: "ジューシーな旨味と爽やかな酸味のバランスが神", imageUri: "", shelfId: "pub-1", createdAt: "2026-02-18T10:00:00.000Z" },
      { id: "ps-1-3", name: "飛露喜 特別純米", brewery: "廣木酒造", region: "福島県", type: "tokubetsu-junmai", rating: 5, comment: "穏やかな香りと透明感のある味わい", imageUri: "", shelfId: "pub-1", createdAt: "2026-02-15T10:00:00.000Z" },
      { id: "ps-1-4", name: "磯自慢 大吟醸", brewery: "磯自慢酒造", region: "静岡県", type: "daiginjo", rating: 5, comment: "洗練された綺麗な酒質。静岡の至宝", imageUri: "", shelfId: "pub-1", createdAt: "2026-02-10T10:00:00.000Z" },
    ],
  },
  {
    id: "pub-2",
    name: "和食ペアリング最強セレクション",
    description: "刺身・寿司・天ぷら...和食に合う日本酒を厳選",
    emoji: "🍣",
    createdAt: "2026-02-22T14:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[1],
    likes: 89,
    followers: 32,
    sakes: [
      { id: "ps-2-1", name: "獺祭 純米大吟醸 磨き二割三分", brewery: "旭酒造", region: "山口県", type: "junmai-daiginjo", rating: 5, comment: "お刺身との相性は最強。華やかな香りが魚の旨味を引き立てる", imageUri: "", shelfId: "pub-2", createdAt: "2026-02-22T14:00:00.000Z" },
      { id: "ps-2-2", name: "久保田 千寿", brewery: "朝日酒造", region: "新潟県", type: "ginjo", rating: 4, comment: "天ぷらの油をさっぱり流してくれる淡麗辛口", imageUri: "", shelfId: "pub-2", createdAt: "2026-02-20T14:00:00.000Z" },
      { id: "ps-2-3", name: "〆張鶴 純", brewery: "宮尾酒造", region: "新潟県", type: "junmai", rating: 4, comment: "焼き魚に合わせたい。米の旨味がしっかり", imageUri: "", shelfId: "pub-2", createdAt: "2026-02-18T14:00:00.000Z" },
    ],
  },
  {
    id: "pub-3",
    name: "東北の地酒を攻める",
    description: "米どころ東北は酒どころ。県別に飲み比べ記録",
    emoji: "🏔️",
    createdAt: "2026-02-25T09:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[2],
    likes: 67,
    followers: 21,
    sakes: [
      { id: "ps-3-1", name: "新政 No.6 X-type", brewery: "新政酒造", region: "秋田県", type: "junmai", rating: 5, comment: "木桶仕込みの酸味がワインのよう。日本酒の概念が変わる", imageUri: "", shelfId: "pub-3", createdAt: "2026-02-25T09:00:00.000Z" },
      { id: "ps-3-2", name: "出羽桜 桜花吟醸酒", brewery: "出羽桜酒造", region: "山形県", type: "ginjo", rating: 4, comment: "吟醸酒ブームの火付け役。花のような香り", imageUri: "", shelfId: "pub-3", createdAt: "2026-02-23T09:00:00.000Z" },
      { id: "ps-3-3", name: "田酒 特別純米", brewery: "西田酒造店", region: "青森県", type: "tokubetsu-junmai", rating: 5, comment: "米の旨味をこれでもかと引き出した一本", imageUri: "", shelfId: "pub-3", createdAt: "2026-02-21T09:00:00.000Z" },
      { id: "ps-3-4", name: "伯楽星 純米吟醸", brewery: "新澤醸造店", region: "宮城県", type: "junmai-ginjo", rating: 4, comment: "究極の食中酒。料理の邪魔をしない美しさ", imageUri: "", shelfId: "pub-3", createdAt: "2026-02-19T09:00:00.000Z" },
      { id: "ps-3-5", name: "楯野川 純米大吟醸", brewery: "楯の川酒造", region: "山形県", type: "junmai-daiginjo", rating: 4, comment: "全量純米大吟醸蔵の意気込みを感じる", imageUri: "", shelfId: "pub-3", createdAt: "2026-02-17T09:00:00.000Z" },
    ],
  },
  {
    id: "pub-4",
    name: "純米だけで生きていく",
    description: "醸造アルコール無添加。米と水と麹だけの世界",
    emoji: "🌾",
    createdAt: "2026-02-26T20:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[3],
    likes: 156,
    followers: 58,
    sakes: [
      { id: "ps-4-1", name: "龍力 特別純米", brewery: "本田商店", region: "兵庫県", type: "tokubetsu-junmai", rating: 5, comment: "山田錦の旨味を存分に。純米の王道", imageUri: "", shelfId: "pub-4", createdAt: "2026-02-26T20:00:00.000Z" },
      { id: "ps-4-2", name: "天狗舞 山廃純米", brewery: "車多酒造", region: "石川県", type: "junmai", rating: 5, comment: "山廃仕込みの力強い酸と旨味。燗にすると化ける", imageUri: "", shelfId: "pub-4", createdAt: "2026-02-24T20:00:00.000Z" },
      { id: "ps-4-3", name: "秋鹿 純米無濾過原酒", brewery: "秋鹿酒造", region: "大阪府", type: "junmai", rating: 4, comment: "ガツンとくる原酒。純米党にはたまらない", imageUri: "", shelfId: "pub-4", createdAt: "2026-02-22T20:00:00.000Z" },
    ],
  },
  {
    id: "pub-5",
    name: "日本酒ビギナーにおすすめ",
    description: "日本酒デビューにぴったりの飲みやすい銘柄集",
    emoji: "🔰",
    createdAt: "2026-02-27T12:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[1],
    likes: 203,
    followers: 87,
    sakes: [
      { id: "ps-5-1", name: "澪 スパークリング", brewery: "宝酒造", region: "京都府", type: "sparkling", rating: 4, comment: "甘口のスパークリングで日本酒の入口に最適", imageUri: "", shelfId: "pub-5", createdAt: "2026-02-27T12:00:00.000Z" },
      { id: "ps-5-2", name: "上善如水 純米吟醸", brewery: "白瀧酒造", region: "新潟県", type: "junmai-ginjo", rating: 4, comment: "名前の通り水のようにスッと入る。初心者の味方", imageUri: "", shelfId: "pub-5", createdAt: "2026-02-25T12:00:00.000Z" },
      { id: "ps-5-3", name: "一ノ蔵 ひめぜん", brewery: "一ノ蔵", region: "宮城県", type: "other", rating: 4, comment: "低アルコールで甘酸っぱい。日本酒苦手な人もこれなら", imageUri: "", shelfId: "pub-5", createdAt: "2026-02-23T12:00:00.000Z" },
    ],
  },
  {
    id: "pub-6",
    name: "冬の熱燗に合う酒",
    description: "寒い夜はこれを温めて。燗映えする日本酒たち",
    emoji: "♨️",
    createdAt: "2026-02-28T18:00:00.000Z",
    isPublic: true,
    owner: DEMO_USERS[0],
    likes: 74,
    followers: 19,
    sakes: [
      { id: "ps-6-1", name: "大七 純米生酛", brewery: "大七酒造", region: "福島県", type: "junmai", rating: 5, comment: "生酛造りの深い味わい。ぬる燗が最高", imageUri: "", shelfId: "pub-6", createdAt: "2026-02-28T18:00:00.000Z" },
      { id: "ps-6-2", name: "菊姫 山廃純米", brewery: "菊姫", region: "石川県", type: "junmai", rating: 4, comment: "どっしりした旨味が燗で花開く", imageUri: "", shelfId: "pub-6", createdAt: "2026-02-26T18:00:00.000Z" },
    ],
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [posts, setPosts] = useState<SakePost[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    id: "me",
    displayName: "日本酒ファン",
    bio: "日本酒が大好きです",
    avatarUri: "",
    favoriteBrewing: "",
    joinedAt: new Date().toISOString(),
  });
  const [publicShelves, setPublicShelves] = useState<PublicShelf[]>(DEMO_PUBLIC_SHELVES);
  const [likedShelfIds, setLikedShelfIds] = useState<Set<string>>(new Set());
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
            isPublic: false,
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
    async (name: string, emoji: string, description: string, isPublic: boolean) => {
      const newShelf: Shelf = {
        id: uuidv4(),
        name,
        emoji,
        description,
        isPublic,
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
      const updatedPosts = posts.filter((p) => p.shelfId !== id);
      setPosts(updatedPosts);
      await storage.savePosts(updatedPosts);
    },
    [shelves, posts]
  );

  const updateShelf = useCallback(
    async (id: string, updates: Partial<Pick<Shelf, "name" | "emoji" | "description" | "isPublic">>) => {
      const updated = shelves.map((s) => (s.id === id ? { ...s, ...updates } : s));
      setShelves(updated);
      await storage.saveShelves(updated);
    },
    [shelves]
  );

  const addPost = useCallback(
    async (post: Omit<SakePost, "id" | "createdAt">) => {
      const newPost: SakePost = {
        ...post,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newPost, ...posts];
      setPosts(updated);
      await storage.savePosts(updated);
    },
    [posts]
  );

  const deletePost = useCallback(
    async (id: string) => {
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);
      await storage.savePosts(updated);
    },
    [posts]
  );

  const toggleShelfLike = useCallback(
    (shelfId: string) => {
      setLikedShelfIds((prev) => {
        const next = new Set(prev);
        if (next.has(shelfId)) {
          next.delete(shelfId);
        } else {
          next.add(shelfId);
        }
        return next;
      });
      setPublicShelves((prev) =>
        prev.map((s) =>
          s.id === shelfId
            ? { ...s, likes: s.likes + (likedShelfIds.has(shelfId) ? -1 : 1) }
            : s
        )
      );
    },
    [likedShelfIds]
  );

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
        publicShelves,
        loading,
        addShelf,
        deleteShelf,
        updateShelf,
        addPost,
        deletePost,
        toggleShelfLike,
        updateProfile,
        getShelfPosts,
        likedShelfIds,
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
