#!/usr/bin/env python3
"""แปลง Catelog.csv (export จากแท็บ Catelog) -> Products.new.csv + price-report.csv

ราคาขาย = x90 ที่ต่ำสุดซึ่งให้กำไร >= 35% ของต้นทุน (markup on cost)
แถวที่กำไรเกิน 40% (เพราะต้องลงท้าย 90) จะถูกติดธง OVER ใน price-report.csv

ต้นทุนบาท = Cost - Yen x เรท (ไม่ใช้ Cost - Baht ในชีต)

usage: python3 catalog_to_products.py Catelog.csv 0.2137
"""
import csv
import math
import re
import sys

MIN_MARKUP = 0.35
MAX_MARKUP = 0.40
# สินค้าเดียวกันที่ใน Catelog แยกแถวตามรส -> รวมเป็นสินค้าเดียวที่เลือกรสได้ (รหัสแรกเป็นรหัสหลัก)
MERGES = [
    ("Royce Nama Chocolate", ["S01", "S02", "S03"], ["Matcha", "Au Lait", "Bitter"]),
    ("Royce Potato Chip Chocolate", ["S04", "S05"], ["Original", "Mild Bitter"]),
]
CATEGORY = "jp"  # แอปกรองด้วย kr / jp เท่านั้น แบรนด์เก็บในคอลัมน์ brand


def num(s):
    s = re.sub(r"[^\d.\-]", "", s or "")
    return float(s) if s not in ("", "-", ".") else None


def price_ending_90(cost):
    """x90 ที่ต่ำสุด และ >= cost * (1 + MIN_MARKUP)"""
    floor = cost * (1 + MIN_MARKUP)
    return max(90, math.ceil((floor - 90) / 100) * 100 + 90)


def main(path, rate):
    with open(path, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    products, report = [], []
    brand = ""
    for r in rows:
        code = (r.get("Code") or "").strip()
        b = (r.get("Brand") or "").strip()
        if b and not re.search(r"[\u0e00-\u0e7f]", b):  # ข้อความไทยในช่อง Brand = โน้ต ไม่ใช่แบรนด์
            brand = b
        name = (r.get("Product") or "").strip()
        if not name:
            continue
        if not code:
            report.append(["", name, "", num(r.get("Price")) or "", "", "", "NO_CODE"])
            continue

        yen = num(r.get("Cost - Yen"))
        cost = round(yen * rate, 2) if yen else None
        if cost is None:
            report.append([code, name, "", num(r.get("Price")) or "", "", "", "NO_COST"])
            continue

        price = price_ending_90(cost)
        markup = price / cost - 1
        flag = "OK" if markup <= MAX_MARKUP + 1e-9 else "OVER"
        report.append([code, name, cost, num(r.get("Price")) or "", price, f"{markup:.1%}", flag])
        img = (r.get("Column 1") or "").strip()
        if not re.match(r"https?://\S+\.(jpg|jpeg|png|webp)$", img, re.I):
            img = ""
        products.append([code, name, CATEGORY, price, img, "", "", "", "TRUE", brand])

    for name, codes, flavors in MERGES:
        rows_ = [x for x in products if x[0] in codes]
        if len(rows_) == len(codes):
            head = rows_[0]
            head[1] = name
            head[7] = ", ".join(flavors)
            products = [x for x in products if x not in rows_[1:]]

    with open("Products.new.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "name", "category", "price", "imageUrl", "description", "deadline", "variants", "available", "brand"])
        w.writerows(products)

    with open("price-report.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "name", "cost_baht", "old_price", "new_price", "markup", "flag"])
        w.writerows(report)

    over = sum(1 for x in report if x[-1] == "OVER")
    nocost = sum(1 for x in report if x[-1] == "NO_COST")
    print(f"products: {len(products)}  over {MAX_MARKUP:.0%}: {over}  no cost (skipped): {nocost}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], float(sys.argv[2]))
