// src/screens/CategoriesScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { Category } from "../types";
import { TabScreenProps } from "../navigation/types";
import { colors, radius } from "../theme";

export function CategoriesScreen({ navigation }: TabScreenProps<"Categories">) {
  // TODO BT7.6b: State quản lý danh mục và trạng thái tải
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO BT7.6b: Hàm load gọi API getCategories
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await getCategories();
      setData(categories);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // TODO BT7.6c: Xử lý 3 trạng thái: loading, error (kèm onRetry)
  if (loading) {
    return <LoadingView label="Đang tải danh mục..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={load} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          // src/screens/CategoriesScreen.tsx
          // TODO BT7.8c: Bấm danh mục chuyển về tab Home kèm tham số categoryId
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate("Home", { categoryId: item.id })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    gap: 12,
  },
  emoji: { fontSize: 24 },
  name: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.text },
  arrow: { fontSize: 20, color: colors.muted },
});