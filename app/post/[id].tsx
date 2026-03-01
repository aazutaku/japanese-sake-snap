import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SAKE_TYPE_LABELS } from "../../src/types";
import { RatingStars } from "../../src/components/RatingStars";
import { EmptyState } from "../../src/components/EmptyState";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, shelves, deletePost } = useApp();
  const router = useRouter();

  const post = posts.find((p) => p.id === id);
  const shelf = post ? shelves.find((s) => s.id === post.shelfId) : null;

  if (!post) {
    return (
      <View style={styles.container}>
        <EmptyState emoji="❓" title="見つかりません" message="この記録は削除されたようです" />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(`「${post.name}」を削除`, "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await deletePost(post.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: post.name }} />

      {/* Image */}
      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderEmoji}>🍶</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>{post.name}</Text>
        <RatingStars rating={post.rating} size={24} />

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>酒蔵</Text>
            <Text style={styles.detailValue}>{post.brewery || "–"}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>産地</Text>
            <Text style={styles.detailValue}>{post.region || "–"}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>種類</Text>
            <Text style={styles.detailValue}>
              {SAKE_TYPE_LABELS[post.type]}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>棚</Text>
            <Text style={styles.detailValue}>
              {shelf ? `${shelf.emoji} ${shelf.name}` : "–"}
            </Text>
          </View>
        </View>

        {post.comment ? (
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>感想</Text>
            <Text style={styles.comment}>{post.comment}</Text>
          </View>
        ) : null}

        <Text style={styles.date}>
          記録日: {formatDate(post.createdAt)}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>この記録を削除</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl * 2,
  },
  image: {
    width: "100%",
    height: 320,
  },
  placeholderImage: {
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    margin: SPACING.md,
    marginTop: -SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  detailItem: {
    width: "45%",
  },
  detailLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: "600",
  },
  commentSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  commentLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  comment: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    lineHeight: 26,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
    textAlign: "right",
  },
  deleteBtn: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.like,
    alignItems: "center",
  },
  deleteBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.like,
    fontWeight: "600",
  },
});
