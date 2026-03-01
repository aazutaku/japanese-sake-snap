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

export default function ShelfDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shelves, getShelfPosts, deletePost } = useApp();
  const router = useRouter();

  const shelf = shelves.find((s) => s.id === id);
  const posts = id ? getShelfPosts(id) : [];

  if (!shelf) {
    return (
      <View style={styles.container}>
        <EmptyState emoji="❓" title="棚が見つかりません" message="この棚は削除されたようです" />
      </View>
    );
  }

  const handleDeletePost = (postId: string, postName: string) => {
    Alert.alert(`「${postName}」を削除`, "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      { text: "削除", style: "destructive", onPress: () => deletePost(postId) },
    ]);
  };

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
          <View style={styles.header}>
            <Text style={styles.emoji}>{shelf.emoji}</Text>
            <Text style={styles.name}>{shelf.name}</Text>
            {shelf.description ? (
              <Text style={styles.description}>{shelf.description}</Text>
            ) : null}
            <Text style={styles.count}>{posts.length}本のお酒</Text>
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
  header: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  count: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: SPACING.sm,
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
