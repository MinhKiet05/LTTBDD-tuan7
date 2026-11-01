import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabBar, TabItem } from "../components/TabBar";
import { useCart } from "../store/hooks"; // Sử dụng hook useCart để lấy tổng số lượng giỏ hàng cho badge

const EMOJI: Record<string, string> = {
  Home: "🏠",
  Categories: "🗂️",
  Cart: "🛒",
  Account: "👤"
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Lấy tổng số lượng sản phẩm trong giỏ hàng để hiển thị badge ở tab 'Cart' (dùng cho Bài 7.3/7.1e)
  const { totalQuantity } = useCart();

  // 1. Ánh xạ các routes của bottom tab thành các TabItem
  const items: TabItem[] = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key].options.title ?? route.name,
    emoji: EMOJI[route.name] ?? "•",
    // TODO BT7.3e: Hiện badge nếu là tab Cart và giỏ hàng có đồ
    badge: route.name === "Cart" && totalQuantity > 0 ? totalQuantity : undefined,
  }));

  // 2. Xử lý sự kiện khi bấm vào một tab
  const onPress = (key: string) => {
    const route = state.routes.find((r) => r.key === key);
    if (!route) return;

    const isFocused = state.routes[state.index].key === key;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // 3. Render giao diện TabBar tự dựng
  return <TabBar items={items} activeKey={state.routes[state.index].key} onPress={onPress} />;
} 