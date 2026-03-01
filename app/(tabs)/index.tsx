import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { RatingStars } from "../../src/components/RatingStars";
import { SAKE_TYPE_LABELS, TimelinePost } from "../../src/types";

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}日前`;
}

function TimelineCard({ post, onLike }: { post: TimelinePost; onLike: () => void }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike();
    }
  };

  return (
    <View style={styles.card}>
      {/* User header */}
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.user.displayName.charAt(0)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.displayName}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Sake image */}
      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.sakeImage} />
      ) : (
        <View style={[styles.sakeImage, styles.placeholderImage]}>
          <Text style={styles.placeholderEmoji}>🍶</Text>
          <Text style={styles.placeholderName}>{post.name}</Text>
        </View>
      )}

      {/* Sake info */}
      <View style={styles.content}>
        <Text style={styles.sakeName}>{post.name}</Text>
        <Text style={styles.brewery}>
          {post.brewery} · {post.region}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{SAKE_TYPE_LABELS[post.type]}</Text>
          </View>
          <RatingStars rating={post.rating} size={16} />
        </View>
        {post.comment ? (
          <Text style={styles.comment}>{post.comment}</Text>
        ) : null}

        {/* Action bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Text style={[styles.actionIcon, liked && styles.actionIconActive]}>
              {liked ? "❤️" : "🤍"}
            </Text>
            <Text style={[styles.actionCount, liked && styles.actionCountActive]}>
              {post.likes + (liked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>コメント</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🔖</Text>
            <Text style={styles.actionCount}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TimelineScreen() {
  const { timeline, toggleLike } = useApp();

  return (
    <View style={styles.container}>
      <FlatList
        data={timeline}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TimelineCard post={item} onLike={() => toggleLike(item.id)} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🍶 SakeSnap</Text>
            <Text style={styles.headerSubtitle}>日本酒仲間のタイムライン</Text>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  userInfo: {
    marginLeft: SPACING.sm,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  timeAgo: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  sakeImage: {
    width: "100%",
    height: 280,
  },
  placeholderImage: {
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  placeholderName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  content: {
    padding: SPACING.md,
  },
  sakeName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
  brewery: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.primaryLight + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
  },
  comment: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  actionBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: SPACING.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionIconActive: {
    color: COLORS.like,
  },
  actionCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  actionCountActive: {
    color: COLORS.like,
    fontWeight: "600",
  },
});
