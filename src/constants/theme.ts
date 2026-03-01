export const COLORS = {
  // 和のテーマカラー
  primary: "#8B2252", // 深い朱色 (日本酒の赤)
  primaryLight: "#C75B7A",
  primaryDark: "#5C0E34",
  secondary: "#D4A574", // 杉玉の色
  secondaryLight: "#E8C9A0",
  accent: "#2D5016", // 杉の緑
  accentLight: "#4A7A28",

  background: "#FDF8F0", // 和紙のような白
  surface: "#FFFFFF",
  surfaceElevated: "#F5EDE3",

  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textLight: "#999999",
  textOnPrimary: "#FFFFFF",

  border: "#E0D5C7",
  borderLight: "#F0EAE0",

  star: "#F5A623",
  like: "#E74C5F",
  white: "#FFFFFF",

  overlay: "rgba(0,0,0,0.5)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 28,
  hero: 36,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const DEFAULT_SHELVES = [
  { name: "お気に入り", emoji: "⭐", description: "特にお気に入りの一本" },
  { name: "辛口コレクション", emoji: "🔥", description: "キレのある辛口" },
  { name: "甘口コレクション", emoji: "🍯", description: "まろやかな甘口" },
  { name: "季節限定", emoji: "🌸", description: "季節ごとの限定酒" },
];
