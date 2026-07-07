# 🎨 ArtGallery — Hệ Thống Triển Lãm & Quản Lý Nghệ Thuật Trực Tuyến

Nền tảng số hóa không gian triển lãm tranh, kết nối họa sĩ và cộng đồng yêu nghệ thuật.

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu
- Trình duyệt hiện đại (Chrome, Firefox, Edge, Safari)
- Kết nối Internet (để tải Bootstrap, jQuery, Google Fonts qua CDN)
- Tài khoản [MockAPI.io](https://mockapi.io) (để có Backend)

### Cấu hình MockAPI

1. Truy cập [mockapi.io](https://mockapi.io) và tạo project mới
2. Tạo resource tên **`artworks`** với các trường:

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | String | Tự động (MockAPI tạo) |
| `title` | String | Tên tác phẩm |
| `artist` | String | Tên họa sĩ |
| `style` | String | Phong cách nghệ thuật |
| `year` | Number | Năm sáng tác |
| `imageUrl` | String | URL hình ảnh |
| `description` | String | Mô tả |
| `likes` | Number | Lượt thích |

3. Mở file `js/api.js` và thay dòng:
```js
const BASE_URL = 'https://YOUR_ID.mockapi.io/api/v1';
```
bằng URL MockAPI của bạn.

### Chạy local
Dùng Live Server (VSCode extension) hoặc bất kỳ HTTP server nào:
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

---

## 📂 Cấu trúc thư mục

```
ArtGallery/
├── index.html          # Giao diện xem tranh (Public)
├── admin.html          # Giao diện quản trị (Admin)
├── css/
│   └── style.css       # Custom styles & Dark Gallery UI
├── js/
│   ├── api.js          # Trung tâm kết nối MockAPI (Data Layer)
│   ├── main.js         # Logic trang chủ & Filter (Controller)
│   ├── admin.js        # Logic CRUD tác phẩm (Controller)
│   └── utils.js        # Hàm tiện ích - Render, Loading, Toast (View)
├── img/
│   └── placeholder.svg # Ảnh dự phòng khi URL lỗi
└── README.md
```

---

## 🔑 Thông tin Admin

- **URL trang Admin:** `admin.html`
- **Mật khẩu mặc định:** `admin123`
- ⚠️ Đổi mật khẩu trong file `js/admin.js` trước khi deploy thực tế.

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| HTML5 | — | Cấu trúc trang |
| CSS3 + CSS Custom Properties | — | Giao diện & Dark theme |
| Vanilla JavaScript (ES6+) | — | Logic ứng dụng |
| Bootstrap | 5.3.3 | Grid, Responsive, Modal, Toast |
| jQuery | 3.7.1 | AJAX (PUT likes) & Hiệu ứng |
| Bootstrap Icons | 1.11.3 | Icon set |
| MockAPI.io | — | Giả lập REST API / Database |
| Google Fonts | — | Playfair Display + Lato |

---

## ✨ Tính năng

- **Masonry-style Grid** — Hiển thị tác phẩm thích ứng theo màn hình
- **Smart Filter** — Lọc theo phong cách nghệ thuật (client-side)
- **Interactive Like** — jQuery AJAX PUT, lưu trạng thái qua localStorage
- **CRUD Admin** — Thêm / Sửa / Xóa tác phẩm với Form Validation đầy đủ
- **Image Preview** — Xem trước ảnh realtime khi nhập URL
- **Loading Spinner** — Overlay loading khi gọi API
- **Toast Notification** — Thông báo trạng thái mọi thao tác
- **Responsive** — Tương thích mọi thiết bị (mobile-first)
- **Fade-in Animation** — Hiệu ứng stagger khi load gallery

---

## 🌐 Deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages
Push code lên GitHub → Settings → Pages → Deploy from branch `main`

---

*Được xây dựng với ❤️ bằng Vanilla JS & Bootstrap 5*
