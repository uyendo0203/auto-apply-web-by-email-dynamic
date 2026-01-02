# Auto Apply Tool - Setup Guide

## 🎯 Tính năng chính

✅ **Google OAuth Login** - Đăng nhập bằng tài khoản Google
✅ **Google Drive CV** - Tự động lấy danh sách CV từ Google Drive
✅ **Send Email** - Gửi email ứng tuyển từ gmail của người dùng
✅ **Database** - Lưu lịch sử gửi email vào Postgres

---

## 📋 Hướng dẫn setup

### 1. **Tạo Google OAuth Credentials**

1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới
3. Vào **APIs & Services** → **Credentials**
4. Tạo **OAuth 2.0 Client ID** (Web application)
5. Thêm URLs:
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy `Client ID` và `Client Secret`

### 2. **Cấp quyền Google Drive API**

1. Vào **APIs & Services** → **Library**
2. Tìm **Google Drive API** → Enable
3. Tìm **Gmail API** → Enable

### 3. **Tạo Gmail App Password**

1. Vào [Google Account Settings](https://myaccount.google.com)
2. **Security** → **App passwords**
3. Chọn **Mail** và **Windows Computer**
4. Copy app password

### 4. **Update `.env.local`**

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud

# NextAuth
NEXTAUTH_SECRET=your_random_secret_here
# Tạo: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Gmail
GMAIL_APP_PASSWORD=your_app_password_from_google_account

# Database (Postgres)
POSTGRES_URL=your_postgres_connection_string
```

### 5. **Cài đặt Dependencies**

```bash
npm install --legacy-peer-deps
```

### 6. **Chạy Development Server**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

---

## 🔄 Quy trình sử dụng

1. **Login with Google** → Trang `/auth/signin`
2. **Chọn CV** → Danh sách CV từ Google Drive
3. **Điền thông tin** → Công ty, vị trí, email HR
4. **Viết email** → Soạn nội dung hoặc để trống (template mặc định)
5. **Gửi** → Email được gửi từ gmail của bạn, CV đi kèm

---

## 📁 Cấu trúc File

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts     # NextAuth handler
│   │   ├── google-drive-cvs/route.ts       # Lấy CV từ Drive
│   │   ├── send/route.ts                    # Gửi email
│   │   └── ...
│   ├── auth/signin/page.tsx                # Google login page
│   ├── layout.tsx                          # SessionProvider
│   └── page.tsx                            # Main form
├── lib/
│   ├── auth.ts                             # NextAuth config
│   ├── google-drive.ts                     # Google Drive API
│   └── db.ts                               # Postgres queries
```

---

## ⚙️ Cách hoạt động

### Authentication Flow
```
User → Login with Google → Google OAuth → Session Token → Saved in Cookie
```

### Send Email Flow
```
Form Submit → Auth Check → Download CV from Drive → Send via Gmail SMTP → Save to DB
```

---

## 🐛 Troubleshooting

**Lỗi: "Google API not found"**
- Check đã enable Google Drive API & Gmail API chưa

**Lỗi: "Cannot download CV"**
- Check file ID đúng không
- Check Google OAuth token còn hạn không

**Lỗi: "Email not sent"**
- Kiểm tra GMAIL_APP_PASSWORD đúng không
- Kiểm tra email address có bật 2FA không

---

## 🚀 Deploy

### Vercel
```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL https://your-domain.com
vercel env add GMAIL_APP_PASSWORD
vercel env add POSTGRES_URL
```

Update `NEXTAUTH_URL` trong production sau deploy

---

## 📝 TODO

- [ ] Add email templates
- [ ] Schedule emails
- [ ] Email tracking
- [ ] Multi-user support per email domain

---

**Happy applying! 🎉**
