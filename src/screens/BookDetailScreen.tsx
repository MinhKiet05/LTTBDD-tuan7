// src/screens/BookDetailScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { RootScreenProps } from "../navigation/types";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { useCart } from "../store/hooks";
import { Book } from "../types";
import { colors, radius } from "../theme";
import { useWishlist } from "../store/hooks"; // import thêm hook này
export function BookDetailScreen({ route, navigation }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();

  // TODO BT7.5d: State cho book, loading và error
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggle } = useWishlist();
  const fav = book ? isFavorite(book.id) : false;
  
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookById(bookId);
      setBook(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  // TODO BT7.5e: Xử lý loading và error
  if (loading) {
    return <LoadingView label="Đang tải chi tiết sách..." />;
  }

  if (error || !book) {
    return (
      <ErrorView
        message={error ?? "Không tìm thấy sách."}
        onRetry={load}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.cover, { backgroundColor: book.color }]}>
        <Text style={styles.emoji}>{book.emoji}</Text>
        <Pressable style={styles.favBtn} onPress={() => toggle(book.id)}>
          <Text style={styles.favIcon}>{fav ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{book.price.toLocaleString("vi-VN")} đ</Text>
      <Text style={styles.stock}>Còn {book.stock} cuốn</Text>
      <Text style={styles.desc}>{book.description}</Text>

      <Pressable
        style={styles.btn}
        onPress={() =>
          add({
            bookId: book.id,
            title: book.title,
            price: book.price,
            emoji: book.emoji,
            color: book.color,
            stock: book.stock,
          })
        }
      >
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  cover: { height: 220, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 80 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text },
  author: { fontSize: 16, color: colors.muted },
  price: { fontSize: 20, fontWeight: "800", color: colors.indigo },
  stock: { fontSize: 14, color: colors.muted },
  desc: { fontSize: 15, color: colors.text, lineHeight: 22 },
  btn: { backgroundColor: colors.indigo, padding: 16, borderRadius: radius.md, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  favBtn: {
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: "rgba(255,255,255,0.85)",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
},
favIcon: { fontSize: 20 },
});