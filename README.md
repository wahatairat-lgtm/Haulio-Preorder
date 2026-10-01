# Haulio Preorder

เว็บแอปรับพรีออเดอร์สินค้าเกาหลี/ญี่ปุ่น มือถือเป็นหลัก ลูกค้าเลือกสินค้า โอนเงิน แนบสลิป

Stack: Vite + React + TypeScript + Tailwind v4 + **Google Sheet** (เป็นทั้งฐานข้อมูลและหน้าแอดมิน) ผ่าน Google Apps Script

ไม่มี Firebase / ไม่มี Cloudinary / ไม่มี Vercel — ใช้ Google account ที่มีอยู่แล้วเจ้าเดียว

## 1. Google Sheet (สร้างให้แล้ว)

สร้าง Google Sheet ให้ครบ 3 ไฟล์ พร้อมข้อมูลตัวอย่างแล้ว:

- [Haulio Preorder - Products](https://docs.google.com/spreadsheets/d/1gNkZF3SrHnKZCp2ZG7f5y5EkUE4X-9CxSOnmC2w5KEg/edit) — สินค้า (ลบแถวตัวอย่างแล้วพิมพ์สินค้าจริงแทน)
- [Haulio Preorder - Orders](https://docs.google.com/spreadsheets/d/1OOv8fDaG914x9xqafXLP6tmS3KImJfkesWdw4zMMiFM/edit) — ระบบเติมแถวให้อัตโนมัติเวลามีคนสั่งซื้อ ไม่ต้องพิมพ์เอง
- [Haulio Preorder - Settings](https://docs.google.com/spreadsheets/d/1rGmLR210jqpXeNYNyQgykOctPxLX_G-uZRpyTYdyqcU/edit) — บัญชีธนาคาร + รอบพรีออเดอร์ (แก้ค่า `bankName`/`accountName`/`accountNumber`/`promptpay` เป็นของจริง)

**Products** คอลัมน์:

- `category` ใส่ `kr` หรือ `jp` เท่านั้น
- `imageUrl` ต้องเป็นลิงก์รูปที่เปิดดูตรงๆได้ (ถ้าใช้ Google Drive: อัปโหลดรูป → คลิกขวา Share → Anyone with the link → เอา FILE_ID จากลิงก์มาใส่ในรูปแบบ `https://drive.google.com/uc?id=FILE_ID`)
- `variants` ใส่ชื่อรสคั่นด้วย comma หรือเว้นว่างถ้าไม่มีตัวเลือกรส
- `available` ใส่ `TRUE` หรือ `FALSE`

**Orders**: แอดมินตรวจออเดอร์ที่นี่ — เปิดลิงก์ `slipUrl` ดูรูปสลิป แล้วพิมพ์ในช่อง `status` เป็น `paid` (ยืนยันแล้ว) / `rejected` (สลิปไม่ถูกต้อง) / `shipped` (จัดส่งแล้ว) / `done` (สำเร็จ) — ค่าเริ่มต้นตอนสั่งซื้อคือ `pending`

## 2. ติดตั้ง Apps Script (backend)

ผูกกับไฟล์ไหนก็ได้ใน 3 ไฟล์ข้างบน (แนะนำไฟล์ Orders เพราะเช็คง่ายสุด) เพราะโค้ดอ้างอิง 3 ไฟล์ด้วย ID ตรงๆ ไม่ได้ใช้แท็บในไฟล์เดียวกัน:

1. เปิดไฟล์ Orders → เมนู **Extensions → Apps Script**
2. ลบโค้ดเดิมในไฟล์ `Code.gs` ออกให้หมด แล้ว copy เนื้อหาทั้งหมดจากไฟล์ [`apps-script/Code.gs`](apps-script/Code.gs) ในโปรเจกต์นี้มาวาง (มี ID ทั้ง 3 ไฟล์ใส่ไว้ให้แล้ว)
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
