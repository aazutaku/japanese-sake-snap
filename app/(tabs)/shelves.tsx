import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { Shelf } from "../../src/types";

const EMOJI_OPTIONS = ["🍶", "⭐", "🔥", "🍯", "🌸", "❄️", "🏔️", "🌊", "🎑", "🎋", "🍁", "🌙"];

function ShelfCard({ shelf, postCount, onPress, onLongPress }: {
  shelf: Shelf;
  postCount: number;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.shelfCard}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.shelfEmoji}>{shelf.emoji}</Text>
      <Text style={styles.shelfName}>{shelf.name}</Text>
      <Text style={styles.shelfCount}>{postCount}本</Text>
      {shelf.description ? (
        <Text style={styles.shelfDesc} numberOfLines={2}>
          {shelf.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default function ShelvesScreen() {
  const { shelves, posts, addShelf, deleteShelf } = useApp();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🍶");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await addShelf(newName.trim(), selectedEmoji, newDesc.trim());
    setNewName("");
    setNewDesc("");
    setSelectedEmoji("🍶");
    setModalVisible(false);
  };

  const handleDelete = (shelf: Shelf) => {
    Alert.alert(
      `「${shelf.name}」を削除`,
      "この棚とその中のお酒がすべて削除されます。よろしいですか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => deleteShelf(shelf.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shelves}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ShelfCard
            shelf={item}
            postCount={posts.filter((p) => p.shelfId === item.id).length}
            onPress={() => router.push(`/shelf/${item.id}`)}
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>マイ棚</Text>
            <Text style={styles.subtitle}>カテゴリごとにお酒を整理しよう</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>＋ 新しい棚を作成</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Shelf Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新しい棚を作成</Text>

            <Text style={styles.label}>アイコン</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.emojiOptionSelected,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>棚の名前</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="例: フルーティー系"
              placeholderTextColor={COLORS.textLight}
            />

            <Text style={styles.label}>説明（任意）</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="どんなお酒を入れるか"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={2}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, !newName.trim() && styles.createBtnDisabled]}
                onPress={handleCreate}
                disabled={!newName.trim()}
              >
                <Text style={styles.createBtnText}>作成</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  row: {
    gap: SPACING.sm,
  },
  shelfCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    minHeight: 140,
  },
  shelfEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  shelfName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  shelfCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  shelfDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  addButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  addButtonText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiOptionSelected: {
    backgroundColor: COLORS.primaryLight + "30",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  emojiOptionText: {
    fontSize: 22,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  createBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  createBtnDisabled: {
    opacity: 0.4,
  },
  createBtnText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
    fontWeight: "700",
  },
});
