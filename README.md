# Haulio Preorder

เว็บแอปรับพรีออเดอร์สินค้าเกาหลี/ญี่ปุ่น มือถือเป็นหลัก ลูกค้าเลือกสินค้า โอนเงิน แนบสลิป แอดมินตรวจสลิปและจัดการสินค้า

Stack: Vite + React + TypeScript + Tailwind v4 + Firebase (Firestore, Storage, Auth)

## 1. สร้าง Firebase project

1. ไปที่ [Firebase Console](https://console.firebase.google.com/) → สร้างโปรเจกต์ใหม่
2. เปิดใช้งาน **Firestore Database** (production mode)
3. เปิดใช้งาน **Storage**
4. เปิดใช้งาน **Authentication** → Sign-in method → Email/Password
5. ไปที่ Authentication → Users → Add user สร้างบัญชีแอดมิน (อีเมล+รหัสผ่านสำหรับเข้า `/admin`)
6. Project settings → General → Your apps → เพิ่ม Web app แล้วคัดลอกค่า config

## 2. ตั้งค่า environment

คัดลอก `.env.example` เป็น `.env` แล้วกรอกค่าจาก Firebase config:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 3. Deploy security rules

ใช้ Firebase CLI (`npm install -g firebase-tools` → `firebase login` → `firebase init` เลือก Firestore+Storage ใช้ project ที่สร้างไว้) แล้ว deploy:

```
firebase deploy --only firestore:rules,storage
```

หรือก็อปเนื้อหาใน `firestore.rules` และ `storage.rules` ไปวางใน Firebase Console → Firestore/Storage → Rules เอง

## 4. รันโปรเจกต์

```
npm install
npm run dev
```

เปิด `/` สำหรับหน้าลูกค้า, `/admin/login` สำหรับหน้าแอดมิน

## หน้าหลัก

- `/` แคตตาล็อกสินค้า แยกแท็บเกาหลี/ญี่ปุ่น กดเพิ่มลงตะกร้า
- `/cart` ตะกร้าสินค้า
- `/checkout` กรอกข้อมูลจัดส่ง + ดูบัญชีโอนเงิน + แนบรูปสลิป
- `/track` ลูกค้าเช็คสถานะออเดอร์ด้วยรหัสออเดอร์
- `/admin/orders` แอดมินดูออเดอร์ ตรวจสลิป กดยืนยัน/ปฏิเสธ/จัดส่งแล้ว
- `/admin/products` แอดมินเพิ่ม/ลบ/เปิดปิดการขายสินค้า
- `/admin/settings` แอดมินตั้งค่าบัญชีธนาคารที่แสดงให้ลูกค้า

## Build

```
npm run build
```

Deploy ได้ทั้ง Firebase Hosting, Vercel, Netlify (static site จาก `dist/`)
