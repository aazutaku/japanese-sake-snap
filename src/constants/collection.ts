import { SakePost, SakeType, SAKE_TYPE_LABELS } from "../types";

// --- コレクターランク ---
export interface CollectorRank {
  level: number;
  title: string;
  emoji: string;
  minSakes: number;
}

export const COLLECTOR_RANKS: CollectorRank[] = [
  { level: 1, title: "見習い", emoji: "🔰", minSakes: 0 },
  { level: 2, title: "初心者", emoji: "🍶", minSakes: 3 },
  { level: 3, title: "愛好家", emoji: "🏮", minSakes: 10 },
  { level: 4, title: "通", emoji: "🎯", minSakes: 25 },
  { level: 5, title: "目利き", emoji: "👁️", minSakes: 50 },
  { level: 6, title: "師範", emoji: "📜", minSakes: 100 },
  { level: 7, title: "達人", emoji: "⚔️", minSakes: 200 },
  { level: 8, title: "仙人", emoji: "🐉", minSakes: 500 },
];

export function getCollectorRank(sakeCount: number): CollectorRank {
  for (let i = COLLECTOR_RANKS.length - 1; i >= 0; i--) {
    if (sakeCount >= COLLECTOR_RANKS[i].minSakes) return COLLECTOR_RANKS[i];
  }
  return COLLECTOR_RANKS[0];
}

export function getNextRank(sakeCount: number): CollectorRank | null {
  const current = getCollectorRank(sakeCount);
  const nextIdx = COLLECTOR_RANKS.findIndex((r) => r.level === current.level) + 1;
  return nextIdx < COLLECTOR_RANKS.length ? COLLECTOR_RANKS[nextIdx] : null;
}

// --- 実績バッジ ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "collection" | "region" | "type" | "social" | "special";
}

const ALL_BADGES: Badge[] = [
  // コレクション系
  { id: "first-sake", name: "はじめの一杯", description: "最初のお酒を記録", emoji: "🎉", category: "collection" },
  { id: "collector-10", name: "コレクター", description: "10本のお酒を記録", emoji: "📦", category: "collection" },
  { id: "collector-50", name: "蒐集家", description: "50本のお酒を記録", emoji: "🏛️", category: "collection" },
  { id: "collector-100", name: "酒の博物館", description: "100本のお酒を記録", emoji: "🏰", category: "collection" },
  { id: "five-star", name: "五つ星", description: "★5のお酒を記録", emoji: "⭐", category: "collection" },
  { id: "five-star-10", name: "目利きの舌", description: "★5を10本記録", emoji: "👅", category: "collection" },
  { id: "shelf-3", name: "棚職人", description: "棚を3つ作成", emoji: "🗄️", category: "collection" },
  { id: "shelf-10", name: "棚マスター", description: "棚を10個作成", emoji: "🏗️", category: "collection" },

  // 地域制覇系
  { id: "region-5", name: "旅する酒飲み", description: "5つの都道府県の酒を制覇", emoji: "🗾", category: "region" },
  { id: "region-15", name: "全国行脚", description: "15の都道府県の酒を制覇", emoji: "🚅", category: "region" },
  { id: "region-30", name: "日本酒巡礼", description: "30の都道府県の酒を制覇", emoji: "⛩️", category: "region" },
  { id: "region-47", name: "完全制覇", description: "47都道府県の酒を制覇", emoji: "🏆", category: "region" },
  { id: "niigata", name: "新潟の達人", description: "新潟県の酒を5本記録", emoji: "🌾", category: "region" },
  { id: "tohoku", name: "東北の雄", description: "東北6県すべての酒を記録", emoji: "🏔️", category: "region" },

  // 種類コンプリート系
  { id: "type-3", name: "探求者", description: "3種類のタイプを経験", emoji: "🔍", category: "type" },
  { id: "type-7", name: "幅広い舌", description: "7種類のタイプを経験", emoji: "👨‍🔬", category: "type" },
  { id: "type-all", name: "酒類図鑑コンプリート", description: "全タイプを経験", emoji: "📚", category: "type" },
  { id: "junmai-lover", name: "純米党", description: "純米系を10本記録", emoji: "🌾", category: "type" },
  { id: "ginjo-lover", name: "吟醸フリーク", description: "吟醸系を10本記録", emoji: "🌸", category: "type" },
  { id: "sparkling-fan", name: "泡の魔術師", description: "スパークリングを3本記録", emoji: "🫧", category: "type" },

  // ソーシャル系
  { id: "public-shelf", name: "棚を公開", description: "最初の棚を公開", emoji: "🌐", category: "social" },
  { id: "public-3", name: "オープンコレクター", description: "3つの棚を公開", emoji: "📡", category: "social" },

  // 特別系
  { id: "daily-streak-3", name: "三日坊主じゃない", description: "3日連続で記録", emoji: "🔥", category: "special" },
  { id: "night-owl", name: "夜の一杯", description: "22時以降に記録", emoji: "🌙", category: "special" },
  { id: "new-year", name: "新年の祝い酒", description: "1月に記録", emoji: "🎍", category: "special" },
];

