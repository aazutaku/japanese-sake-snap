// 酒蔵スタンプラリー
// 全国の有名酒蔵を地方別・テーマ別に網羅。その蔵の酒を記録するとスタンプゲット

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
  color: string; // テーマカラー
  breweries: Brewery[];
}

export const STAMP_RALLIES: StampRally[] = [
  // ===== テーマ別 =====
  {
    id: "legendary",
    name: "伝説の銘酒巡り",
    description: "日本酒好きなら一度は飲みたい、入手困難な伝説級の蔵",
    emoji: "👑",
    color: "#D4A017",
    breweries: [
      { id: "l-1", name: "高木酒造", region: "山形県", description: "幻の酒「十四代」を醸す蔵", famous: "十四代" },
      { id: "l-2", name: "旭酒造", region: "山口県", description: "世界に羽ばたく獺祭の蔵", famous: "獺祭" },
      { id: "l-3", name: "木屋正酒造", region: "三重県", description: "而今で酒界を席巻", famous: "而今" },
      { id: "l-4", name: "新政酒造", region: "秋田県", description: "日本酒の革命児", famous: "新政 No.6" },
      { id: "l-5", name: "廣木酒造", region: "福島県", description: "入手困難な飛露喜", famous: "飛露喜" },
      { id: "l-6", name: "黒龍酒造", region: "福井県", description: "北陸が誇る名門蔵", famous: "黒龍" },
      { id: "l-7", name: "磯自慢酒造", region: "静岡県", description: "静岡の至宝と称される", famous: "磯自慢" },
      { id: "l-8", name: "宮泉銘醸", region: "福島県", description: "冩樂で人気急上昇中", famous: "冩樂" },
    ],
  },
  {
    id: "modern",
    name: "ニュージェネレーション",
    description: "日本酒の常識を覆す、新世代の革新的な蔵たち",
    emoji: "🚀",
    color: "#6C5CE7",
    breweries: [
      { id: "m-1", name: "せんきん", region: "栃木県", description: "ナチュール×日本酒の先駆者", famous: "仙禽" },
      { id: "m-2", name: "花の香酒造", region: "熊本県", description: "産土で注目の九州の新星", famous: "産土" },
      { id: "m-3", name: "赤武酒造", region: "岩手県", description: "若き杜氏が醸すAKABU", famous: "AKABU" },
      { id: "m-4", name: "萬乗醸造", region: "愛知県", description: "パリで認められた九平次", famous: "醸し人九平次" },
      { id: "m-5", name: "油長酒造", region: "奈良県", description: "無濾過生原酒の風の森", famous: "風の森" },
      { id: "m-6", name: "山本合名会社", region: "秋田県", description: "白瀑改め山本で新時代", famous: "山本" },
      { id: "m-7", name: "新澤醸造店", region: "宮城県", description: "究極の食中酒を追求", famous: "伯楽星" },
    ],
  },

  // ===== 地方別 =====
  {
    id: "hokkaido",
    name: "北海道の酒蔵",
    description: "北の大地が育む、澄んだ水と冷涼な気候の酒",
    emoji: "❄️",
    color: "#00B4D8",
    breweries: [
      { id: "hk-1", name: "男山", region: "北海道旭川市", description: "旭川の銘醸蔵", famous: "男山" },
      { id: "hk-2", name: "国稀酒造", region: "北海道増毛町", description: "日本最北の酒蔵", famous: "国稀" },
      { id: "hk-3", name: "上川大雪酒造", region: "北海道上川町", description: "大雪山の伏流水で醸す新蔵", famous: "上川大雪" },
      { id: "hk-4", name: "小林酒造", region: "北海道栗山町", description: "北の錦を醸す老舗蔵", famous: "北の錦" },
    ],
  },
  {
    id: "aomori-iwate",
    name: "青森・岩手の酒蔵",
    description: "北東北の豊かな自然が育む、力強い酒",
    emoji: "🍎",
    color: "#E63946",
    breweries: [
      { id: "ai-1", name: "西田酒造店", region: "青森県", description: "田酒は青森の宝", famous: "田酒" },
      { id: "ai-2", name: "八戸酒造", region: "青森県", description: "陸奥八仙の多彩な味わい", famous: "陸奥八仙" },
      { id: "ai-3", name: "三浦酒造", region: "青森県", description: "弘前が生んだ豊盃", famous: "豊盃" },
      { id: "ai-4", name: "南部美人", region: "岩手県", description: "世界を魅了する岩手の酒", famous: "南部美人" },
      { id: "ai-5", name: "あさ開", region: "岩手県", description: "南部杜氏の伝統を守る", famous: "あさ開" },
      { id: "ai-6", name: "赤武酒造", region: "岩手県", description: "新世代の岩手酒AKABU", famous: "AKABU" },
    ],
  },
  {
    id: "miyagi-akita",
    name: "宮城・秋田の酒蔵",
    description: "米どころの底力、東北中部の銘醸蔵",
    emoji: "🌾",
    color: "#2D6A4F",
    breweries: [
      { id: "ma-1", name: "新澤醸造店", region: "宮城県", description: "究極の食中酒・伯楽星", famous: "伯楽星" },
      { id: "ma-2", name: "一ノ蔵", region: "宮城県", description: "ひめぜんで親しまれる蔵", famous: "一ノ蔵" },
      { id: "ma-3", name: "佐浦", region: "宮城県", description: "浦霞で知られる塩竈の老舗", famous: "浦霞" },
      { id: "ma-4", name: "新政酒造", region: "秋田県", description: "6号酵母の発祥蔵", famous: "新政" },
      { id: "ma-5", name: "齋彌酒造店", region: "秋田県", description: "雪の茅舎の繊細な味わい", famous: "雪の茅舎" },
      { id: "ma-6", name: "山本合名会社", region: "秋田県", description: "白神山地の清水で醸す", famous: "山本" },
      { id: "ma-7", name: "秋田醸造", region: "秋田県", description: "ゆきの美人の華やかさ", famous: "ゆきの美人" },
    ],
  },
  {
    id: "yamagata",
    name: "山形の酒蔵",
    description: "吟醸王国・山形。GI山形を冠する銘醸地",
    emoji: "🏔️",
    color: "#7B2D8E",
    breweries: [
      { id: "yg-1", name: "高木酒造", region: "山形県", description: "十四代を醸す伝説の蔵", famous: "十四代" },
      { id: "yg-2", name: "出羽桜酒造", region: "山形県", description: "吟醸酒ブームの先駆者", famous: "出羽桜" },
      { id: "yg-3", name: "楯の川酒造", region: "山形県", description: "全量純米大吟醸の蔵", famous: "楯野川" },
      { id: "yg-4", name: "亀の井酒造", region: "山形県", description: "くどき上手の甘美な世界", famous: "くどき上手" },
      { id: "yg-5", name: "東北銘醸", region: "山形県", description: "初孫は生酛造りの名手", famous: "初孫" },
      { id: "yg-6", name: "秀鳳酒造場", region: "山形県", description: "秀鳳の端正な味わい", famous: "秀鳳" },
    ],
  },
  {
    id: "fukushima",
    name: "福島の酒蔵",
    description: "金賞受賞数日本一。会津を中心とした実力派揃い",
    emoji: "🏅",
    color: "#E76F51",
    breweries: [
      { id: "fk-1", name: "廣木酒造", region: "福島県", description: "飛露喜で一躍有名に", famous: "飛露喜" },
      { id: "fk-2", name: "宮泉銘醸", region: "福島県", description: "冩樂の華やかな味わい", famous: "冩樂" },
      { id: "fk-3", name: "大七酒造", region: "福島県", description: "生酛造りの名手", famous: "大七" },
      { id: "fk-4", name: "花泉酒造", region: "福島県", description: "ロ万シリーズが大人気", famous: "ロ万" },
      { id: "fk-5", name: "末廣酒造", region: "福島県", description: "会津若松の老舗蔵", famous: "末廣" },
      { id: "fk-6", name: "奥の松酒造", region: "福島県", description: "あだたら吟醸で全国区", famous: "奥の松" },
    ],
  },
  {
    id: "kanto",
    name: "関東の酒蔵",
    description: "首都圏近郊にも名蔵あり。個性派揃いの関東勢",
    emoji: "🗼",
    color: "#457B9D",
    breweries: [
      { id: "kt-1", name: "せんきん", region: "栃木県", description: "ナチュール日本酒の旗手", famous: "仙禽" },
      { id: "kt-2", name: "小林酒造", region: "栃木県", description: "鳳凰美田の華やかな香り", famous: "鳳凰美田" },
      { id: "kt-3", name: "須藤本家", region: "茨城県", description: "日本最古級の酒蔵", famous: "郷乃誉" },
      { id: "kt-4", name: "結城酒造", region: "茨城県", description: "結ゆいの柔らかな旨味", famous: "結ゆい" },
      { id: "kt-5", name: "神亀酒造", region: "埼玉県", description: "全量純米蔵の先駆者", famous: "神亀" },
      { id: "kt-6", name: "小澤酒造", region: "東京都", description: "奥多摩の清流が生む酒", famous: "澤乃井" },
      { id: "kt-7", name: "豊島屋酒造", region: "東京都", description: "東京唯一の老舗酒蔵", famous: "金婚" },
    ],
  },
  {
    id: "niigata",
    name: "新潟の酒蔵",
    description: "日本一の酒どころ新潟。淡麗辛口の聖地を巡る",
    emoji: "🌾",
    color: "#264653",
    breweries: [
      { id: "ni-1", name: "朝日酒造", region: "新潟県", description: "久保田シリーズの蔵元", famous: "久保田" },
      { id: "ni-2", name: "八海醸造", region: "新潟県", description: "八海山で知られる名門", famous: "八海山" },
      { id: "ni-3", name: "宮尾酒造", region: "新潟県", description: "〆張鶴の美しい淡麗", famous: "〆張鶴" },
      { id: "ni-4", name: "白瀧酒造", region: "新潟県", description: "上善如水の生みの親", famous: "上善如水" },
      { id: "ni-5", name: "青木酒造", region: "新潟県", description: "雪男と鶴齢の蔵", famous: "鶴齢" },
      { id: "ni-6", name: "加藤酒造店", region: "新潟県", description: "麒麟山の端正な辛口", famous: "麒麟山" },
      { id: "ni-7", name: "諸橋酒造", region: "新潟県", description: "越乃景虎の切れ味", famous: "越乃景虎" },
      { id: "ni-8", name: "石本酒造", region: "新潟県", description: "越乃寒梅の気品ある味", famous: "越乃寒梅" },
    ],
  },
  {
    id: "hokuriku",
    name: "北陸の酒蔵",
    description: "富山・石川・福井。北陸の豊かな食文化と共にある酒",
    emoji: "🌊",
    color: "#1D3557",
    breweries: [
      { id: "hr-1", name: "黒龍酒造", region: "福井県", description: "北陸最高峰の蔵", famous: "黒龍" },
      { id: "hr-2", name: "加藤吉平商店", region: "福井県", description: "梵のプレミアム酒", famous: "梵" },
      { id: "hr-3", name: "車多酒造", region: "石川県", description: "山廃仕込みの天狗舞", famous: "天狗舞" },
      { id: "hr-4", name: "菊姫", region: "石川県", description: "加賀の名門蔵", famous: "菊姫" },
      { id: "hr-5", name: "福光屋", region: "石川県", description: "加賀鳶と福正宗の蔵", famous: "加賀鳶" },
      { id: "hr-6", name: "桝田酒造店", region: "富山県", description: "満寿泉の洗練された味", famous: "満寿泉" },
      { id: "hr-7", name: "立山酒造", region: "富山県", description: "富山を代表する地酒", famous: "立山" },
    ],
  },
  {
    id: "nagano",
    name: "長野の酒蔵",
    description: "信州のアルプス伏流水が育む、清らかな酒",
    emoji: "⛰️",
    color: "#588157",
    breweries: [
      { id: "ng-1", name: "大信州酒造", region: "長野県", description: "北アルプスの伏流水で醸す", famous: "大信州" },
      { id: "ng-2", name: "宮坂醸造", region: "長野県", description: "諏訪の名門・真澄", famous: "真澄" },
      { id: "ng-3", name: "佐久の花酒造", region: "長野県", description: "佐久の花の端正な味", famous: "佐久の花" },
      { id: "ng-4", name: "大澤酒造", region: "長野県", description: "明鏡止水の透明感", famous: "明鏡止水" },
      { id: "ng-5", name: "酒千蔵野", region: "長野県", description: "川中島幻舞の蔵", famous: "川中島" },
    ],
  },
  {
    id: "tokai",
    name: "東海の酒蔵",
    description: "静岡・愛知・岐阜・三重。多彩な食文化に寄り添う酒",
    emoji: "🗻",
    color: "#F4A261",
    breweries: [
      { id: "tk-1", name: "磯自慢酒造", region: "静岡県", description: "静岡吟醸の最高峰", famous: "磯自慢" },
      { id: "tk-2", name: "初亀醸造", region: "静岡県", description: "静岡の伝統蔵", famous: "初亀" },
      { id: "tk-3", name: "萬乗醸造", region: "愛知県", description: "パリが認めた九平次", famous: "醸し人九平次" },
      { id: "tk-4", name: "関谷醸造", region: "愛知県", description: "蓬莱泉の上品な味わい", famous: "蓬莱泉" },
      { id: "tk-5", name: "木屋正酒造", region: "三重県", description: "而今で全国区に", famous: "而今" },
      { id: "tk-6", name: "清水清三郎商店", region: "三重県", description: "作の洗練された酒質", famous: "作" },
      { id: "tk-7", name: "渡辺酒造店", region: "岐阜県", description: "飛騨の蓬莱を醸す", famous: "蓬莱" },
    ],
  },
  {
    id: "kinki",
    name: "近畿の酒蔵",
    description: "灘・伏見を擁する日本酒の聖地。伝統と革新が交差する",
    emoji: "⛩️",
    color: "#C1121F",
    breweries: [
      { id: "kk-1", name: "菊正宗酒造", region: "兵庫県", description: "灘の生一本の代表格", famous: "菊正宗" },
      { id: "kk-2", name: "白鶴酒造", region: "兵庫県", description: "日本を代表する酒蔵", famous: "白鶴" },
      { id: "kk-3", name: "本田商店", region: "兵庫県", description: "山田錦の聖地で醸す", famous: "龍力" },
      { id: "kk-4", name: "月桂冠", region: "京都府", description: "伏見の名門・日本酒の代名詞", famous: "月桂冠" },
      { id: "kk-5", name: "玉乃光酒造", region: "京都府", description: "純米酒一筋の蔵", famous: "玉乃光" },
      { id: "kk-6", name: "松本酒造", region: "京都府", description: "澤屋まつもとの気品", famous: "澤屋まつもと" },
      { id: "kk-7", name: "秋鹿酒造", region: "大阪府", description: "自営田で米から手がける", famous: "秋鹿" },
      { id: "kk-8", name: "油長酒造", region: "奈良県", description: "風の森の無濾過生原酒", famous: "風の森" },
      { id: "kk-9", name: "今西酒造", region: "奈良県", description: "日本酒発祥の地・三輪の蔵", famous: "みむろ杉" },
      { id: "kk-10", name: "冨田酒造", region: "滋賀県", description: "七本鎗の力強い味わい", famous: "七本鎗" },
      { id: "kk-11", name: "平和酒造", region: "和歌山県", description: "紀土のフレッシュな旨味", famous: "紀土" },
    ],
  },
  {
    id: "chugoku",
    name: "中国地方の酒蔵",
    description: "広島・山口を中心に、西日本の実力派が揃う",
    emoji: "🏯",
    color: "#BC6C25",
    breweries: [
      { id: "cg-1", name: "旭酒造", region: "山口県", description: "獺祭で世界を変えた蔵", famous: "獺祭" },
      { id: "cg-2", name: "澄川酒造場", region: "山口県", description: "東洋美人の芳醇な味", famous: "東洋美人" },
      { id: "cg-3", name: "賀茂鶴酒造", region: "広島県", description: "西条の代表蔵", famous: "賀茂鶴" },
      { id: "cg-4", name: "宝剣酒造", region: "広島県", description: "宝剣の切れ味鋭い酒", famous: "宝剣" },
      { id: "cg-5", name: "今田酒造本店", region: "広島県", description: "富久長の繊細な味わい", famous: "富久長" },
      { id: "cg-6", name: "李白酒造", region: "島根県", description: "出雲の名門蔵", famous: "李白" },
      { id: "cg-7", name: "辻本店", region: "岡山県", description: "御前酒の雄町米使い", famous: "御前酒" },
    ],
  },
  {
    id: "shikoku",
    name: "四国の酒蔵",
    description: "土佐の辛口文化が根付く、食中酒の宝庫",
    emoji: "🐟",
    color: "#0077B6",
    breweries: [
      { id: "sk-1", name: "酔鯨酒造", region: "高知県", description: "土佐の辛口を代表する蔵", famous: "酔鯨" },
      { id: "sk-2", name: "亀泉酒造", region: "高知県", description: "CEL-24の華やかな酒", famous: "亀泉" },
      { id: "sk-3", name: "石鎚酒造", region: "愛媛県", description: "石鎚の端正な味わい", famous: "石鎚" },
      { id: "sk-4", name: "梅錦山川", region: "愛媛県", description: "四国最大級の酒蔵", famous: "梅錦" },
      { id: "sk-5", name: "三芳菊酒造", region: "徳島県", description: "ワイルドなラベルと味", famous: "三芳菊" },
    ],
  },
  {
    id: "kyushu",
    name: "九州の酒蔵",
    description: "焼酎だけじゃない！九州の日本酒は今が面白い",
    emoji: "🌋",
    color: "#E63946",
    breweries: [
      { id: "ks-1", name: "山口酒造場", region: "福岡県", description: "庭のうぐいすの爽やかさ", famous: "庭のうぐいす" },
      { id: "ks-2", name: "杜の蔵", region: "福岡県", description: "独楽蔵のじっくり熟成", famous: "独楽蔵" },
      { id: "ks-3", name: "天山酒造", region: "佐賀県", description: "天山の鍋島が全国区に", famous: "鍋島" },
      { id: "ks-4", name: "花の香酒造", region: "熊本県", description: "産土で注目の九州の新星", famous: "産土" },
      { id: "ks-5", name: "旭酒造（大分）", region: "大分県", description: "大分から発信する美酒", famous: "鷹来屋" },
      { id: "ks-6", name: "千徳酒造", region: "宮崎県", description: "宮崎の清らかな日本酒", famous: "千徳" },
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
