// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { EmptyState } from "../components/EmptyState";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { useCart } from "../store/hooks";
import { useDebounce } from "../hooks/useDebounce";
import { filterBooks, PriceRange } from "../utils/filters";
import { Book, Category } from "../types";
import { TabScreenProps } from "../navigation/types";
import { colors, radius } from "../theme";

export function HomeScreen({ navigation, route }: TabScreenProps<"Home">) {
  // 1. Quản lý dữ liệu từ API và các trạng thái tải
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Quản lý trạng thái tìm kiếm, lọc và sắp xếp
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null); // Câu hỏi bổ sung số 5

  // 3. Lấy số lượng giỏ hàng để hiển thị trên nút giỏ nổi
  const { totalQuantity } = useCart();

  // 4. Debounce từ khóa tìm kiếm (trễ 400ms)
  const debouncedKeyword = useDebounce(keyword, 400);

  // 5. Hàm tải dữ liệu song song qua Promise.all
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookList, categoryList] = await Promise.all([
        getBooks(),
        getCategories(),
      ]);
      setBooks(bookList);
      setCategories(categoryList);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 6. Nhận categoryId truyền từ tab Categories sang và xoá params sau khi nhận
  useEffect(() => {
    const id = route.params?.categoryId;
    if (id !== undefined) {
      setSelectedCategory(id);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId, navigation]);

  // 7. Lọc sách kết hợp đa điều kiện và sắp xếp theo giá
  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, {
      keyword: debouncedKeyword,
      categoryId: selectedCategory,
      priceRange,
    });

    if (sortOrder === "asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === "desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [books, debouncedKeyword, selectedCategory, priceRange, sortOrder]);

  // 8. Kiểm tra xem đang có bộ lọc nào được áp dụng không
  const hasFilter =
    keyword !== "" ||
    selectedCategory !== null ||
    priceRange !== null ||
    sortOrder !== null;

  // 9. Đặt lại toàn bộ bộ lọc về mặc định
  const clearFilters = () => {
    setKeyword("");
    setSelectedCategory(null);
    setPriceRange(null);
    setSortOrder(null);
  };

  return (
    <View style={styles.container}>
      {/* Thanh Header hoặc ô SearchBar */}
      {isSearching ? (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setIsSearching(false);
            setKeyword("");
          }}
        />
      ) : (
        <Header title="BookStore" onSearchPress={() => setIsSearching(true)} />
      )}

      {/* Hiển thị 3 trạng thái: Đang tải, Lỗi, và Có dữ liệu */}
      {loading ? (
        <LoadingView label="Đang tải sách..." />
      ) : error ? (
        <ErrorView message={error} onRetry={load} />
      ) : (
        <View style={styles.content}>
          {/* Chip lọc theo danh mục */}
          <CategoryChips
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Lọc theo 3 khoảng giá (BT7.C2) */}
          <PriceFilter value={priceRange} onChange={setPriceRange} />

          {/* Thanh tiện ích: Sắp xếp giá và Nút Xóa bộ lọc */}
          <View style={styles.filterBar}>
            <View style={styles.sortButtons}>
              <Pressable
                onPress={() =>
                  setSortOrder(sortOrder === "asc" ? null : "asc")
                }
                style={[
                  styles.sortBtn,
                  sortOrder === "asc" && styles.sortBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortText,
                    sortOrder === "asc" && styles.sortTextActive,
                  ]}
                >
                  Giá ↑
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  setSortOrder(sortOrder === "desc" ? null : "desc")
                }
                style={[
                  styles.sortBtn,
                  sortOrder === "desc" && styles.sortBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortText,
                    sortOrder === "desc" && styles.sortTextActive,
                  ]}
                >
                  Giá ↓
                </Text>
              </Pressable>
            </View>

            {hasFilter && (
              <Pressable onPress={clearFilters}>
                <Text style={styles.clearText}>✕ Xóa bộ lọc</Text>
              </Pressable>
            )}
          </View>

          {/* Lưới sách và Trạng thái khi không tìm thấy kết quả */}
          <BookGrid
            data={visibleBooks}
            onPressBook={(b) =>
              navigation.navigate("BookDetail", { bookId: b.id })
            }
            ListEmptyComponent={
              <EmptyState
                emoji="🔎"
                title="Không tìm thấy sách phù hợp"
                message="Hãy thử từ khoá khác hoặc bỏ bớt bộ lọc."
                actionLabel="Xóa bộ lọc"
                onAction={clearFilters}
              />
            }
          />
        </View>
      )}

      {/* Nút giỏ hàng nổi có đếm số lượng */}
      <FloatingCartButton
        count={totalQuantity}
        onPress={() => navigation.navigate("Cart")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortBtnActive: {
    backgroundColor: colors.indigo,
    borderColor: colors.indigo,
  },
  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  sortTextActive: {
    color: "#fff",
  },
  clearText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
});