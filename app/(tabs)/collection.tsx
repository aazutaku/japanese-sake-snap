import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SAKE_TYPE_LABELS, SakeType } from "../../src/types";
import {
  getCollectorRank,
  getNextRank,
  getEarnedBadges,
  getAllBadges,
  getRegionStats,
  getTypeStats,
  JAPAN_REGIONS,
  COLLECTOR_RANKS,
} from "../../src/constants/collection";

type Section = "overview" | "region" | "types" | "badges";

export default function CollectionScreen() {
  const { posts, shelves } = useApp();
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const rank = getCollectorRank(posts.length);
  const nextRank = getNextRank(posts.length);
  const publicCount = shelves.filter((s) => s.isPublic).length;
  const earnedBadges = getEarnedBadges(posts, shelves.length, publicCount);
  const allBadges = getAllBadges();
  const regionStats = getRegionStats(posts);
  const typeStats = getTypeStats(posts);

  const progress = nextRank
    ? ((posts.length - rank.minSakes) / (nextRank.minSakes - rank.minSakes)) * 100
    : 100;

  const SECTIONS: { key: Section; label: string }[] = [
    { key: "overview", label: "総合" },
    { key: "region", label: "地域" },
    { key: "types", label: "図鑑" },
    { key: "badges", label: "実績" },
  ];

  return (
    <View style={styles.container}>
      {/* セクション切り替え */}
      <View style={styles.tabRow}>
        {SECTIONS.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.tab, activeSection === s.key && styles.tabActive]}
            onPress={() => setActiveSection(s.key)}
          >
            <Text style={[styles.tabText, activeSection === s.key && styles.tabTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === "overview" && (
          <OverviewSection
            rank={rank}
            nextRank={nextRank}
            progress={progress}
            sakeCount={posts.length}
            regionStats={regionStats}
            typeStats={typeStats}
            badgeCount={earnedBadges.length}
            totalBadges={allBadges.length}
          />
        )}
        {activeSection === "region" && (
          <RegionSection posts={posts} regionStats={regionStats} />
        )}
        {activeSection === "types" && (
          <TypeSection posts={posts} typeStats={typeStats} />
        )}
        {activeSection === "badges" && (
          <BadgeSection earned={earnedBadges} all={allBadges} />
        )}
      </ScrollView>
    </View>
  );
}

