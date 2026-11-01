# Trả Lời Câu Hỏi Bổ Sung — Buổi 7

### Câu 1: Cấu trúc điều hướng
`BookDetail` được đăng ký ở Stack ngoài cùng (`RootNavigator`) để khi mở chi tiết sách, màn hình này sẽ phủ đè lên toàn bộ thanh Tab Bar bên dưới và tự động có nút quay lại (`←`) trên thanh tiêu đề. Nếu đặt `BookDetail` trong Tab Navigator, nó sẽ trở thành một tab ngang hàng với Home, thanh Tab Bar bên dưới vẫn sẽ luôn hiển thị gây tốn diện tích và mất đi nút quay lại tự động của Native Stack. Điều này phá vỡ luồng trải nghiệm tự nhiên (master-detail flow) trên thiết bị di động.

---

### Câu 2: Redux Toolkit & useMemo
Trong reducer ta viết `state.items.push(...)` nhưng state gốc không bị sửa trực tiếp vì Redux Toolkit tích hợp sẵn thư viện **Immer**. Khi reducer chạy, `state` thực chất chỉ là một bản nháp (`draft`), Immer sẽ theo dõi mọi thay đổi trên bản nháp này rồi tự động tạo ra một state mới hoàn toàn bất biến (immutable). Nếu bỏ `useMemo` trong `useCart`, kết quả hiển thị tổng số lượng và tổng tiền hoàn toàn không đổi; tuy nhiên, các phép tính `reduce` duyệt mảng sẽ bị chạy lại ở mọi lần component re-render, gây lãng phí tài nguyên CPU khi giỏ hàng có nhiều mặt hàng.

---

### Câu 3: Promise.all & Xử lý lỗi API
Nếu `getCategories()` bị lỗi còn `getBooks()` thành công thì màn hình Home vẫn sẽ hiển thị màn hình báo lỗi `ErrorView`, bởi vì `Promise.all` có cơ chế "fail-fast" (chỉ cần một request thất bại là toàn bộ Promise bị reject). Để khắc phục và vẫn hiển thị danh sách sách, ta có thể dùng `Promise.allSettled([getBooks(), getCategories()])`, khi đó request lấy sách thành công vẫn được nạp vào state còn danh mục bị lỗi sẽ để mảng rỗng. Sự đánh đổi ở đây là độ phức tạp của code tăng lên vì phải tự bóc tách kết quả (`status === 'fulfilled'`) và xử lý thông báo lỗi cục bộ cho từng phần thay vì gom chung một chỗ.

---

### Câu 4: Cơ chế Debounce
Nếu đặt `setTimeout` trực tiếp trong `onChangeText`, hàm này sẽ không bị hủy khi người dùng tiếp tục gõ phím, khiến mỗi ký tự nhập vào đều tạo ra một bộ đếm riêng và cuối cùng vẫn gây ra bấy nhiêu lần lọc (chỉ là bị trễ đi chứ không gộp lại được). Hàm dọn dẹp (`return () => clearTimeout(...)`) giúp hủy bỏ bộ hẹn giờ của lần gõ trước đó ngay khi có giá trị mới, đảm bảo chỉ có lần gõ phím cuối cùng được kích hoạt sau 400ms. Ngoài ra, nó còn giúp ngăn chặn lỗi rò rỉ bộ nhớ (memory leak) và cảnh báo cập nhật state khi component đã bị tháo gỡ (unmount).

---

### Câu 5: Code bổ sung sắp xếp “Giá tăng dần / giảm dần” cho Home
Để bổ sung tính năng sắp xếp giá trên màn `HomeScreen.tsx`, ta chỉ cần thêm một state `sortOrder` và sắp xếp bản sao của danh sách sách đã lọc bên trong `useMemo`:

```tsx
// 1. Khai báo kiểu và state sắp xếp trong HomeScreen.tsx:
type SortOption = "asc" | "desc" | null;
const [sortOrder, setSortOrder] = useState<SortOption>(null);

// 2. Cập nhật visibleBooks trong HomeScreen.tsx:
const visibleBooks = useMemo(() => {
  // Lọc sách theo từ khóa, danh mục và khoảng giá
  const filtered = filterBooks(books, {
    keyword: debouncedKeyword,
    categoryId: selectedCategory,
    priceRange,
  });

  // Nếu không chọn sắp xếp thì trả về danh sách lọc ban đầu
  if (!sortOrder) return filtered;

  // Sao chép mảng [...filtered] để tránh mutate mảng gốc và sắp xếp theo giá
  return [...filtered].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );
}, [books, debouncedKeyword, selectedCategory, priceRange, sortOrder]);

// 3. (Gợi ý JSX thêm nút chuyển đổi sắp xếp):
// <Pressable onPress={() => setSortOrder(prev => prev === "asc" ? "desc" : prev === "desc" ? null : "asc")}>
//   <Text>Sắp xếp giá: {sortOrder === "asc" ? "Tăng dần ↑" : sortOrder === "desc" ? "Giảm dần ↓" : "Mặc định"}</Text>
// </Pressable>
```