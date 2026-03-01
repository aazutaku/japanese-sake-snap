import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../src/constants/theme";
import { useApp } from "../../src/store/AppContext";
import { SakeType, SAKE_TYPE_LABELS } from "../../src/types";
import { RatingStars } from "../../src/components/RatingStars";

const SAKE_TYPES = Object.entries(SAKE_TYPE_LABELS) as [SakeType, string][];

export default function AddScreen() {
  const { shelves, addPost } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [brewery, setBrewery] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState<SakeType>("junmai-daiginjo");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [shelfId, setShelfId] = useState(shelves[0]?.id ?? "");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("カメラへのアクセス許可が必要です");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("お酒の名前を入力してください");
      return;
    }
    if (!shelfId) {
      Alert.alert("棚を選択してください");
      return;
    }
    if (rating === 0) {
      Alert.alert("評価を選択してください");
      return;
    }

    await addPost({
      name: name.trim(),
      brewery: brewery.trim(),
      region: region.trim(),
      type,
      rating,
      comment: comment.trim(),
      imageUri,
      shelfId,
    });

    Alert.alert("追加しました！", `「${name}」を棚に追加しました`, [
      {
        text: "OK",
        onPress: () => {
          setName("");
          setBrewery("");
          setRegion("");
          setType("junmai-daiginjo");
          setRating(0);
          setComment("");
          setImageUri("");
          router.push("/(tabs)/shelves");
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
      <Text style={styles.title}>お酒を追加</Text>
      <Text style={styles.subtitle}>飲んだお酒の記録を残そう</Text>

      {/* Photo */}
      <View style={styles.photoSection}>
        {imageUri ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <Text style={styles.changePhotoText}>タップして変更</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Text style={styles.photoBtnEmoji}>📷</Text>
              <Text style={styles.photoBtnText}>撮影する</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
              <Text style={styles.photoBtnEmoji}>🖼️</Text>
              <Text style={styles.photoBtnText}>写真を選ぶ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={styles.label}>お酒の名前 *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="例: 獺祭 純米大吟醸 磨き二割三分"
        placeholderTextColor={COLORS.textLight}
      />

      {/* Brewery */}
      <Text style={styles.label}>酒蔵</Text>
      <TextInput
        style={styles.input}
        value={brewery}
        onChangeText={setBrewery}
        placeholder="例: 旭酒造"
        placeholderTextColor={COLORS.textLight}
      />

      {/* Region */}
      <Text style={styles.label}>産地</Text>
      <TextInput
        style={styles.input}
        value={region}
        onChangeText={setRegion}
        placeholder="例: 山口県"
        placeholderTextColor={COLORS.textLight}
      />

      {/* Type */}
      <Text style={styles.label}>種類</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeScroll}
      >
        {SAKE_TYPES.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.typeChip, type === key && styles.typeChipSelected]}
            onPress={() => setType(key)}
          >
            <Text
              style={[
                styles.typeChipText,
                type === key && styles.typeChipTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rating */}
      <Text style={styles.label}>評価 *</Text>
      <RatingStars rating={rating} size={32} editable onChange={setRating} />

      {/* Shelf */}
      <Text style={styles.label}>棚を選択 *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.shelfScroll}
      >
        {shelves.map((shelf) => (
          <TouchableOpacity
            key={shelf.id}
            style={[
              styles.shelfChip,
              shelfId === shelf.id && styles.shelfChipSelected,
            ]}
            onPress={() => setShelfId(shelf.id)}
          >
            <Text style={styles.shelfChipEmoji}>{shelf.emoji}</Text>
            <Text
              style={[
                styles.shelfChipText,
                shelfId === shelf.id && styles.shelfChipTextSelected,
              ]}
            >
              {shelf.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Comment */}
      <Text style={styles.label}>感想・コメント</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={comment}
        onChangeText={setComment}
        placeholder="飲んだ感想を残しましょう..."
        placeholderTextColor={COLORS.textLight}
        multiline
        numberOfLines={4}
      />

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>🍶 棚に追加する</Text>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
    color: COLORS.text,
    paddingTop: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  photoSection: {
    marginBottom: SPACING.lg,
  },
  photoButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
  },
  photoBtnEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  photoBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: BORDER_RADIUS.lg,
  },
  changePhotoText: {
    textAlign: "center",
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  typeScroll: {
    marginBottom: SPACING.sm,
  },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  typeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  typeChipTextSelected: {
    color: COLORS.white,
  },
  shelfScroll: {
    marginBottom: SPACING.sm,
  },
  shelfChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  shelfChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  shelfChipEmoji: {
    fontSize: 16,
  },
  shelfChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  shelfChipTextSelected: {
    color: COLORS.white,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  submitBtnText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.white,
    fontWeight: "800",
  },
});
