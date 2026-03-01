import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../constants/theme";
import { PublicShelf, SAKE_TYPE_LABELS } from "../types";
import { RatingStars } from "./RatingStars";

interface Props {
  shelf: PublicShelf;
  liked: boolean;
  onPress: () => void;
  onLike: () => void;
}

export function ShelfFeedCard({ shelf, liked, onPress, onLike }: Props) {
  // サムネイル: 棚に入ってる酒を最大4つグリッド表示
  const displaySakes = shelf.sakes.slice(0, 4);
  const extraCount = shelf.sakes.length - 4;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* ヘッダー: ユーザー情報 */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {shelf.owner.displayName.charAt(0)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.ownerName}>{shelf.owner.displayName}</Text>
          <Text style={styles.ownerBio} numberOfLines={1}>{shelf.owner.bio}</Text>
        </View>
      </View>

      {/* 棚タイトル */}
      <View style={styles.titleRow}>
        <Text style={styles.emoji}>{shelf.emoji}</Text>
        <View style={styles.titleInfo}>
          <Text style={styles.shelfName}>{shelf.name}</Text>
          <Text style={styles.shelfDesc} numberOfLines={2}>{shelf.description}</Text>
        </View>
      </View>

      {/* 酒のサムネイルグリッド */}
      <View style={styles.sakeGrid}>
        {displaySakes.map((sake, i) => (
          <View key={sake.id} style={styles.sakeThumb}>
            <View style={styles.sakeThumbInner}>
              <Text style={styles.sakeThumbEmoji}>🍶</Text>
            </View>
            <Text style={styles.sakeThumbName} numberOfLines={1}>{sake.name}</Text>
            <View style={styles.sakeThumbMeta}>
              <RatingStars rating={sake.rating} size={10} />
            </View>
          </View>
        ))}
        {extraCount > 0 && (
          <View style={[styles.sakeThumb, styles.sakeThumbMore]}>
            <View style={[styles.sakeThumbInner, styles.sakeThumbMoreInner]}>
              <Text style={styles.moreCount}>+{extraCount}</Text>
            </View>
            <Text style={styles.sakeThumbName}>もっと見る</Text>
          </View>
        )}
      </View>

      {/* アクションバー */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Text style={styles.actionIcon}>{liked ? "❤️" : "🤍"}</Text>
          <Text style={[styles.actionLabel, liked && styles.actionLabelActive]}>
            {shelf.likes + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionBtn}>
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionLabel}>{shelf.followers}人がフォロー</Text>
        </View>
        <View style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🍶</Text>
          <Text style={styles.actionLabel}>{shelf.sakes.length}本</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// コンパクト版（ランキングや横スクロール用）
export function ShelfMiniCard({ shelf, onPress }: { shelf: PublicShelf; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.miniCard} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.miniEmoji}>{shelf.emoji}</Text>
      <Text style={styles.miniName} numberOfLines={1}>{shelf.name}</Text>
      <Text style={styles.miniOwner} numberOfLines={1}>{shelf.owner.displayName}</Text>
      <View style={styles.miniStats}>
        <Text style={styles.miniStat}>❤️ {shelf.likes}</Text>
        <Text style={styles.miniStat}>🍶 {shelf.sakes.length}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  headerInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  ownerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  ownerBio: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  emoji: {
    fontSize: 40,
    marginRight: SPACING.sm,
  },
  titleInfo: {
    flex: 1,
    paddingTop: 2,
  },
  shelfName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  shelfDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  sakeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  sakeThumb: {
    width: "23%",
    alignItems: "center",
  },
  sakeThumbInner: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  sakeThumbEmoji: {
    fontSize: 28,
  },
  sakeThumbName: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 3,
    textAlign: "center",
  },
  sakeThumbMeta: {
    marginTop: 1,
  },
  sakeThumbMore: {},
  sakeThumbMoreInner: {
    backgroundColor: COLORS.primaryLight + "15",
  },
  moreCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
  },
  actionBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionIcon: {
    fontSize: 15,
  },
  actionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  actionLabelActive: {
    color: COLORS.like,
    fontWeight: "600",
  },

  // Mini card
  miniCard: {
    width: 140,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  miniEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  miniName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
  },
  miniOwner: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  miniStats: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  miniStat: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});
