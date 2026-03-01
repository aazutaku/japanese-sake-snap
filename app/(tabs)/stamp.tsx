import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import {
  STAMP_RALLIES,
  StampRally,
  Brewery,
  getRallyProgress,
  getTotalStamps,
} from "../../src/constants/stampRally";

type ViewMode = "list" | "detail";

export default function StampRallyScreen() {
  const { posts } = useApp();
  const [selectedRally, setSelectedRally] = useState<StampRally | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const totalStamps = getTotalStamps(posts);
  const totalPercentage = totalStamps.total > 0
    ? Math.round((totalStamps.stamped / totalStamps.total) * 100)
    : 0;

  if (viewMode === "detail" && selectedRally) {
    return (
      <RallyDetail
        rally={selectedRally}
        posts={posts}
        onBack={() => {
          setViewMode("list");
          setSelectedRally(null);
        }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ヘッダー */}
      <View style={styles.heroSection}>
        <View style={styles.heroIconRow}>
          <Text style={styles.heroIcon}>🏯</Text>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroTitle}>酒蔵スタンプラリー</Text>
            <Text style={styles.heroSub}>全国の名門酒蔵を巡ろう</Text>
          </View>
        </View>
      </View>

      {/* 総合進捗カード */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalStamps.stamped}</Text>
            <Text style={styles.statLabel}>獲得</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalStamps.total}</Text>
            <Text style={styles.statLabel}>全蔵</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{STAMP_RALLIES.length}</Text>
            <Text style={styles.statLabel}>コース</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.star }]}>
              {totalPercentage}%
            </Text>
            <Text style={styles.statLabel}>達成率</Text>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${totalPercentage}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          全国制覇まであと {totalStamps.total - totalStamps.stamped} 蔵
        </Text>
      </View>

      {/* テーマ別 */}
      <Text style={styles.groupTitle}>🎯 テーマ別コース</Text>
      {STAMP_RALLIES.filter((r) =>
        ["legendary", "modern"].includes(r.id)
      ).map((rally) => (
        <RallyCard
          key={rally.id}
          rally={rally}
          posts={posts}
          onPress={() => {
            setSelectedRally(rally);
            setViewMode("detail");
          }}
        />
      ))}

      {/* 地方別 */}
      <Text style={styles.groupTitle}>🗾 地方別コース</Text>
      {STAMP_RALLIES.filter(
        (r) => !["legendary", "modern"].includes(r.id)
      ).map((rally) => (
        <RallyCard
          key={rally.id}
          rally={rally}
          posts={posts}
          onPress={() => {
            setSelectedRally(rally);
            setViewMode("detail");
          }}
        />
      ))}
    </ScrollView>
  );
}

