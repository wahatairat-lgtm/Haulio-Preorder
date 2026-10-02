#!/usr/bin/env python3
"""kr-catalog.csv (ราคาวอน) -> Products.kr.csv + Products.all.csv (JP + KR) + price-report-kr.csv

ต้นทุนบาท = KRW x เรท; ราคาขายใช้กฎเดียวกับของญี่ปุ่น (>=35% ลงท้าย 90)
usage: python3 kr_to_products.py 0.0243
"""
import csv
import sys

from catalog_to_products import MAX_MARKUP, price_ending_90

HEAD = ["id", "name", "category", "price", "imageUrl", "description", "deadline", "variants", "available", "brand"]


def main(rate):
    out, report = [], []
    for r in csv.DictReader(open("kr-catalog.csv", encoding="utf-8")):
        krw = float(r["krw"])
        cost = round(krw * rate, 2)
        price = price_ending_90(cost)
        markup = price / cost - 1
        name = " ".join(x for x in (r["brand"], r["product"], r["size"]) if x)
        out.append([r["code"], name, "kr", price, "", "", "", "", "TRUE", r["brand"]])
        report.append([r["code"], name, int(krw), cost, price, f"{markup:.1%}", "OK" if markup <= MAX_MARKUP + 1e-9 else "OVER"])

    w = csv.writer(open("Products.kr.csv", "w", newline="", encoding="utf-8"))
    w.writerow(HEAD)
    w.writerows(out)

    jp = list(csv.reader(open("Products.new.csv", encoding="utf-8")))[1:]
    w = csv.writer(open("Products.all.csv", "w", newline="", encoding="utf-8"))
    w.writerow(HEAD)
    w.writerows(jp)
    w.writerows(out)

    w = csv.writer(open("price-report-kr.csv", "w", newline="", encoding="utf-8"))
    w.writerow(["id", "name", "krw", "cost_baht", "new_price", "markup", "flag"])
    w.writerows(report)
    print(f"KR {len(out)} + JP {len(jp)} = {len(out) + len(jp)} products")
    for x in report:
        print(*x, sep=" | ")


if __name__ == "__main__":
    main(float(sys.argv[1]))
