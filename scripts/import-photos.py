#!/usr/bin/env python3
"""นำรูปสินค้าเข้าร้าน: ตั้งชื่อไฟล์ตามรหัสสินค้า (เช่น C02.jpg, K08.png, M13.heic) ใส่โฟลเดอร์เดียว แล้วรัน

usage: python3 scripts/import-photos.py [โฟลเดอร์]   (ค่าเริ่มต้น ~/Downloads/haulio-photos)
ย่อเหลือด้านยาวไม่เกิน 900px, แปลงเป็น .jpg, วางที่ public/products/<รหัส>.jpg (ทับของเดิม)
"""
import os
import re
import subprocess
import sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else "~/Downloads/haulio-photos").expanduser()
dst = Path(__file__).resolve().parent.parent / "public" / "products"
dst.mkdir(parents=True, exist_ok=True)
if not src.is_dir():
    sys.exit(f"ไม่พบโฟลเดอร์ {src} (สร้างโฟลเดอร์แล้ววางรูปที่ตั้งชื่อตามรหัสสินค้า)")

ok, skipped = [], []
for f in sorted(src.iterdir()):
    if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".heic", ".tiff", ".bmp"}:
        continue
    m = re.match(r"^([A-Za-z]\d{2})", f.stem)
    if not m:
        skipped.append(f.name)
        continue
    code = m.group(1).upper()
    out = dst / f"{code}.jpg"
    r = subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "80", "-Z", "900", str(f), "--out", str(out)], capture_output=True)
    if r.returncode == 0:
        ok.append((code, os.path.getsize(out) // 1024))
    else:
        skipped.append(f.name)

for code, kb in ok:
    print(f"OK    {code}.jpg  {kb} KB")
for name in skipped:
    print(f"ข้าม  {name} (ชื่อไฟล์ต้องขึ้นต้นด้วยรหัส เช่น C02)")
print(f"\nนำเข้า {len(ok)} รูป -> {dst}")
