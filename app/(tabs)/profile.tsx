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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SAKE_TYPE_LABELS } from "../../src/types";

export default function ProfileScreen() {
  const { profile, posts, shelves, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteBrewing, setFavoriteBrewing] = useState(profile.favoriteBrewing);

  const totalPosts = posts.length;
  const totalShelves = shelves.length;
  const avgRating =
    posts.length > 0
      ? (posts.reduce((sum, p) => sum + p.rating, 0) / posts.length).toFixed(1)
      : "–";

  // Most used sake type
  const typeCount: Record<string, number> = {};
  posts.forEach((p) => {
    typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  });
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

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
          {profile.avatarUri ? (
            <View style={styles.avatarImage}>
              <Text style={styles.avatarFallback}>
                {profile.displayName.charAt(0)}
              </Text>
            </View>
          ) : (
            <View style={styles.avatarImage}>
              <Text style={styles.avatarFallback}>
                {profile.displayName.charAt(0)}
              </Text>
            </View>
          )}
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
          <Text style={styles.statNumber}>{totalPosts}</Text>
          <Text style={styles.statLabel}>記録</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalShelves}</Text>
          <Text style={styles.statLabel}>棚</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{avgRating}</Text>
          <Text style={styles.statLabel}>平均評価</Text>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>あなたの日本酒レポート</Text>
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
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>記録本数</Text>
              <Text style={styles.insightValue}>{totalPosts}本</Text>
            </View>
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>使用中の棚</Text>
              <Text style={styles.insightValue}>{totalShelves}棚</Text>
            </View>
          </>
        )}
      </View>

      {/* Recent shelves */}
      <Text style={styles.sectionTitle}>マイ棚</Text>
      {shelves.map((shelf) => {
        const count = posts.filter((p) => p.shelfId === shelf.id).length;
        return (
          <View key={shelf.id} style={styles.shelfRow}>
            <Text style={styles.shelfEmoji}>{shelf.emoji}</Text>
            <View style={styles.shelfInfo}>
              <Text style={styles.shelfName}>{shelf.name}</Text>
              <Text style={styles.shelfPostCount}>{count}本のお酒</Text>
            </View>
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
  insightsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  insightsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
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
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  shelfRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
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
  shelfPostCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
