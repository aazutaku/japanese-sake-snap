import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  rating: number;
  size?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, size = 20, editable = false, onChange }: Props) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          disabled={!editable}
          onPress={() => onChange?.(star)}
          style={{ padding: 2 }}
        >
          <Text style={{ fontSize: size, color: star <= rating ? COLORS.star : COLORS.borderLight }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
