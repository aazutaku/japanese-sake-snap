// 酒蔵スタンプラリー
// 有名酒蔵をスタンプカードとして登録。訪問(=その蔵の酒を記録)するとスタンプゲット

import { SakePost } from "../types";

export interface Brewery {
  id: string;
  name: string;
  region: string;
  description: string;
  famous: string; // 代表銘柄
}

export interface StampRally {
  id: string;
  name: string;
  description: string;
  emoji: string;
  breweries: Brewery[];
}

export const STAMP_RALLIES: StampRally[] = [
  {
    id: "legendary",
    name: "伝説の銘酒巡り",
    description: "日本酒好きなら一度は飲みたい、伝説級の蔵を巡ろう",
    emoji: "👑",
    breweries: [
      { id: "b-1", name: "高木酒造", region: "山形県", description: "幻の酒「十四代」を醸す", famous: "十四代" },
      { id: "b-2", name: "旭酒造", region: "山口県", description: "世界に羽ばたく獺祭", famous: "獺祭" },
      { id: "b-3", name: "木屋正酒造", region: "三重県", description: "而今で酒界を席巻", famous: "而今" },
      { id: "b-4", name: "新政酒造", region: "秋田県", description: "日本酒の革命児", famous: "新政 No.6" },
      { id: "b-5", name: "廣木酒造", region: "福島県", description: "入手困難な飛露喜", famous: "飛露喜" },
      { id: "b-6", name: "黒龍酒造", region: "福井県", description: "北陸が誇る名門蔵", famous: "黒龍" },
    ],
  },
  {
    id: "niigata",
    name: "新潟の酒蔵めぐり",
    description: "日本一の酒どころ新潟。淡麗辛口の聖地を巡る",
    emoji: "🌾",
    breweries: [
      { id: "b-10", name: "朝日酒造", region: "新潟県", description: "久保田シリーズの蔵元", famous: "久保田" },
      { id: "b-11", name: "八海醸造", region: "新潟県", description: "八海山で知られる名門", famous: "八海山" },
      { id: "b-12", name: "宮尾酒造", region: "新潟県", description: "〆張鶴の美しい淡麗", famous: "〆張鶴" },
      { id: "b-13", name: "白瀧酒造", region: "新潟県", description: "上善如水の生みの親", famous: "上善如水" },
      { id: "b-14", name: "青木酒造", region: "新潟県", description: "雪男と鶴齢の蔵", famous: "鶴齢" },
    ],
  },
  {
    id: "tohoku",
    name: "東北六県の雄",
    description: "米どころ東北。各県を代表する蔵を制覇せよ",
    emoji: "🏔️",
    breweries: [
      { id: "b-20", name: "西田酒造店", region: "青森県", description: "田酒は青森の宝", famous: "田酒" },
      { id: "b-21", name: "南部美人", region: "岩手県", description: "世界を魅了する岩手の酒", famous: "南部美人" },
      { id: "b-22", name: "新澤醸造店", region: "宮城県", description: "究極の食中酒・伯楽星", famous: "伯楽星" },
      { id: "b-23", name: "新政酒造", region: "秋田県", description: "6号酵母の発祥蔵", famous: "新政" },
      { id: "b-24", name: "出羽桜酒造", region: "山形県", description: "吟醸酒ブームの先駆者", famous: "出羽桜" },
      { id: "b-25", name: "大七酒造", region: "福島県", description: "生酛造りの名手", famous: "大七" },
    ],
  },
  {
    id: "modern",
    name: "ニュージェネレーション",
    description: "日本酒の常識を覆す、新世代の革新的な蔵たち",
    emoji: "🚀",
    breweries: [
      { id: "b-30", name: "仙禽", region: "栃木県", description: "ナチュール×日本酒の先駆者", famous: "仙禽" },
      { id: "b-31", name: "新政酒造", region: "秋田県", description: "木桶仕込みで革命を起こす", famous: "新政" },
      { id: "b-32", name: "せんきん", region: "栃木県", description: "ドメーヌ化を推進", famous: "仙禽" },
      { id: "b-33", name: "花の香酒造", region: "熊本県", description: "産土で注目の九州の新星", famous: "花の香" },
      { id: "b-34", name: "宮泉銘醸", region: "福島県", description: "冩樂で人気急上昇", famous: "冩樂" },
    ],
  },
  {
    id: "kansai",
    name: "関西の銘醸地めぐり",
    description: "灘・伏見を中心とした西日本の酒文化を体験",
    emoji: "⛩️",
    breweries: [
      { id: "b-40", name: "菊正宗酒造", region: "兵庫県", description: "灘の生一本の代表格", famous: "菊正宗" },
      { id: "b-41", name: "月桂冠", region: "京都府", description: "伏見の名門・日本酒の代名詞", famous: "月桂冠" },
      { id: "b-42", name: "本田商店", region: "兵庫県", description: "山田錦の聖地で醸す龍力", famous: "龍力" },
      { id: "b-43", name: "秋鹿酒造", region: "大阪府", description: "自営田で米作りから手がける", famous: "秋鹿" },
      { id: "b-44", name: "今西酒造", region: "奈良県", description: "日本酒発祥の地・三輪の蔵", famous: "みむろ杉" },
    ],
  },
];

export interface StampRallyProgress {
  rallyId: string;
  stampedBreweryIds: string[];
}

export function getRallyProgress(
  rally: StampRally,
  posts: SakePost[]
): { stamped: Set<string>; total: number; percentage: number } {
  const breweryNames = new Set(rally.breweries.map((b) => b.name));
  const stamped = new Set<string>();
  for (const post of posts) {
    if (breweryNames.has(post.brewery)) {
      const brewery = rally.breweries.find((b) => b.name === post.brewery);
      if (brewery) stamped.add(brewery.id);
    }
  }
  return {
    stamped,
    total: rally.breweries.length,
    percentage: Math.round((stamped.size / rally.breweries.length) * 100),
  };
}

// 全ラリーの合計スタンプ数
export function getTotalStamps(posts: SakePost[]): { stamped: number; total: number } {
  let stamped = 0;
  let total = 0;
  for (const rally of STAMP_RALLIES) {
    const progress = getRallyProgress(rally, posts);
    stamped += progress.stamped.size;
    total += progress.total;
  }
  return { stamped, total };
}