// ===== 総合セクション =====
function OverviewSection({
  rank,
  nextRank,
  progress,
  sakeCount,
  regionStats,
  typeStats,
  badgeCount,
  totalBadges,
}: {
  rank: ReturnType<typeof getCollectorRank>;
  nextRank: ReturnType<typeof getNextRank>;
  progress: number;
  sakeCount: number;
  regionStats: ReturnType<typeof getRegionStats>;
  typeStats: ReturnType<typeof getTypeStats>;
  badgeCount: number;
  totalBadges: number;
}) {
  return (
    <View>
      {/* ランクカード */}
      <View style={styles.rankCard}>
        <Text style={styles.rankEmoji}>{rank.emoji}</Text>
        <Text style={styles.rankTitle}>{rank.title}</Text>
        <Text style={styles.rankLevel}>Lv.{rank.level}</Text>
        {nextRank && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              次のランク「{nextRank.emoji} {nextRank.title}」まであと{nextRank.minSakes - sakeCount}本
            </Text>
          </View>
        )}
        {!nextRank && (
          <Text style={styles.maxRankText}>最高ランク到達！</Text>
        )}
      </View>

      {/* コレクション概要グリッド */}
      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsEmoji}>🍶</Text>
          <Text style={styles.statsNum}>{sakeCount}</Text>
          <Text style={styles.statsLabel}>記録した酒</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsEmoji}>🗾</Text>
          <Text style={styles.statsNum}>{regionStats.covered.size}/47</Text>
          <Text style={styles.statsLabel}>都道府県</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsEmoji}>📖</Text>
          <Text style={styles.statsNum}>{typeStats.collectedCount}/{typeStats.total}</Text>
          <Text style={styles.statsLabel}>酒タイプ</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsEmoji}>🏅</Text>
          <Text style={styles.statsNum}>{badgeCount}/{totalBadges}</Text>
          <Text style={styles.statsLabel}>実績</Text>
        </View>
      </View>

      {/* ランク一覧 */}
      <Text style={styles.sectionTitle}>コレクターランク</Text>
      <View style={styles.rankListCard}>
        {COLLECTOR_RANKS.map((r) => {
          const isCurrent = r.level === rank.level;
          const isAchieved = sakeCount >= r.minSakes;
          return (
            <View key={r.level} style={[styles.rankRow, isCurrent && styles.rankRowCurrent]}>
              <Text style={[styles.rankRowEmoji, !isAchieved && styles.rankRowLocked]}>
                {isAchieved ? r.emoji : "🔒"}
              </Text>
              <View style={styles.rankRowInfo}>
                <Text style={[styles.rankRowTitle, !isAchieved && styles.rankRowTitleLocked]}>
                  {r.title}
                </Text>
                <Text style={styles.rankRowReq}>{r.minSakes}本以上</Text>
              </View>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>NOW</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ===== 地域セクション =====
function RegionSection({
  posts,
  regionStats,
}: {
  posts: ReturnType<typeof useApp>["posts"];
  regionStats: ReturnType<typeof getRegionStats>;
}) {
  const { covered } = regionStats;

  return (
    <View>
      {/* 概要 */}
      <View style={styles.regionHeader}>
        <Text style={styles.regionHeaderTitle}>🗾 地域制覇マップ</Text>
        <View style={styles.regionProgressRow}>
          <Text style={styles.regionFraction}>{covered.size} / 47</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${regionStats.percentage}%` }]} />
          </View>
          <Text style={styles.regionPercent}>{regionStats.percentage}%</Text>
        </View>
      </View>

      {/* 地域ごと */}
      {JAPAN_REGIONS.map((region) => {
        const regionCovered = region.prefectures.filter((p) => covered.has(p)).length;
        const regionTotal = region.prefectures.length;
        return (
          <View key={region.name} style={styles.regionCard}>
            <View style={styles.regionCardHeader}>
              <Text style={styles.regionName}>{region.name}</Text>
              <Text style={styles.regionCount}>
                {regionCovered}/{regionTotal}
              </Text>
            </View>
            <View style={styles.prefGrid}>
              {region.prefectures.map((pref) => {
                const has = covered.has(pref);
                const count = posts.filter((p) => p.region === pref).length;
                return (
                  <View
                    key={pref}
                    style={[styles.prefChip, has && styles.prefChipDone]}
                  >
                    <Text style={[styles.prefText, has && styles.prefTextDone]}>
                      {pref.replace(/県|府|都|道/, "")}
                    </Text>
                    {has && <Text style={styles.prefCount}>{count}</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ===== タイプ図鑑セクション =====
function TypeSection({
  posts,
  typeStats,
}: {
  posts: ReturnType<typeof useApp>["posts"];
  typeStats: ReturnType<typeof getTypeStats>;
}) {
  return (
    <View>
      <View style={styles.regionHeader}>
        <Text style={styles.regionHeaderTitle}>📖 酒タイプ図鑑</Text>
        <View style={styles.regionProgressRow}>
          <Text style={styles.regionFraction}>{typeStats.collectedCount} / {typeStats.total}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${typeStats.percentage}%` }]} />
          </View>
          <Text style={styles.regionPercent}>{typeStats.percentage}%</Text>
        </View>
      </View>

      {typeStats.allTypes.map((type) => {
        const has = typeStats.collected.has(type);
        const typePosts = posts.filter((p) => p.type === type);
        const avgRating =
          typePosts.length > 0
            ? (typePosts.reduce((s, p) => s + p.rating, 0) / typePosts.length).toFixed(1)
            : null;

        return (
          <View key={type} style={[styles.typeCard, has && styles.typeCardDone]}>
            <View style={styles.typeLeft}>
              <Text style={styles.typeStatus}>{has ? "✅" : "❓"}</Text>
              <View>
                <Text style={[styles.typeName, !has && styles.typeNameLocked]}>
                  {SAKE_TYPE_LABELS[type]}
                </Text>
                {has ? (
                  <Text style={styles.typeMeta}>
                    {typePosts.length}本記録 · 平均★{avgRating}
                  </Text>
                ) : (
                  <Text style={styles.typeMetaLocked}>未経験</Text>
                )}
              </View>
            </View>
            {has && typePosts.length > 0 && (
              <View style={styles.typeFav}>
                <Text style={styles.typeFavLabel}>Best</Text>
                <Text style={styles.typeFavName} numberOfLines={1}>
                  {typePosts.sort((a, b) => b.rating - a.rating)[0].name}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ===== バッジセクション =====
function BadgeSection({
  earned,
  all,
}: {
  earned: ReturnType<typeof getEarnedBadges>;
  all: ReturnType<typeof getAllBadges>;
}) {
  const earnedIds = new Set(earned.map((b) => b.id));
  const categories = [
    { key: "collection", label: "コレクション" },
    { key: "region", label: "地域制覇" },
    { key: "type", label: "酒タイプ" },
    { key: "social", label: "ソーシャル" },
    { key: "special", label: "スペシャル" },
  ] as const;

  return (
    <View>
      <View style={styles.regionHeader}>
        <Text style={styles.regionHeaderTitle}>🏅 実績バッジ</Text>
        <Text style={styles.badgeHeaderCount}>
          {earned.length} / {all.length} 獲得
        </Text>
      </View>

      {categories.map((cat) => {
        const badges = all.filter((b) => b.category === cat.key);
        return (
          <View key={cat.key} style={styles.badgeCategoryCard}>
            <Text style={styles.badgeCategoryTitle}>{cat.label}</Text>
            <View style={styles.badgeGrid}>
              {badges.map((badge) => {
                const has = earnedIds.has(badge.id);
                return (
                  <View
                    key={badge.id}
                    style={[styles.badgeItem, has && styles.badgeItemEarned]}
                  >
                    <Text style={styles.badgeEmoji}>
                      {has ? badge.emoji : "🔒"}
                    </Text>
                    <Text
                      style={[styles.badgeName, !has && styles.badgeNameLocked]}
                      numberOfLines={1}
                    >
                      {badge.name}
                    </Text>
                    <Text
                      style={[styles.badgeDesc, !has && styles.badgeDescLocked]}
                      numberOfLines={2}
                    >
                      {badge.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },

  // ランクカード
  rankCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  rankEmoji: {
    fontSize: 56,
  },
  rankTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  rankLevel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "700",
  },
  progressSection: {
    width: "100%",
    marginTop: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: "hidden",
    flex: 1,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  maxRankText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.star,
    fontWeight: "700",
    marginTop: SPACING.sm,
  },

  // 概要グリッド
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  statsCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statsEmoji: {
    fontSize: 28,
  },
  statsNum: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statsLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // セクションタイトル
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // ランク一覧
  rankListCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  rankRowCurrent: {
    backgroundColor: COLORS.primaryLight + "15",
  },
  rankRowEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  rankRowLocked: {
    opacity: 0.4,
  },
  rankRowInfo: {
    flex: 1,
  },
  rankRowTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  rankRowTitleLocked: {
    color: COLORS.textLight,
  },
  rankRowReq: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
  },

  // 地域ヘッダー
  regionHeader: {
    marginBottom: SPACING.md,
  },
  regionHeaderTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  regionProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  regionFraction: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.primary,
    minWidth: 50,
  },
  regionPercent: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
    minWidth: 36,
    textAlign: "right",
  },

  // 地域カード
  regionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  regionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  regionName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  regionCount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },
  prefGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  prefChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  prefChipDone: {
    backgroundColor: COLORS.primary,
  },
  prefText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  prefTextDone: {
    color: COLORS.white,
  },
  prefCount: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  // タイプ図鑑
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.borderLight,
  },
  typeCardDone: {
    borderLeftColor: COLORS.primary,
  },
  typeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  typeStatus: {
    fontSize: 20,
  },
  typeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  typeNameLocked: {
    color: COLORS.textLight,
  },
  typeMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  typeMetaLocked: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  typeFav: {
    alignItems: "flex-end",
    maxWidth: "40%",
  },
  typeFavLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.star,
  },
  typeFavName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  // バッジ
  badgeHeaderCount: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "700",
  },
  badgeCategoryCard: {
    marginBottom: SPACING.lg,
  },
  badgeCategoryTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  badgeItem: {
    width: "31%",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  badgeItemEarned: {
    borderColor: COLORS.star,
    backgroundColor: COLORS.star + "08",
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  badgeNameLocked: {
    color: COLORS.textLight,
  },
  badgeDesc: {
    fontSize: 8,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 2,
    lineHeight: 11,
  },
  badgeDescLocked: {
    color: COLORS.textLight,
  },
});
