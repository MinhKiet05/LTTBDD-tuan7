// src/utils/filters.ts
import { Book } from "../types";

export type PriceRange = "lt100" | "100to300" | "gt300" | null;

export interface BookFilter {
  keyword: string;
  categoryId: number | null;
  priceRange: PriceRange;
}

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

// BT7.C2: Hàm kiểm tra giá theo khoảng
export const inRange = (p: number, r: PriceRange) =>
  r === null ||
  (r === "lt100" ? p < 100000 : r === "100to300" ? p >= 100000 && p <= 300000 : p > 300000);

// src/utils/filters.ts
export function filterBooks(books: Book[], f: BookFilter): Book[] {
  const k = normalize(f.keyword);

  return books.filter((b) => {
    // Điều kiện 1: Từ khoá tìm kiếm (Bài 7.7)
    const matchesKeyword =
      k === "" || normalize(b.title).includes(k) || normalize(b.author).includes(k);

    // TODO BT7.8a: Điều kiện 2: Danh mục (f.categoryId === null hoặc trùng khớp)
    const matchesCategory =
      f.categoryId === null || b.categoryId === f.categoryId;

    // Điều kiện 3: Khoảng giá (BT7.C2)
    const matchesPrice = inRange(b.price, f.priceRange);

    // Kết hợp đồng thời cả 3 điều kiện (AND)
    return matchesKeyword && matchesCategory && matchesPrice;
  });
}