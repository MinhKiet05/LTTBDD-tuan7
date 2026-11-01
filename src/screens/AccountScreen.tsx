import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../store/hooks";
import { colors, radius } from "../theme";

export function AccountScreen() {
  const { user, isLoggedIn, signIn, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {isLoggedIn && user ? (
        // Nhánh 1: Đã đăng nhập
        <View style={styles.box}>
          <Text style={styles.avatar}>😊</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* TODO BT7.4d: Nút Đăng xuất */}
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={signOut}>
            <Text style={styles.btnOutlineText}>Đăng xuất</Text>
          </Pressable>
        </View>
      ) : (
        // Nhánh 2: Chưa đăng nhập
        <View style={styles.box}>
          <Text style={styles.avatar}>🔒</Text>
          <Text style={styles.title}>Bạn chưa đăng nhập</Text>

          {/* TODO BT7.4d: Nút Đăng nhập thử (dữ liệu giả) */}
          <Pressable
            style={styles.btn}
            onPress={() =>
              signIn(
                { id: 1, name: "Học viên Demo", email: "demo@bookstore.vn" },
                "fake-token"
              )
            }
          >
            <Text style={styles.btnText}>Đăng nhập thử (dữ liệu giả)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg, 
    justifyContent: "center" 
  },
  box: { 
    alignItems: "center", 
    padding: 24, 
    gap: 8 
  },
  avatar: { 
    fontSize: 64, 
    marginBottom: 8 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: colors.text, 
    marginBottom: 8 
  },
  name: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: colors.text 
  },
  email: { 
    color: colors.muted 
  },
  btn: { 
    backgroundColor: colors.indigo, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: radius.md, 
    marginTop: 12 
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "800" 
  },
  btnOutline: { 
    backgroundColor: "transparent", 
    borderWidth: 1.5, 
    borderColor: colors.indigo 
  },
  btnOutlineText: { 
    color: colors.indigo, 
    fontWeight: "800" 
  },
});