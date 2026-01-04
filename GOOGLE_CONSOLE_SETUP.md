# Google Console Setup - Production Configuration

## Bước 1: Đi tới Google Cloud Console

1. Truy cập https://console.cloud.google.com/
2. Chọn project của bạn (nếu chưa có, tạo project mới)

## Bước 2: Cấp phép OAuth và xóa Scopes không cần thiết

### Hiện tại đang sử dụng:
```
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/gmail.send
```

### Cấu hình OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. Chọn User Type: **External** 
3. Điền thông tin:
   - **App name**: Auto Apply Web V2
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com

4. **Scopes** → Click **Add or Remove Scopes**
   - Tìm và chọn:
     - `https://www.googleapis.com/auth/drive.readonly` (Read-only Google Drive)
     - `https://www.googleapis.com/auth/gmail.send` (Send emails via Gmail)
   - **Loại bỏ các scope sau** (nếu có):
     - ❌ `openid`
     - ❌ `email`
     - ❌ `profile`
   - Click **Update**

5. Click **Save and Continue** cho các bước khác

## Bước 3: Cập nhật OAuth 2.0 Client ID

1. **APIs & Services** → **Credentials**
2. Tìm OAuth 2.0 Client ID (kiểu: Web application)
3. Click edit:
   - **Authorized JavaScript origins**:
     - `http://localhost:3001`
     - `https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app`
     - Hoặc domain production của bạn
   
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/callback/google`
     - `https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app/api/auth/callback/google`
     - Hoặc domain production của bạn

4. **Save**

## Bước 4: Move App to Production

1. **OAuth consent screen** → **Publish to Production**
   - Thay đổi status từ "Testing" → "In Production"
   - Điền thêm Privacy Policy URL: `https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app/privacy`
   - Điền Terms of Service URL: `https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app/terms`

2. Verify app ownership (nếu cần)
   - Google có thể yêu cầu verify domain hoặc app

## Bước 5: Enable Required APIs

Đảm bảo các API sau được enable:

1. **APIs & Services** → **Enabled APIs & services**
   - ✅ Google Drive API
   - ✅ Gmail API
   - ✅ Google+ API (nếu cần)

Nếu chưa enable:
1. Click **+ Enable APIs and Services**
2. Tìm "Google Drive API" → Enable
3. Tìm "Gmail API" → Enable

## Bước 6: Generate/Refresh Credentials (Nếu cần)

Nếu bạn muốn tạo credentials mới:

1. **Credentials** → **+ Create Credentials** → **OAuth Client ID**
2. Chọn **Web application**
3. Điền:
   - Name: `Auto Apply Web V2 - Production`
   - Authorized origins và redirect URIs như Step 3
4. Copy **Client ID** và **Client Secret** 
5. Update trong `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-new-client-id
   GOOGLE_CLIENT_SECRET=your-new-client-secret
   ```

## Bước 7: Test Ứng Dụng

1. Local testing:
   ```bash
   npm run dev
   # Truy cập http://localhost:3001
   ```

2. Production testing:
   - Truy cập https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app
   - Click **Đăng Nhập với Google**
   - Nếu thấy màn hình "This app isn't verified yet" → Click **Continue** (vì app chưa được verify)

## Lưu ý quan trọng

### Security Best Practices:
- ✅ Sử dụng HTTPS cho tất cả redirect URIs
- ✅ Giữ bí mật Client Secret (không commit vào Git)
- ✅ Sử dụng environment variables cho credentials
- ✅ Enable 2FA cho Google Cloud Console account

### OAuth Scopes Explanation:
- `drive.readonly`: Chỉ đọc files từ Google Drive, không thể xóa/sửa
- `gmail.send`: Chỉ có thể gửi email, không thể đọc emails khác

### Troubleshooting:

**Lỗi: "redirect_uri_mismatch"**
- Kiểm tra redirect URI trong Google Console khớp chính xác với ứng dụng

**Lỗi: "invalid_client"**
- Kiểm tra Client ID và Secret có đúng không

**Lỗi: "access_denied"**
- User từ chối cấp quyền → Thử lại hoặc kiểm tra scopes

## Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Drive API Scopes](https://developers.google.com/drive/api/guides/auth-scopes)
- [Gmail API Scopes](https://developers.google.com/gmail/api/auth/scopes)
