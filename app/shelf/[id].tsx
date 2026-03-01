import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SakeCard } from "../../src/components/SakeCard";
import { EmptyState } from "../../src/components/EmptyState";
import { RatingStars } from "../../src/components/RatingStars";
import { SAKE_TYPE_LABELS, SakePost } from "../../src/types";

function SakeListItem({ sake, onPress }: { sake: SakePost; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.sakeItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.sakeThumb}>
        <Text style={styles.sakeThumbEmoji}>🍶</Text>
      </View>
      <View style={styles.sakeInfo}>
        <Text style={styles.sakeName} numberOfLines={1}>{sake.name}</Text>
        <Text style={styles.sakeBrewery}>{sake.brewery} · {sake.region}</Text>
        <View style={styles.sakeMeta}>
          <View style={styles.sakeTypeBadge}>
            <Text style={styles.sakeTypeText}>{SAKE_TYPE_LABELS[sake.type]}</Text>
          </View>
          <RatingStars rating={sake.rating} size={12} />
        </View>
        {sake.comment ? (
          <Text style={styles.sakeComment} numberOfLines={2}>{sake.comment}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function ShelfDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    shelves,
    getShelfPosts,
    deletePost,
    publicShelves,
    toggleShelfLike,
    likedShelfIds,
  } = useApp();
  const router = useRouter();

  // 公開棚 or 自分の棚を判定
  const isPublic = id?.startsWith("public-");
  const actualId = isPublic ? id?.replace("public-", "") : id;

  if (isPublic) {
    const pubShelf = publicShelves.find((s) => s.id === actualId);
    if (!pubShelf) {
      return (
        <View style={styles.container}>
          <EmptyState emoji="❓" title="棚が見つかりません" message="この棚は削除されたようです" />
        </View>
      );
    }

    const liked = likedShelfIds.has(pubShelf.id);

    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: `${pubShelf.emoji} ${pubShelf.name}` }} />
        <FlatList
          data={pubShelf.sakes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SakeListItem sake={item} />}
          ListHeaderComponent={
            <View>
              {/* 棚ヘッダー */}
              <View style={styles.pubHeader}>
                <Text style={styles.pubEmoji}>{pubShelf.emoji}</Text>
                <Text style={styles.pubName}>{pubShelf.name}</Text>
                <Text style={styles.pubDesc}>{pubShelf.description}</Text>

                {/* オーナー */}
                <View style={styles.ownerRow}>
                  <View style={styles.ownerAvatar}>
                    <Text style={styles.ownerAvatarText}>
                      {pubShelf.owner.displayName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.ownerName}>{pubShelf.owner.displayName}</Text>
                    <Text style={styles.ownerBio} numberOfLines={1}>{pubShelf.owner.bio}</Text>
                  </View>
                </View>

                {/* Stats & Actions */}
                <View style={styles.pubStatsRow}>
                  <View style={styles.pubStat}>
                    <Text style={styles.pubStatNum}>{pubShelf.sakes.length}</Text>
                    <Text style={styles.pubStatLabel}>本</Text>
                  </View>
                  <View style={styles.pubStatDivider} />
                  <View style={styles.pubStat}>
                    <Text style={styles.pubStatNum}>{pubShelf.likes + (liked ? 1 : 0)}</Text>
                    <Text style={styles.pubStatLabel}>いいね</Text>
                  </View>
                  <View style={styles.pubStatDivider} />
                  <View style={styles.pubStat}>
                    <Text style={styles.pubStatNum}>{pubShelf.followers}</Text>
                    <Text style={styles.pubStatLabel}>フォロワー</Text>
                  </View>
                </View>

                <View style={styles.pubActions}>
                  <TouchableOpacity
                    style={[styles.likeBtn, liked && styles.likeBtnActive]}
                    onPress={() => toggleShelfLike(pubShelf.id)}
                  >
                    <Text style={styles.likeBtnText}>
                      {liked ? "❤️ いいね済み" : "🤍 いいね"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.followBtn}>
                    <Text style={styles.followBtnText}>棚をフォロー</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.listTitle}>
                🍶 この棚のお酒 ({pubShelf.sakes.length}本)
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // --- 自分の棚 ---
  const shelf = shelves.find((s) => s.id === actualId);
  const posts = actualId ? getShelfPosts(actualId) : [];

  if (!shelf) {
    return (
      <View style={styles.container}>
        <EmptyState emoji="❓" title="棚が見つかりません" message="この棚は削除されたようです" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${shelf.emoji} ${shelf.name}` }} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SakeCard
            post={item}
            onPress={() => router.push(`/post/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.myHeader}>
            <Text style={styles.myEmoji}>{shelf.emoji}</Text>
            <Text style={styles.myName}>{shelf.name}</Text>
            {shelf.description ? (
              <Text style={styles.myDesc}>{shelf.description}</Text>
            ) : null}
            <View style={styles.myBadgeRow}>
              <View style={[styles.visibilityBadge, shelf.isPublic && styles.visibilityBadgePublic]}>
                <Text style={[styles.visibilityText, shelf.isPublic && styles.visibilityTextPublic]}>
                  {shelf.isPublic ? "🌐 公開中" : "🔒 非公開"}
                </Text>
              </View>
              <Text style={styles.myCount}>{posts.length}本のお酒</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🍶"
            title="まだお酒がありません"
            message="「追加」タブからお酒を追加して、この棚に入れましょう"
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(tabs)/add")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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

  // --- 公開棚ヘッダー ---
  pubHeader: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pubEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  pubName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  pubDesc: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignSelf: "stretch",
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  ownerAvatarText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.lg,
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
  pubStatsRow: {
    flexDirection: "row",
    marginTop: SPACING.lg,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  pubStat: {
    flex: 1,
    alignItems: "center",
  },
  pubStatNum: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.primary,
  },
  pubStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  pubStatDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },
  pubActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    alignSelf: "stretch",
  },
  likeBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.like,
    alignItems: "center",
  },
  likeBtnActive: {
    backgroundColor: COLORS.like + "15",
  },
  likeBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.like,
  },
  followBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  followBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.white,
  },
  listTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  // --- 酒リストアイテム ---
  sakeItem: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sakeThumb: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  sakeThumbEmoji: {
    fontSize: 28,
  },
  sakeInfo: {
    flex: 1,
  },
  sakeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  sakeBrewery: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sakeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  sakeTypeBadge: {
    backgroundColor: COLORS.primaryLight + "20",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.sm,
  },
  sakeTypeText: {
    fontSize: 9,
    color: COLORS.primary,
    fontWeight: "600",
  },
  sakeComment: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },

  // --- 自分の棚ヘッダー ---
  myHeader: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  myEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  myName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
  },
  myDesc: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  myBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  visibilityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
  },
  visibilityBadgePublic: {
    backgroundColor: COLORS.accentLight + "20",
  },
  visibilityText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  visibilityTextPublic: {
    color: COLORS.accent,
  },
  myCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: "700",
    marginTop: -2,
  },
});