export function getEarnedBadges(posts: SakePost[], shelfCount: number, publicShelfCount: number): Badge[] {
  const earned: Badge[] = [];

  const count = posts.length;
  const fiveStarCount = posts.filter((p) => p.rating === 5).length;
  const regions = new Set(posts.map((p) => p.region).filter(Boolean));
  const types = new Set(posts.map((p) => p.type));
  const junmaiCount = posts.filter((p) =>
    ["junmai", "junmai-ginjo", "junmai-daiginjo", "tokubetsu-junmai"].includes(p.type)
  ).length;
  const ginjoCount = posts.filter((p) =>
    ["ginjo", "junmai-ginjo", "daiginjo", "junmai-daiginjo"].includes(p.type)
  ).length;
  const sparklingCount = posts.filter((p) => p.type === "sparkling").length;
  const niigataCount = posts.filter((p) => p.region === "新潟県").length;

  const tohokuPrefectures = ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"];
  const tohokuCovered = tohokuPrefectures.filter((pref) =>
    posts.some((p) => p.region === pref)
  ).length;

  // Collection
  if (count >= 1) earned.push(findBadge("first-sake")!);
  if (count >= 10) earned.push(findBadge("collector-10")!);
  if (count >= 50) earned.push(findBadge("collector-50")!);
  if (count >= 100) earned.push(findBadge("collector-100")!);
  if (fiveStarCount >= 1) earned.push(findBadge("five-star")!);
  if (fiveStarCount >= 10) earned.push(findBadge("five-star-10")!);
  if (shelfCount >= 3) earned.push(findBadge("shelf-3")!);
  if (shelfCount >= 10) earned.push(findBadge("shelf-10")!);

  // Region
  if (regions.size >= 5) earned.push(findBadge("region-5")!);
  if (regions.size >= 15) earned.push(findBadge("region-15")!);
  if (regions.size >= 30) earned.push(findBadge("region-30")!);
  if (regions.size >= 47) earned.push(findBadge("region-47")!);
  if (niigataCount >= 5) earned.push(findBadge("niigata")!);
  if (tohokuCovered >= 6) earned.push(findBadge("tohoku")!);

  // Type
  if (types.size >= 3) earned.push(findBadge("type-3")!);
  if (types.size >= 7) earned.push(findBadge("type-7")!);
  if (types.size >= Object.keys(SAKE_TYPE_LABELS).length) earned.push(findBadge("type-all")!);
  if (junmaiCount >= 10) earned.push(findBadge("junmai-lover")!);
  if (ginjoCount >= 10) earned.push(findBadge("ginjo-lover")!);
  if (sparklingCount >= 3) earned.push(findBadge("sparkling-fan")!);

  // Social
  if (publicShelfCount >= 1) earned.push(findBadge("public-shelf")!);
  if (publicShelfCount >= 3) earned.push(findBadge("public-3")!);

  // Special (time-based)
  const now = new Date();
  if (now.getHours() >= 22) earned.push(findBadge("night-owl")!);
  if (now.getMonth() === 0) earned.push(findBadge("new-year")!);

  // Streak check
  const dates = [...new Set(posts.map((p) => p.createdAt.split("T")[0]))].sort().reverse();
  if (dates.length >= 3) {
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime();
      if (diff <= 86400000 * 1.5) {
        streak++;
        if (streak >= 3) break;
      } else break;
    }
    if (streak >= 3) earned.push(findBadge("daily-streak-3")!);
  }

  return earned.filter(Boolean);
}

function findBadge(id: string): Badge | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}

export function getAllBadges(): Badge[] {
  return ALL_BADGES;
}

// --- 都道府県リスト ---
export const JAPAN_REGIONS: { name: string; prefectures: string[] }[] = [
  { name: "北海道・東北", prefectures: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { name: "関東", prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { name: "中部", prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { name: "近畿", prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { name: "中国・四国", prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"] },
  { name: "九州・沖縄", prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
];

export function getRegionStats(posts: SakePost[]) {
  const covered = new Set(posts.map((p) => p.region).filter(Boolean));
  const total = JAPAN_REGIONS.reduce((sum, r) => sum + r.prefectures.length, 0);
  return { covered, total, percentage: total > 0 ? Math.round((covered.size / total) * 100) : 0 };
}

// --- 酒タイプ図鑑 ---
export function getTypeStats(posts: SakePost[]) {
  const allTypes = Object.keys(SAKE_TYPE_LABELS) as SakeType[];
  const collected = new Set(posts.map((p) => p.type));
  return {
    allTypes,
    collected,
    total: allTypes.length,
    collectedCount: collected.size,
    percentage: Math.round((collected.size / allTypes.length) * 100),
  };
}