// ===== ラリーカード =====
function RallyCard({
  rally,
  posts,
  onPress,
}: {
  rally: StampRally;
  posts: ReturnType<typeof useApp>["posts"];
  onPress: () => void;
}) {
  const progress = getRallyProgress(rally, posts);
  const isComplete = progress.stamped.size === progress.total;

  return (
    <TouchableOpacity
      style={styles.rallyCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* カラーアクセント */}
      <View style={[styles.rallyAccent, { backgroundColor: rally.color }]} />

      <View style={styles.rallyBody}>
        {/* ヘッダー行 */}
        <View style={styles.rallyHeaderRow}>
          <View style={[styles.rallyEmojiWrap, { backgroundColor: rally.color + "15" }]}>
            <Text style={styles.rallyEmoji}>{rally.emoji}</Text>
          </View>
          <View style={styles.rallyHeaderInfo}>
            <View style={styles.rallyNameRow}>
              <Text style={styles.rallyName} numberOfLines={1}>{rally.name}</Text>
              {isComplete && (
                <View style={styles.completeBadge}>
                  <Text style={styles.completeBadgeText}>達成</Text>
                </View>
              )}
            </View>
            <Text style={styles.rallyDesc} numberOfLines={2}>{rally.description}</Text>
          </View>
        </View>

        {/* スタンプミニプレビュー */}
        <View style={styles.miniStampRow}>
          {rally.breweries.slice(0, 8).map((b) => {
            const has = progress.stamped.has(b.id);
            return (
              <View
                key={b.id}
                style={[
                  styles.miniStamp,
                  has
                    ? [styles.miniStampDone, { borderColor: rally.color }]
                    : undefined,
                ]}
              >
                {has ? (
                  <Text style={[styles.miniStampText, { color: rally.color }]}>
                    {b.name.charAt(0)}
                  </Text>
                ) : (
                  <Text style={styles.miniStampEmpty}>・</Text>
                )}
              </View>
            );
          })}
          {rally.breweries.length > 8 && (
            <View style={styles.miniStampMore}>
              <Text style={styles.miniStampMoreText}>+{rally.breweries.length - 8}</Text>
            </View>
          )}
        </View>

        {/* プログレス */}
        <View style={styles.rallyFooter}>
          <View style={styles.rallyProgressWrap}>
            <View style={styles.rallyProgressBg}>
              <View
                style={[
                  styles.rallyProgressFill,
                  {
                    width: `${progress.percentage}%`,
                    backgroundColor: isComplete ? COLORS.star : rally.color,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.rallyProgressNum, { color: rally.color }]}>
            {progress.stamped.size}/{progress.total}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ===== ラリー詳細画面 =====
function RallyDetail({
  rally,
  posts,
  onBack,
}: {
  rally: StampRally;
  posts: ReturnType<typeof useApp>["posts"];
  onBack: () => void;
}) {
  const progress = getRallyProgress(rally, posts);
  const isComplete = progress.stamped.size === progress.total;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 戻るボタン */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← 一覧に戻る</Text>
      </TouchableOpacity>

      {/* 詳細ヘッダー */}
      <View style={[styles.detailHero, { borderColor: rally.color + "40" }]}>
        <View style={[styles.detailHeroBanner, { backgroundColor: rally.color + "10" }]}>
          <Text style={styles.detailEmoji}>{rally.emoji}</Text>
          <Text style={styles.detailName}>{rally.name}</Text>
          <Text style={styles.detailDesc}>{rally.description}</Text>
          {isComplete && (
            <View style={[styles.completeRibbon, { backgroundColor: COLORS.star + "18" }]}>
              <Text style={styles.completeRibbonIcon}>🎊</Text>
              <Text style={styles.completeRibbonText}>コンプリート！</Text>
            </View>
          )}
        </View>
        <View style={styles.detailStatsRow}>
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatNum, { color: rally.color }]}>
              {progress.stamped.size}
            </Text>
            <Text style={styles.detailStatLabel}>獲得</Text>
          </View>
          <View style={styles.detailStatDivider} />
          <View style={styles.detailStatItem}>
            <Text style={styles.detailStatNum}>{progress.total}</Text>
            <Text style={styles.detailStatLabel}>全蔵</Text>
          </View>
          <View style={styles.detailStatDivider} />
          <View style={styles.detailStatItem}>
            <Text style={[styles.detailStatNum, { color: COLORS.star }]}>
              {progress.percentage}%
            </Text>
            <Text style={styles.detailStatLabel}>達成率</Text>
          </View>
        </View>
        <View style={styles.detailProgressBg}>
          <View
            style={[
              styles.detailProgressFill,
              {
                width: `${progress.percentage}%`,
                backgroundColor: isComplete ? COLORS.star : rally.color,
              },
            ]}
          />
        </View>
      </View>

      {/* スタンプカード */}
      <View style={styles.stampBook}>
        <View style={styles.stampBookHeader}>
          <View style={[styles.stampBookLine, { backgroundColor: rally.color + "30" }]} />
          <Text style={styles.stampBookTitle}>スタンプカード</Text>
          <View style={[styles.stampBookLine, { backgroundColor: rally.color + "30" }]} />
        </View>
        <View style={styles.stampGrid}>
          {rally.breweries.map((brewery) => {
            const has = progress.stamped.has(brewery.id);
            const relatedPosts = posts.filter((p) => p.brewery === brewery.name);
            return (
              <View key={brewery.id} style={styles.stampSlot}>
                <View
                  style={[
                    styles.stampCircle,
                    has
                      ? { backgroundColor: rally.color + "12", borderColor: rally.color }
                      : undefined,
                  ]}
                >
                  {has ? (
                    <View style={styles.stampSealWrap}>
                      <View style={[styles.stampSeal, { backgroundColor: rally.color + "18" }]}>
                        <Text style={[styles.stampSealChar, { color: rally.color }]}>
                          {brewery.name.charAt(0)}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.stampEmptyInner}>
                      <Text style={styles.stampEmptyChar}>?</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.stampName,
                    has && { color: rally.color, fontWeight: "700" },
                  ]}
                  numberOfLines={1}
                >
                  {brewery.name}
                </Text>
                <Text style={styles.stampRegion} numberOfLines={1}>
                  {brewery.region}
                </Text>
                {has && relatedPosts.length > 0 && (
                  <View style={[styles.stampCount, { backgroundColor: rally.color + "15" }]}>
                    <Text style={[styles.stampCountText, { color: rally.color }]}>
                      {relatedPosts.length}本記録
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 酒蔵ガイド */}
      <View style={styles.guideSection}>
        <Text style={styles.guideTitle}>🍶 酒蔵ガイド</Text>
        {rally.breweries.map((brewery) => {
          const has = progress.stamped.has(brewery.id);
          const relatedPosts = posts.filter((p) => p.brewery === brewery.name);
          return (
            <View
              key={brewery.id}
              style={[
                styles.guideCard,
                has && { borderLeftColor: rally.color },
              ]}
            >
              <View style={styles.guideCardBody}>
                <View style={styles.guideCardHeader}>
                  <View
                    style={[
                      styles.guideStampMark,
                      has
                        ? { backgroundColor: rally.color }
                        : undefined,
                    ]}
                  >
                    <Text style={[styles.guideStampText, has && { color: COLORS.white }]}>
                      {has ? "済" : "未"}
                    </Text>
                  </View>
                  <View style={styles.guideCardInfo}>
                    <Text style={[styles.guideName, has && { color: rally.color }]}>
                      {brewery.name}
                    </Text>
                    <View style={styles.guideRegionRow}>
                      <Text style={styles.guideRegion}>{brewery.region}</Text>
                    </View>
                  </View>
                  {has && relatedPosts.length > 0 && (
                    <View style={[styles.guideRecordBadge, { backgroundColor: rally.color + "12" }]}>
                      <Text style={[styles.guideRecordNum, { color: rally.color }]}>
                        {relatedPosts.length}
                      </Text>
                      <Text style={[styles.guideRecordUnit, { color: rally.color }]}>本</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.guideDesc}>{brewery.description}</Text>
                <View style={styles.guideFamousRow}>
                  <Text style={styles.guideFamousLabel}>代表銘柄</Text>
                  <Text style={[styles.guideFamousName, { color: rally.color }]}>
                    {brewery.famous}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },

  // ===== ヒーロー =====
  heroSection: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  heroIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  heroTitleWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
  },
  heroSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ===== 総合統計 =====
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
  },

  // ===== グループ見出し =====
  groupTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },

  // ===== ラリーカード =====
  rallyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rallyAccent: {
    width: 5,
  },
  rallyBody: {
    flex: 1,
    padding: SPACING.md,
  },
  rallyHeaderRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  rallyEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  rallyEmoji: {
    fontSize: 24,
  },
  rallyHeaderInfo: {
    flex: 1,
  },
  rallyNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  rallyName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  completeBadge: {
    backgroundColor: COLORS.star + "18",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  completeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.star,
  },
  rallyDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },

  // ミニスタンプ
  miniStampRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: SPACING.sm,
  },
  miniStamp: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  miniStampDone: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
  },
  miniStampText: {
    fontSize: 11,
    fontWeight: "800",
  },
  miniStampEmpty: {
    fontSize: 10,
    color: COLORS.borderLight,
  },
  miniStampMore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  miniStampMoreText: {
    fontSize: 9,
    color: COLORS.textLight,
    fontWeight: "600",
  },

  // プログレス
  rallyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  rallyProgressWrap: {
    flex: 1,
  },
  rallyProgressBg: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: "hidden",
  },
  rallyProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  rallyProgressNum: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "right",
  },

  // ===== 詳細画面 =====
  backBtn: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  backBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // 詳細ヒーロー
  detailHero: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  detailHeroBanner: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  detailEmoji: {
    fontSize: 52,
  },
  detailName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  detailDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
    lineHeight: 20,
  },
  completeRibbon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  completeRibbonIcon: {
    fontSize: 18,
  },
  completeRibbonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.star,
  },
  detailStatsRow: {
    flexDirection: "row",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  detailStatItem: {
    flex: 1,
    alignItems: "center",
  },
  detailStatNum: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  detailStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  detailStatDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  detailProgressBg: {
    height: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailProgressFill: {
    height: "100%",
    borderRadius: 4,
  },

  // ===== スタンプブック =====
  stampBook: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stampBookHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  stampBookLine: {
    flex: 1,
    height: 1,
  },
  stampBookTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.md,
  },
  stampSlot: {
    width: 88,
    alignItems: "center",
  },
  stampCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
  },
  stampSealWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  stampSeal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  stampSealChar: {
    fontSize: 22,
    fontWeight: "900",
  },
  stampEmptyInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  stampEmptyChar: {
    fontSize: 22,
    color: COLORS.borderLight,
    fontWeight: "300",
  },
  stampName: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  stampRegion: {
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 1,
  },
  stampCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.full,
    marginTop: 3,
  },
  stampCountText: {
    fontSize: 8,
    fontWeight: "700",
  },

  // ===== 酒蔵ガイド =====
  guideSection: {
    marginBottom: SPACING.lg,
  },
  guideTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  guideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  guideCardBody: {
    padding: SPACING.md,
  },
  guideCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideStampMark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  guideStampText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "800",
    color: COLORS.textLight,
  },
  guideCardInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  guideRegionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  guideRegion: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  guideRecordBadge: {
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
  },
  guideRecordNum: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
  },
  guideRecordUnit: {
    fontSize: 9,
    fontWeight: "600",
  },
  guideDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
  guideFamousRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  guideFamousLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  guideFamousName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});
