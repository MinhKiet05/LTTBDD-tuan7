// ADAPTER: component chỉ gọi useCart() / useAuth() / useWishlist().
// Nếu sau này đổi sang Recoil/Zustand, chỉ sửa file này — UI không phải sửa.
import { useCallback, useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";
import { addItem, clearCart, removeItem, setQuantity } from "./cartSlice";
import { logout, setCredentials, updateUser } from "./authSlice";
import { toggleWishlist } from "./wishlistSlice";
import { CartItem, User } from "../types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// src/store/hooks.ts (tìm đến hàm useCart)
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  // TODO BT7.3b: Tính tổng số lượng và tổng thành tiền
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    totalQuantity,
    totalPrice,
    add: (item: Omit<CartItem, "quantity">) => dispatch(addItem(item)),
    remove: (bookId: number) => dispatch(removeItem(bookId)),
    setQty: (bookId: number, quantity: number) =>
      dispatch(setQuantity({ bookId, quantity })),
    clear: () => dispatch(clearCart()),
  };
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  return {
    user,
    token,
    isLoggedIn: false, // TODO BT7.4b: true khi có cả token lẫn user  →  !!token && !!user
    signIn: useCallback((u: User, t: string) => dispatch(setCredentials({ user: u, token: t })), [dispatch]),
    signOut: useCallback(() => dispatch(logout()), [dispatch]),
    patchUser: useCallback((p: Partial<User>) => dispatch(updateUser(p)), [dispatch]),
  };
}

export function useWishlist() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.wishlist.ids);
  return {
    ids,
    isFavorite: useCallback((bookId: number) => ids.includes(bookId), [ids]),
    toggle: useCallback((bookId: number) => dispatch(toggleWishlist(bookId)), [dispatch]),
  };
}
