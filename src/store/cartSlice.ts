// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types";

const clamp = (q: number, stock: number) => Math.max(1, Math.min(q, stock));

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // TODO BT7.3a: addItem
    // Đã có bookId -> tăng quantity (không vượt quá stock); chưa có -> thêm mới với quantity = 1
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const found = state.items.find((i) => i.bookId === action.payload.bookId);
      if (found) {
        found.quantity = clamp(found.quantity + 1, found.stock);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // TODO BT7.3a: removeItem - Lọc bỏ item có bookId trùng khớp
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },

    // TODO BT7.3a: setQuantity - Tìm item và cập nhật số lượng hợp lệ (từ 1 đến stock)
    setQuantity(state, action: PayloadAction<{ bookId: number; quantity: number }>) {
      const found = state.items.find((i) => i.bookId === action.payload.bookId);
      if (found) {
        found.quantity = clamp(action.payload.quantity, found.stock);
      }
    },

    // TODO BT7.3a: clearCart - Xóa toàn bộ giỏ hàng
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;