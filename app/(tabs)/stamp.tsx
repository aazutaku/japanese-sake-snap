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
import {
  STAMP_RALLIES,
  StampRally,
  getRallyProgress,
  getTotalStamps,
} from "../../src/constants/stampRally";

export default function StampRallyScreen() {
  const { posts } = useApp();
  const [selectedRally, setSelectedRally] = useState<StampRally | null>(null);
  const totalStamps = getTotalStamps(posts);

  if (selectedRally) {
    return (
      <RallyDetail
        rally={selectedRally}
        posts={posts}
        onBack={() => setSelectedRally(null)}
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
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🏯</Text>
        <Text style={styles.headerTitle}>酒蔵スタンプラリー</Text>
        <Text style={styles.headerSub}>全国の名門酒蔵を巡ってスタンプを集めよう</Text>
      </View>

      {/* 総合進捗 */}
      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <View style={styles.totalStat}>
            <Text style={styles.totalNum}>{totalStamps.stamped}</Text>
            <Text style={styles.totalLabel}>獲得スタンプ</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={styles.totalNum}>{totalStamps.total}</Text>
            <Text style={styles.totalLabel}>全スタンプ</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={styles.totalNum}>{STAMP_RALLIES.length}</Text>
            <Text style={styles.totalLabel}>コース</Text>
          </View>
        </View>
        <View style={styles.totalProgress}>
          <View
            style={[
              styles.totalProgressFill,
              { width: `${totalStamps.total > 0 ? (totalStamps.stamped / totalStamps.total) * 100 : 0}%` },
            ]}
          />
        </View>
      </View>

      {/* ラリー一覧 */}
      {STAMP_RALLIES.map((rally) => {
        const progress = getRallyProgress(rally, posts);
        const isComplete = progress.stamped.size === progress.total;
        return (
          <TouchableOpacity
            key={rally.id}
            style={[styles.rallyCard, isComplete && styles.rallyCardComplete]}
            onPress={() => setSelectedRally(rally)}
            activeOpacity={0.8}
          >
            <View style={styles.rallyHeader}>
              <Text style={styles.rallyEmoji}>{rally.emoji}</Text>
              <View style={styles.rallyInfo}>
                <View style={styles.rallyTitleRow}>
                  <Text style={styles.rallyName}>{rally.name}</Text>
                  {isComplete && <Text style={styles.completeBadge}>COMPLETE</Text>}
                </View>
                <Text style={styles.rallyDesc}>{rally.description}</Text>
              </View>
            </View>

            {/* スタンプ進捗 */}
            <View style={styles.stampRow}>
              {rally.breweries.map((brewery) => {
                const has = progress.stamped.has(brewery.id);
                return (
                  <View
                    key={brewery.id}
                    style={[styles.stampCircle, has && styles.stampCircleDone]}
                  >
                    <Text style={styles.stampIcon}>{has ? "🏯" : "○"}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.rallyProgress}>
              <View
                style={[styles.rallyProgressFill, { width: `${progress.percentage}%` }]}
              />
            </View>
            <Text style={styles.rallyProgressText}>
              {progress.stamped.size}/{progress.total} ({progress.percentage}%)
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
        <Text style={styles.backBtnText}>← スタンプラリー一覧</Text>
      </TouchableOpacity>

      {/* ラリーヘッダー */}
      <View style={[styles.detailHeader, isComplete && styles.detailHeaderComplete]}>
        <Text style={styles.detailEmoji}>{rally.emoji}</Text>
        <Text style={styles.detailName}>{rally.name}</Text>
        <Text style={styles.detailDesc}>{rally.description}</Text>
        {isComplete && (
          <View style={styles.completeCard}>
            <Text style={styles.completeCardEmoji}>🎊</Text>
            <Text style={styles.completeCardText}>コンプリート！</Text>
          </View>
        )}
        <View style={styles.detailProgress}>
          <View style={[styles.detailProgressFill, { width: `${progress.percentage}%` }]} />
        </View>
        <Text style={styles.detailProgressText}>
          {progress.stamped.size}/{progress.total} スタンプ獲得
        </Text>
      </View>

      {/* スタンプカード */}
      <View style={styles.stampCard}>
        <Text style={styles.stampCardTitle}>スタンプカード</Text>
        <View style={styles.stampGrid}>
          {rally.breweries.map((brewery) => {
            const has = progress.stamped.has(brewery.id);
            const relatedPosts = posts.filter((p) => p.brewery === brewery.name);
            return (
              <View
                key={brewery.id}
                style={[styles.stampSlot, has && styles.stampSlotDone]}
              >
                <Text style={styles.stampSlotIcon}>{has ? "🏯" : "?"}</Text>
                <Text
                  style={[styles.stampSlotName, has && styles.stampSlotNameDone]}
                  numberOfLines={1}
                >
                  {brewery.name}
                </Text>
                {has && relatedPosts.length > 0 && (
                  <Text style={styles.stampSlotCount}>{relatedPosts.length}本</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 酒蔵リスト */}
      <Text style={styles.breweryListTitle}>酒蔵ガイド</Text>
      {rally.breweries.map((brewery) => {
        const has = progress.stamped.has(brewery.id);
        const relatedPosts = posts.filter((p) => p.brewery === brewery.name);
        return (
          <View
            key={brewery.id}
            style={[styles.breweryItem, has && styles.breweryItemDone]}
          >
            <View style={styles.breweryLeft}>
              <View style={[styles.breweryStamp, has && styles.breweryStampDone]}>
                <Text style={styles.breweryStampText}>{has ? "済" : "未"}</Text>
              </View>
              <View style={styles.breweryInfo}>
                <Text style={[styles.breweryName, has && styles.breweryNameDone]}>
                  {brewery.name}
                </Text>
                <Text style={styles.breweryRegion}>{brewery.region}</Text>
                <Text style={styles.breweryDesc}>{brewery.description}</Text>
                <Text style={styles.breweryFamous}>代表銘柄: {brewery.famous}</Text>
              </View>
            </View>
            {has && relatedPosts.length > 0 && (
              <View style={styles.breweryRecords}>
                <Text style={styles.breweryRecordCount}>{relatedPosts.length}本</Text>
                <Text style={styles.breweryRecordLabel}>記録</Text>
              </View>
            )}
          </View>
        );
      })}
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
  header: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  headerEmoji: {
    fontSize: 48,
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  headerSub: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },

  // 総合進捗
  totalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  totalStat: {
    flex: 1,
    alignItems: "center",
  },
  totalNum: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.primary,
  },
  totalLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  totalDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },
  totalProgress: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  totalProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },

  // ラリーカード
  rallyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rallyCardComplete: {
    borderWidth: 2,
    borderColor: COLORS.star,
  },
  rallyHeader: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  rallyEmoji: {
    fontSize: 36,
    marginRight: SPACING.sm,
  },
  rallyInfo: {
    flex: 1,
  },
  rallyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  rallyName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  completeBadge: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.star,
    backgroundColor: COLORS.star + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  rallyDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  stampRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  stampCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
  },
  stampCircleDone: {
    backgroundColor: COLORS.primary + "15",
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  stampIcon: {
    fontSize: 18,
  },

  rallyProgress: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  rallyProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  rallyProgressText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: "right",
    marginTop: SPACING.xs,
  },

  // --- ラリー詳細 ---
  backBtn: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  backBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "600",
  },
  detailHeader: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  detailHeaderComplete: {
    borderWidth: 2,
    borderColor: COLORS.star,
  },
  detailEmoji: {
    fontSize: 56,
  },
  detailName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  detailDesc: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
    lineHeight: 22,
  },
  completeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.star + "15",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  completeCardEmoji: {
    fontSize: 20,
  },
  completeCardText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.star,
  },
  detailProgress: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: SPACING.lg,
  },
  detailProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  detailProgressText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: SPACING.xs,
  },

  // スタンプカード
  stampCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  stampCardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.md,
  },
  stampSlot: {
    width: 80,
    height: 90,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
    padding: SPACING.xs,
  },
  stampSlotDone: {
    backgroundColor: COLORS.primary + "10",
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  stampSlotIcon: {
    fontSize: 28,
  },
  stampSlotName: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  stampSlotNameDone: {
    color: COLORS.primary,
  },
  stampSlotCount: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: "700",
  },

  // 酒蔵リスト
  breweryListTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  breweryItem: {
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
  breweryItemDone: {
    borderLeftColor: COLORS.primary,
  },
  breweryLeft: {
    flexDirection: "row",
    flex: 1,
  },
  breweryStamp: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  breweryStampDone: {
    backgroundColor: COLORS.primary,
  },
  breweryStampText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "800",
    color: COLORS.textLight,
  },
  breweryInfo: {
    flex: 1,
  },
  breweryName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  breweryNameDone: {
    color: COLORS.primary,
  },
  breweryRegion: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  breweryDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  breweryFamous: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: "600",
    marginTop: 2,
  },
  breweryRecords: {
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  breweryRecordCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
  },
  breweryRecordLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
});
