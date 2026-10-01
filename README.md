# Haulio Preorder

เว็บแอปรับพรีออเดอร์สินค้าเกาหลี/ญี่ปุ่น มือถือเป็นหลัก ลูกค้าเลือกสินค้า โอนเงิน แนบสลิป

Stack: Vite + React + TypeScript + Tailwind v4 + **Google Sheet** (เป็นทั้งฐานข้อมูลและหน้าแอดมิน) ผ่าน Google Apps Script

ไม่มี Firebase / ไม่มี Cloudinary / ไม่มี Vercel — ใช้ Google account ที่มีอยู่แล้วเจ้าเดียว

## 1. สร้าง Google Sheet

สร้าง Sheet ใหม่ 1 ไฟล์ ตั้งชื่อ 3 แท็บ (sheet tabs) ตามนี้เป๊ะๆ:

**แท็บ `Products`** — แถวแรกเป็นหัวตาราง พิมพ์ตามนี้:

```
id | name | category | price | imageUrl | description | deadline | variants | available
```

ตัวอย่างแถวข้อมูล:

```
kr1 | Cruntin คอร์นเฟลกโปรตีน 50g | kr | 170 | https://.../image.jpg | โปรตีนบาร์ | 17 ต.ค. 69 | Cookie Milk,Matcha Crush | TRUE
```

- `category` ใส่ `kr` หรือ `jp` เท่านั้น
- `imageUrl` ต้องเป็นลิงก์รูปที่เปิดดูตรงๆได้ (ถ้าใช้ Google Drive: อัปโหลดรูป → คลิกขวา Share → Anyone with the link → เอา FILE_ID จากลิงก์มาใส่ในรูปแบบ `https://drive.google.com/uc?id=FILE_ID`)
- `variants` ใส่ชื่อรสคั่นด้วย comma หรือเว้นว่างถ้าไม่มีตัวเลือกรส
- `available` ใส่ `TRUE` หรือ `FALSE`

**แท็บ `Orders`** — แถวแรกเป็นหัวตาราง (ระบบจะเติมแถวให้อัตโนมัติเวลามีคนสั่งซื้อ ไม่ต้องพิมพ์เอง):

```
orderId | createdAt | customerName | customerPhone | address | note | itemsJson | total | slipUrl | status
```

แอดมินตรวจออเดอร์ที่นี่: เปิดลิงก์ `slipUrl` ดูรูปสลิป แล้วพิมพ์ในช่อง `status` เป็น `paid` (ยืนยันแล้ว) / `rejected` (สลิปไม่ถูกต้อง) / `shipped` (จัดส่งแล้ว) / `done` (สำเร็จ) — ค่าเริ่มต้นตอนสั่งซื้อคือ `pending`

**แท็บ `Settings`** — คอลัมน์ `key` กับ `value` ใส่แถวตามนี้:

```
bankName    | กสิกรไทย
accountName | ชื่อบัญชี
accountNumber | 123-4-56789-0
promptpay   | 0812345678
kr_openRange | 13-17 ต.ค. 69
kr_shipDate  | 19 ต.ค. 69
jp_openRange | 25 ธ.ค. 69 - 3 ม.ค. 70
jp_shipDate  | 5 ม.ค. 70
```

## 2. ติดตั้ง Apps Script (backend)

1. ในไฟล์ Sheet เดิม: เมนู **Extensions → Apps Script**
2. ลบโค้ดเดิมในไฟล์ `Code.gs` ออกให้หมด แล้ว copy เนื้อหาทั้งหมดจากไฟล์ [`apps-script/Code.gs`](apps-script/Code.gs) ในโปรเจกต์นี้มาวาง
3. กด **Deploy → New deployment**
4. เลือกประเภท (ไอคอนเฟือง) → **Web app**
5. Execute as: **Me** / Who has access: **Anyone**
6. กด **Deploy** → อาจมีหน้า "Authorize access" ให้กดอนุญาต (เป็นสคริปต์ของคุณเอง ปลอดภัย)
7. จะได้ **Web app URL** หน้าตาประมาณ `https://script.google.com/macros/s/xxxxx/exec` → copy เก็บไว้

ทุกครั้งที่แก้โค้ดใน Apps Script ต้องกด **Deploy → Manage deployments → แก้ไข (ดินสอ) → Version: New version → Deploy** ใหม่ ไม่งั้นโค้ดเก่าจะยังทำงานอยู่

## 3. ตั้งค่า environment

คัดลอก `.env.example` เป็น `.env`:

```
VITE_SHEET_API_URL=https://script.google.com/macros/s/xxxxx/exec
```

## 4. รันโปรเจกต์

```
npm install
npm run dev
```

## 5. Deploy ขึ้น GitHub Pages

1. ใน GitHub repo → **Settings → Pages → Build and deployment → Source** เลือก **GitHub Actions**
2. **Settings → Secrets and variables → Actions → แท็บ Variables** → New repository variable → ชื่อ `VITE_SHEET_API_URL` ค่าเป็น Web app URL จากขั้นตอนที่ 2
3. push ขึ้น branch `main` → GitHub Actions จะ build+deploy อัตโนมัติ (ดูสถานะที่แท็บ Actions)
4. เว็บจะขึ้นที่ `https://<username>.github.io/Haulio-Preorder/`

## หน้าหลัก (ฝั่งลูกค้าเท่านั้น — ไม่มีหน้าแอดมินในแอปแล้ว)

- `/` แคตตาล็อกสินค้า แยกแท็บเกาหลี/ญี่ปุ่น กดเพิ่มลงตะกร้า
- `/cart` ตะกร้าสินค้า
- `/checkout` กรอกข้อมูลจัดส่ง + ดูบัญชีโอนเงิน + แนบรูปสลิป
- `/track` ลูกค้าเช็คสถานะออเดอร์ด้วยรหัสออเดอร์

การจัดการสินค้า/ตรวจสลิป/ตั้งค่า ทำโดยแก้ Google Sheet โดยตรงทั้งหมด

## Build

```
npm run build
```
