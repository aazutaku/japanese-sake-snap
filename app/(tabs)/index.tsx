import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { PublicShelf, Recommendation, SAKE_TYPE_LABELS } from "../../src/types";
import { ShelfFeedCard, ShelfMiniCard } from "../../src/components/ShelfFeedCard";
import { RatingStars } from "../../src/components/RatingStars";

type FilterTag = "all" | "popular" | "new" | "beginner" | "food" | "region";
const FILTER_TAGS: { key: FilterTag; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "popular", label: "人気" },
  { key: "new", label: "新着" },
  { key: "beginner", label: "初心者向け" },
  { key: "food", label: "料理に合う" },
  { key: "region", label: "地域別" },
];

export default function ExploreScreen() {
  const { publicShelves, toggleShelfLike, likedShelfIds, recommendations } = useApp();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");

  // ランキング: いいね順
  const ranked = [...publicShelves].sort((a, b) => b.likes - a.likes);
  const topShelves = ranked.slice(0, 5);

  // フィルター (デモ用 - 全部表示だが並び替え)
  const filteredShelves = (() => {
    switch (activeFilter) {
      case "popular":
        return [...publicShelves].sort((a, b) => b.likes - a.likes);
      case "new":
        return [...publicShelves].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return publicShelves;
    }
  })();

  const handleOpenShelf = (shelf: PublicShelf) => {
    router.push(`/shelf/public-${shelf.id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredShelves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShelfFeedCard
            shelf={item}
            liked={likedShelfIds.has(item.id)}
            onPress={() => handleOpenShelf(item)}
            onLike={() => toggleShelfLike(item.id)}
          />
        )}
        ListHeaderComponent={
          <View>
            {/* アプリヘッダー */}
            <View style={styles.header}>
              <Text style={styles.logo}>🍶 SakeSnap</Text>
              <Text style={styles.tagline}>みんなの棚を覗いてみよう</Text>
            </View>

            {/* 人気の棚（横スクロール） */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 人気の棚</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {topShelves.map((shelf) => (
                  <ShelfMiniCard
                    key={shelf.id}
                    shelf={shelf}
                    onPress={() => handleOpenShelf(shelf)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* おすすめの一本 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 おすすめの一本</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {recommendations.map((rec) => (
                  <View key={rec.id} style={styles.recCard}>
                    <View style={styles.recSceneTag}>
                      <Text style={styles.recSceneText}>{rec.scene}</Text>
                    </View>
                    <Text style={styles.recSakeName} numberOfLines={1}>
                      {rec.sake.name}
                    </Text>
                    <Text style={styles.recBrewery} numberOfLines={1}>
                      {rec.sake.brewery} / {rec.sake.region}
                    </Text>
                    <View style={styles.recTypeRow}>
                      <Text style={styles.recTypeBadge}>
                        {SAKE_TYPE_LABELS[rec.sake.type]}
                      </Text>
                      <RatingStars rating={rec.sake.rating} size={12} />
                    </View>
                    <Text style={styles.recReason} numberOfLines={2}>
                      {rec.reason}
                    </Text>
                    <View style={styles.recUserRow}>
                      <Text style={styles.recUserAvatar}>👤</Text>
                      <Text style={styles.recUserName} numberOfLines={1}>
                        {rec.user.displayName}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* フィルタータグ */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {FILTER_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag.key}
                  style={[
                    styles.filterChip,
                    activeFilter === tag.key && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(tag.key)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilter === tag.key && styles.filterChipTextActive,
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>📚 みんなの棚</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  header: {
    paddingTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  logo: {
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
    color: COLORS.primary,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  horizontalList: {
    paddingRight: SPACING.md,
  },
  filterRow: {
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  recCard: {
    width: 200,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  recSceneTag: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary + "18",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  recSceneText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "700",
  },
  recSakeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  recBrewery: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  recTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  recTypeBadge: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
    backgroundColor: COLORS.primary + "12",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
  },
  recReason: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  recUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recUserAvatar: {
    fontSize: 12,
  },
  recUserName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    flex: 1,
  },
});
