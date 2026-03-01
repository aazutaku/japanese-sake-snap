import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../constants/theme";
import { SakePost, SAKE_TYPE_LABELS } from "../types";
import { RatingStars } from "./RatingStars";

interface Props {
  post: SakePost;
  onPress?: () => void;
  compact?: boolean;
}

export function SakeCard({ post, onPress, compact = false }: Props) {
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        {post.imageUri ? (
          <Image source={{ uri: post.imageUri }} style={styles.compactImage} />
        ) : (
          <View style={[styles.compactImage, styles.placeholderImage]}>
            <Text style={styles.placeholderEmoji}>🍶</Text>
          </View>
        )}
        <Text style={styles.compactName} numberOfLines={1}>
          {post.name}
        </Text>
        <RatingStars rating={post.rating} size={12} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderEmojiLarge}>🍶</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {post.name}
        </Text>
        <Text style={styles.brewery}>
          {post.brewery} · {post.region}
        </Text>
        <View style={styles.meta}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{SAKE_TYPE_LABELS[post.type]}</Text>
          </View>
          <RatingStars rating={post.rating} size={14} />
        </View>
        {post.comment ? (
          <Text style={styles.comment} numberOfLines={2}>
            {post.comment}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  placeholderImage: {
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  placeholderEmojiLarge: {
    fontSize: 56,
  },
  info: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  brewery: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.primaryLight + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
  },
  comment: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  compactCard: {
    width: 140,
    marginRight: SPACING.sm,
  },
  compactImage: {
    width: 140,
    height: 140,
    borderRadius: BORDER_RADIUS.md,
  },
  compactName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
});
