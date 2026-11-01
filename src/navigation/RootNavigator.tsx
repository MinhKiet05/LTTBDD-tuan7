import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import { BookDetailScreen } from "../screens/BookDetailScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#0B1F5C" }, headerTintColor: "#fff" }}>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      
      {/* Đăng ký màn BookDetail ở Stack ngoài cùng (Bài 7.1c) */}
      <Stack.Screen 
        name="BookDetail" 
        component={BookDetailScreen} 
        options={{ title: "Chi tiết sách" }} 
      />
      
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: "Thanh toán" }} 
      />
    </Stack.Navigator>
  ); 
}