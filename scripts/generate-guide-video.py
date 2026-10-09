"""Render the short, silent product walkthrough used in the welcome tour.

Run with the workspace Python runtime and imageio-ffmpeg available on PYTHONPATH.
"""

from pathlib import Path
import math
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

try:
    import imageio_ffmpeg
except ImportError:
    sys.exit("Install imageio-ffmpeg before generating the walkthrough.")


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "videos"
OUT.mkdir(parents=True, exist_ok=True)
WIDTH, HEIGHT, FPS = 960, 540, 20
SECONDS_PER_SCENE = 3.4
SCENES = 7
TOTAL = int(SECONDS_PER_SCENE * SCENES * FPS)
GREEN = (140, 224, 173)
TEXT = (237, 245, 237)
MUTED = (151, 173, 156)
PANEL = (17, 31, 21)
FIELD = (9, 18, 12)


def font(size, bold=False, mono=False):
    name = "consolab.ttf" if mono else ("seguisb.ttf" if bold else "segoeui.ttf")
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


F10, F13, F16 = font(10, mono=True), font(13), font(16)
F18, F23, F30, F43 = font(18, True), font(23, True), font(30, True), font(43, True)


def txt(draw, pos, value, fill=TEXT, face=F16):
    draw.text(pos, value, fill=fill, font=face)


def box(draw, xy, fill=PANEL, radius=18, outline=None):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=1)


def pill(draw, x, y, label, active=False, width=None):
    width = width or max(78, len(label) * 8 + 24)
    box(draw, (x, y, x + width, y + 34), (36, 85, 49) if active else FIELD, 10,
        GREEN if active else (53, 79, 59))
    txt(draw, (x + 12, y + 8), label, GREEN if active else MUTED, F13)
    return width


def field(draw, x, y, w, label, value, height=56):
    txt(draw, (x + 3, y), label.upper(), MUTED, F10)
    box(draw, (x, y + 18, x + w, y + height), FIELD, 10, (48, 77, 54))
    txt(draw, (x + 13, y + 28), value, TEXT, F13)


def base(scene, progress):
    image = Image.new("RGB", (WIDTH, HEIGHT), (8, 17, 11))
    draw = ImageDraw.Draw(image)
    for x in range(28, WIDTH, 28):
        for y in range(35, HEIGHT, 28):
            draw.ellipse((x, y, x + 1, y + 1), fill=(24, 48, 29))
    draw.arc((500, -445, 1200, 255), 5, 175, fill=(32, 65, 39), width=1)
    draw.arc((568, -365, 1130, 195), 5, 175, fill=(32, 65, 39), width=1)
    txt(draw, (48, 29), "TRADING JOURNAL  /  FIELD GUIDE", GREEN, F10)
    txt(draw, (818, 29), f"{scene + 1:02d} / {SCENES:02d}", GREEN, F10)
    draw.line((48, 58, 912, 58), fill=(39, 69, 46), width=1)
    draw.rounded_rectangle((48, 513, 912, 517), radius=2, fill=(31, 53, 37))
    draw.rounded_rectangle((48, 513, 48 + int(864 * progress), 517), radius=2, fill=GREEN)
    return image, draw


