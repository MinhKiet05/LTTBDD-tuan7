// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // TODO BT7.7b: Đặt timer cập nhật giá trị sau 'delay' ms
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Dọn dẹp timer cũ nếu 'value' đổi trước khi hết hạn
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}