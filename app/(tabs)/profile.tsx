import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SAKE_TYPE_LABELS } from "../../src/types";
import {
  getCollectorRank,
  getNextRank,
  getEarnedBadges,
  getRegionStats,
  getTypeStats,
} from "../../src/constants/collection";

export default function ProfileScreen() {
  const { profile, posts, shelves, updateProfile } = useApp();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteBrewing, setFavoriteBrewing] = useState(profile.favoriteBrewing);

  const totalPosts = posts.length;
  const totalShelves = shelves.length;
  const publicShelves = shelves.filter((s) => s.isPublic).length;

  const rank = getCollectorRank(totalPosts);
  const nextRank = getNextRank(totalPosts);
  const earnedBadges = getEarnedBadges(posts, totalShelves, publicShelves);
  const regionStats = getRegionStats(posts);
  const typeStats = getTypeStats(posts);

  const typeCount: Record<string, number> = {};
  posts.forEach((p) => {
    typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  });
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

  const regionCount: Record<string, number> = {};
  posts.forEach((p) => {
    if (p.region) regionCount[p.region] = (regionCount[p.region] || 0) + 1;
  });
  const topRegion = Object.entries(regionCount).sort((a, b) => b[1] - a[1])[0];

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      await updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    await updateProfile({
      displayName: displayName.trim() || "日本酒ファン",
      bio: bio.trim(),
      favoriteBrewing: favoriteBrewing.trim(),
    });
    setEditing(false);
    Alert.alert("保存しました！");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header card */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
          <View style={styles.avatarImage}>
            <Text style={styles.avatarFallback}>
              {profile.displayName.charAt(0)}
            </Text>
          </View>
          <Text style={styles.editAvatarText}>変更</Text>
        </TouchableOpacity>

        {editing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.editInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="表示名"
              placeholderTextColor={COLORS.textLight}
            />
            <TextInput
              style={[styles.editInput, styles.editInputMultiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="自己紹介"
              placeholderTextColor={COLORS.textLight}
              multiline
            />
            <TextInput
              style={styles.editInput}
              value={favoriteBrewing}
              onChangeText={setFavoriteBrewing}
              placeholder="お気に入りの産地"
              placeholderTextColor={COLORS.textLight}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelEditBtn}
                onPress={() => {
                  setDisplayName(profile.displayName);
                  setBio(profile.bio);
                  setFavoriteBrewing(profile.favoriteBrewing);
                  setEditing(false);
                }}
              >
                <Text style={styles.cancelEditText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            {/* ランクバッジ */}
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeEmoji}>{rank.emoji}</Text>
              <Text style={styles.rankBadgeText}>Lv.{rank.level} {rank.title}</Text>
            </View>
            <Text style={styles.displayName}>{profile.displayName}</Text>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            {profile.favoriteBrewing ? (
              <Text style={styles.favoriteRegion}>
                📍 {profile.favoriteBrewing}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editProfileBtnText}>プロフィールを編集</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalShelves}</Text>
          <Text style={styles.statLabel}>棚</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalPosts}</Text>
          <Text style={styles.statLabel}>記録</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{publicShelves}</Text>
          <Text style={styles.statLabel}>公開中</Text>
        </View>
      </View>

      {/* コレクション進捗 */}
      <View style={styles.collectionProgress}>
        <Text style={styles.sectionTitle}>コレクション進捗</Text>
        <View style={styles.progressGrid}>
          <View style={styles.progressItem}>
            <Text style={styles.progressEmoji}>🗾</Text>
            <Text style={styles.progressNum}>{regionStats.covered.size}/47</Text>
            <Text style={styles.progressLabel}>都道府県</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgressFill, { width: `${regionStats.percentage}%` }]} />
            </View>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressEmoji}>📖</Text>
            <Text style={styles.progressNum}>{typeStats.collectedCount}/{typeStats.total}</Text>
            <Text style={styles.progressLabel}>酒タイプ</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgressFill, { width: `${typeStats.percentage}%` }]} />
            </View>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressEmoji}>🏅</Text>
            <Text style={styles.progressNum}>{earnedBadges.length}</Text>
            <Text style={styles.progressLabel}>実績</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgressFill, { width: `${Math.round((earnedBadges.length / 25) * 100)}%` }]} />
            </View>
          </View>
        </View>
        {nextRank && (
          <View style={styles.nextRankRow}>
            <Text style={styles.nextRankText}>
              次のランク「{nextRank.emoji} {nextRank.title}」まであと{nextRank.minSakes - totalPosts}本
            </Text>
            <View style={styles.rankProgressBar}>
              <View
                style={[
                  styles.rankProgressFill,
                  {
                    width: `${Math.min(
                      ((totalPosts - rank.minSakes) / (nextRank.minSakes - rank.minSakes)) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* バッジプレビュー */}
      {earnedBadges.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>獲得バッジ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {earnedBadges.slice(0, 8).map((badge) => (
              <View key={badge.id} style={styles.badgePreview}>
                <Text style={styles.badgePreviewEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgePreviewName} numberOfLines={1}>{badge.name}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.badgePreviewMore}
              onPress={() => router.push("/(tabs)/collection")}
            >
              <Text style={styles.badgePreviewMoreText}>すべて見る →</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* マイ棚一覧（メインコンテンツ） */}
      <Text style={styles.sectionTitle}>マイ棚</Text>
      {shelves.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🗄️</Text>
          <Text style={styles.emptyText}>棚を作ってお酒をコレクションしよう</Text>
        </View>
      ) : (
        shelves.map((shelf) => {
          const count = posts.filter((p) => p.shelfId === shelf.id).length;
          return (
            <TouchableOpacity
              key={shelf.id}
              style={styles.shelfRow}
              onPress={() => router.push(`/shelf/${shelf.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.shelfEmoji}>{shelf.emoji}</Text>
              <View style={styles.shelfInfo}>
                <Text style={styles.shelfName}>{shelf.name}</Text>
                <Text style={styles.shelfMeta}>
                  {count}本 · {shelf.isPublic ? "🌐 公開中" : "🔒 非公開"}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        })
      )}

      {/* Insights */}
      <Text style={styles.sectionTitle}>あなたの日本酒レポート</Text>
      <View style={styles.insightsCard}>
        {posts.length === 0 ? (
          <Text style={styles.insightsEmpty}>
            お酒を追加すると、あなたの好みの傾向が表示されます
          </Text>
        ) : (
          <>
            {topType && (
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>よく飲む種類</Text>
                <Text style={styles.insightValue}>
                  {SAKE_TYPE_LABELS[topType[0] as keyof typeof SAKE_TYPE_LABELS]} ({topType[1]}回)
                </Text>
              </View>
            )}
            {topRegion && (
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>よく飲む産地</Text>
                <Text style={styles.insightValue}>
                  {topRegion[0]} ({topRegion[1]}回)
                </Text>
              </View>
            )}
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>記録本数</Text>
              <Text style={styles.insightValue}>{totalPosts}本</Text>
            </View>
          </>
        )}
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
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallback: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.white,
  },
  editAvatarText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  profileInfo: {
    alignItems: "center",
  },
  displayName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
  },
  bio: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  favoriteRegion: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  editProfileBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editProfileBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
  editForm: {
    width: "100%",
  },
  editInput: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  editInputMultiline: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelEditBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
  },
  cancelEditText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: "center",
  },
  shelfRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  shelfEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  shelfInfo: {
    flex: 1,
  },
  shelfName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.text,
  },
  shelfMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textLight,
    fontWeight: "300",
  },
  insightsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  insightsEmpty: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: "center",
    padding: SPACING.md,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  insightLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  insightValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },

  // ランクバッジ
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary + "20",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
    gap: 4,
  },
  rankBadgeEmoji: {
    fontSize: 16,
  },
  rankBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  // コレクション進捗
  collectionProgress: {
    marginTop: SPACING.sm,
  },
  progressGrid: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  progressItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  progressEmoji: {
    fontSize: 24,
  },
  progressNum: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  progressLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  miniProgressBar: {
    width: "100%",
    height: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: 2,
    marginTop: SPACING.sm,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  nextRankRow: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  nextRankText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  rankProgressBar: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  rankProgressFill: {
    height: "100%",
    backgroundColor: COLORS.star,
    borderRadius: 3,
  },

  // バッジプレビュー
  badgePreview: {
    width: 72,
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  badgePreviewEmoji: {
    fontSize: 32,
  },
  badgePreviewName: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 2,
  },
  badgePreviewMore: {
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  badgePreviewMoreText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