def render(scene, local, progress):
    image, d = base(scene, progress)
    rise = int((1 - min(1, local * 3)) * 15)
    if scene == 0:
        txt(d, (135, 141 + rise), "Make every trade", TEXT, F43)
        txt(d, (135, 201 + rise), "a lesson.", GREEN, F43)
        txt(d, (140, 282 + rise), "Capture a setup. Follow the trade. Review the decision.", MUTED, F18)
        box(d, (136, 345 + rise, 824, 418 + rise), PANEL, 17, (50, 79, 55))
        pill(d, 162, 363 + rise, "PLAN", True)
        d.line((276, 380 + rise, 390, 380 + rise), fill=GREEN, width=2)
        pill(d, 406, 363 + rise, "EXECUTE", True, 104)
        d.line((530, 380 + rise, 644, 380 + rise), fill=GREEN, width=2)
        pill(d, 660, 363 + rise, "REFLECT", True, 108)
    elif scene == 1:
        txt(d, (135, 94 + rise), "Start with the idea.", TEXT, F30)
        txt(d, (136, 135 + rise), "Quick capture / paste a chart link and a few words.", MUTED, F16)
        box(d, (135, 196 + rise, 825, 425 + rise), PANEL, 19, (53, 82, 57))
        field(d, 163, 224 + rise, 632, "Trade idea URL",
              "https://www.tradingview.com/chart/EURUSD/")
        field(d, 163, 295 + rise, 632, "What are you seeing?",
              "EURUSD long · break and retest · London session")
        box(d, (568, 367 + rise, 795, 405 + rise), GREEN, 10)
        txt(d, (594, 377 + rise), "Organize my idea  →", (7, 27, 11), F13)
    elif scene == 2:
        txt(d, (115, 89 + rise), "The journal asks what matters.", TEXT, F30)
        txt(d, (116, 132 + rise), "AI organizes your words and leaves unknown details for you.", MUTED, F16)
        box(d, (115, 185 + rise, 844, 432 + rise), PANEL, 19, (53, 82, 57))
        txt(d, (144, 210 + rise), "DRAFT / EURUSD", GREEN, F10)
        txt(d, (144, 242 + rise), "Direction", MUTED, F13)
        pill(d, 270, 232 + rise, "Long", True)
        txt(d, (144, 292 + rise), "Entry reason", MUTED, F13)
        txt(d, (270, 291 + rise), "Break and retest at London open", TEXT, F13)
        d.line((143, 331 + rise, 816, 331 + rise), fill=(47, 77, 53))
        txt(d, (144, 349 + rise), "One thing to clarify", GREEN, F10)
        txt(d, (144, 371 + rise), "Does this setup meet your trading criteria?", TEXT, F16)
    elif scene == 3:
        txt(d, (113, 93 + rise), "You confirm. Then save.", TEXT, F30)
        txt(d, (115, 135 + rise), "Check every field. Choose planned or active.", MUTED, F16)
        box(d, (113, 190 + rise, 847, 424 + rise), PANEL, 19, (53, 82, 57))
        field(d, 141, 216 + rise, 324, "Pair or symbol", "EUR/USD")
        field(d, 491, 216 + rise, 324, "Market", "Forex")
        txt(d, (142, 302 + rise), "How should this be saved?", MUTED, F13)
        pill(d, 142, 334 + rise, "Planned setup", True, 167)
        pill(d, 321, 334 + rise, "Active trade", False, 156)
        box(d, (652, 350 + rise, 815, 392 + rise), GREEN, 11)
        txt(d, (688, 362 + rise), "Save trade  ✓", (7, 27, 11), F13)
    elif scene == 4:
        txt(d, (98, 91 + rise), "Follow the trade as it unfolds.", TEXT, F30)
        txt(d, (100, 133 + rise), "A saved idea becomes an execution, then a review.", MUTED, F16)
        names = [("01", "Planned", "Save the setup"), ("02", "Active", "Record execution"), ("03", "Completed", "Review the outcome")]
        for i, (num, title, note) in enumerate(names):
            x = 100 + i * 262
            box(d, (x, 216 + rise, x + 239, 389 + rise), PANEL, 17, (53, 82, 57))
            txt(d, (x + 21, 240 + rise), num, GREEN, F10)
            txt(d, (x + 21, 279 + rise), title, TEXT, F23)
            txt(d, (x + 21, 344 + rise), note, MUTED, F13)
            if i < 2:
                txt(d, (x + 243, 296 + rise), "→", GREEN, F18)
    elif scene == 5:
        txt(d, (100, 85 + rise), "Your trading desk, connected.", TEXT, F30)
        txt(d, (101, 127 + rise), "The tools support the plan before and after each trade.", MUTED, F16)
        tools = [
            ("Overview", "See your process"),
            ("Calendar", "Find daily patterns"),
            ("Lot calculator", "Size the risk"),
            ("Growth roadmap", "Track your target"),
        ]
        for i, (title, note) in enumerate(tools):
            x = 100 + (i % 2) * 384
            y = 190 + (i // 2) * 116 + rise
            box(d, (x, y, x + 365, y + 99), PANEL, 16, (53, 82, 57))
            txt(d, (x + 20, y + 20), title, TEXT, F18)
            txt(d, (x + 20, y + 57), note, MUTED, F13)
            txt(d, (x + 328, y + 30), "↗", GREEN, F18)
    else:
        txt(d, (100, 81 + rise), "Reflect. Find patterns. Grow.", TEXT, F30)
        txt(d, (101, 123 + rise), "Your dashboard turns decisions into evidence.", MUTED, F16)
        box(d, (100, 178 + rise, 465, 421 + rise), PANEL, 17, (53, 82, 57))
        txt(d, (121, 200 + rise), "TRADE REVIEW", GREEN, F10)
        txt(d, (121, 243 + rise), "What did you learn?", TEXT, F18)
        txt(d, (121, 293 + rise), "The entry followed my plan.", MUTED, F13)
        txt(d, (121, 318 + rise), "Next time I will wait for", MUTED, F13)
        txt(d, (121, 343 + rise), "a confirmed retest.", MUTED, F13)
        box(d, (489, 178 + rise, 860, 421 + rise), PANEL, 17, (53, 82, 57))
        txt(d, (510, 200 + rise), "PROCESS OVER TIME", GREEN, F10)
        points = [(515, 364), (568, 338), (621, 345), (674, 292), (727, 308), (780, 254), (831, 225)]
        shifted = [(x, y + rise) for x, y in points]
        d.line(shifted, fill=GREEN, width=4, joint="curve")
        for x, y in shifted:
            d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=GREEN)
    return image


def main():
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    target = OUT / "trading-journal-guide.mp4"
    command = [ffmpeg, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24",
               "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "-", "-an", "-vcodec", "libx264",
               "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "veryfast", "-movflags", "+faststart", str(target)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert process.stdin is not None
    try:
        for frame in range(TOTAL):
            scene = min(SCENES - 1, int(frame / (SECONDS_PER_SCENE * FPS)))
            local = frame / FPS - scene * SECONDS_PER_SCENE
            image = render(scene, local, (frame + 1) / TOTAL)
            if frame == int(SECONDS_PER_SCENE * FPS * 1.5):
                image.save(OUT / "journal-guide-poster.png", optimize=True)
            process.stdin.write(image.tobytes())
    finally:
        process.stdin.close()
    error = process.stderr.read().decode("utf-8", "replace")
    if process.wait() != 0:
        raise RuntimeError(error[-1200:])
    print(f"Created {target} ({target.stat().st_size // 1024} KiB)")


if __name__ == "__main__":
    main()
