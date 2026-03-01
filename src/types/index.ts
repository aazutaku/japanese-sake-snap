export interface SakePost {
  id: string;
  name: string;
  brewery: string;
  region: string;
  type: SakeType;
  rating: number; // 1-5
  comment: string;
  imageUri: string;
  shelfId: string;
  createdAt: string;
}

export type SakeType =
  | "junmai-daiginjo" // 純米大吟醸
  | "daiginjo" // 大吟醸
  | "junmai-ginjo" // 純米吟醸
  | "ginjo" // 吟醸
  | "tokubetsu-junmai" // 特別純米
  | "junmai" // 純米
  | "tokubetsu-honjozo" // 特別本醸造
  | "honjozo" // 本醸造
  | "futsushu" // 普通酒
  | "sparkling" // スパークリング
  | "nigori" // にごり
  | "nama" // 生酒
  | "other"; // その他

export const SAKE_TYPE_LABELS: Record<SakeType, string> = {
  "junmai-daiginjo": "純米大吟醸",
  daiginjo: "大吟醸",
  "junmai-ginjo": "純米吟醸",
  ginjo: "吟醸",
  "tokubetsu-junmai": "特別純米",
  junmai: "純米",
  "tokubetsu-honjozo": "特別本醸造",
  honjozo: "本醸造",
  futsushu: "普通酒",
  sparkling: "スパークリング",
  nigori: "にごり",
  nama: "生酒",
  other: "その他",
};

export interface Shelf {
  id: string;
  name: string;
  description: string;
  emoji: string;
  createdAt: string;
  isPublic: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  avatarUri: string;
  favoriteBrewing: string;
  joinedAt: string;
}

// 他のユーザーの公開棚 (SNSフィード用)
export interface PublicShelf extends Shelf {
  owner: UserProfile;
  sakes: SakePost[];
  likes: number;
  followers: number;
}

// おすすめ投稿
export interface Recommendation {
  id: string;
  user: UserProfile;
  sake: SakePost;
  reason: string; // なぜおすすめか
  scene: string; // おすすめシーン (例: "デート", "一人飲み", "贈り物")
  createdAt: string;
}
