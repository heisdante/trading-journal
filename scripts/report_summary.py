"""Summarize a Trading Journal CSV export without external dependencies."""

import csv
import sys
from collections import defaultdict


def main(path: str) -> None:
    with open(path, newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    by_setup: dict[str, list[float]] = defaultdict(list)
    for row in rows:
        try:
            by_setup[row.get("setup_name", "Unspecified")].append(float(row.get("r_value", 0)))
        except ValueError:
            continue
    print(f"Trades: {sum(map(len, by_setup.values()))}")
    for setup, values in sorted(by_setup.items()):
        wins = sum(value > 0 for value in values)
        print(f"{setup}: {len(values)} trades | {wins / len(values) * 100:.1f}% win rate | {sum(values):+.2f}R")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: powershell -File scripts/python.ps1 scripts/report_summary.py <export.csv>")
    main(sys.argv[1])
