// src/components/PriceFilter.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { PriceRange } from "../utils/filters";
import { colors, radius } from "../theme";

interface Props {
  value: PriceRange;
  onChange: (val: PriceRange) => void;
}

const PRICE_RANGES: { key: PriceRange; label: string }[] = [
  { key: "lt100", label: "Dưới 100k" },
  { key: "100to300", label: "100k–300k" },
  { key: "gt300", label: "Trên 300k" },
];

export function PriceFilter({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {PRICE_RANGES.map((r) => {
        const active = value === r.key;
        return (
          <Pressable
            key={r.key}
            // Bấm lại nút đang active thì hủy chọn (về null)
            onPress={() => onChange(active ? null : r.key)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{r.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 6 },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  btnActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  text: { fontSize: 13, color: colors.muted, fontWeight: "600" },
  textActive: { color: "#fff" },
});