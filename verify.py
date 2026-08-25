import time, os
from playwright.sync_api import sync_playwright

EDGE = r"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
BASE = "http://127.0.0.1:8137/"
OUT = r"F:/workbuddy/math-mastery/shots"
os.makedirs(OUT, exist_ok=True)

errors = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EDGE, args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 960, "height": 1040})
    pg.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    pg.goto(BASE, wait_until="networkidle")
    # dynamically unlock every technique so all pages are open
    ids = pg.evaluate("window.TECHNIQUES.map(t=>t.id)")
    seed = "{" + ",".join(f'"{i}":{{"mastered":true,"weak":{{}}}}' for i in ids) + "}"
    pg.evaluate(f"localStorage.setItem('mathMastery.v1', {seed!r})")
    pg.reload(wait_until="networkidle")
    time.sleep(0.5)

    pg.goto(BASE + "#/path", wait_until="networkidle"); time.sleep(0.5)
    pg.screenshot(path=os.path.join(OUT, "1-path.png"))
    print("techniques count:", len(ids))

    # chicken animation
    pg.goto(BASE + "#/learn/chicken", wait_until="networkidle"); time.sleep(0.6)
    try:
        btn = pg.locator("button:has-text('演示假设法')")
        for _ in range(3):
            btn.click(timeout=2000); time.sleep(0.8)
        pg.screenshot(path=os.path.join(OUT, "2-learn-chicken.png"))
    except Exception as e:
        errors.append("chicken-btn: " + str(e))

    # general (drag)
    pg.goto(BASE + "#/learn/general", wait_until="networkidle"); time.sleep(0.6)
    pg.screenshot(path=os.path.join(OUT, "3-learn-general.png"))

    # melon loop
    pg.goto(BASE + "#/learn/melon", wait_until="networkidle"); time.sleep(1.2)
    pg.screenshot(path=os.path.join(OUT, "4-learn-melon.png"))

    # func (new: 一次函数)
    pg.goto(BASE + "#/learn/func1", wait_until="networkidle"); time.sleep(0.8)
    pg.screenshot(path=os.path.join(OUT, "5-learn-func1.png"))

    # func quadratic toggle: click 切换
    try:
        pg.locator("button:has-text('切换')").click(timeout=2000); time.sleep(0.6)
        pg.screenshot(path=os.path.join(OUT, "6-learn-func-quad.png"))
    except Exception as e:
        errors.append("func-toggle: " + str(e))

    # moving (new: 动点)
    pg.goto(BASE + "#/learn/moving", wait_until="networkidle"); time.sleep(1.2)
    pg.screenshot(path=os.path.join(OUT, "7-learn-moving.png"))

    # practice on a random skill
    pg.goto(BASE + "#/practice/ratio", wait_until="networkidle"); time.sleep(0.5)
    pg.screenshot(path=os.path.join(OUT, "8-practice.png"))
    try:
        first = pg.locator(".q").first
        first.locator(".opt").nth(0).click(timeout=2000)
        time.sleep(0.4)
        pg.screenshot(path=os.path.join(OUT, "9-practice-answer.png"))
    except Exception as e:
        errors.append("practice-click: " + str(e))

    # 奥数新动图 trip（相遇演示）
    pg.goto(BASE + "#/learn/meet", wait_until="networkidle"); time.sleep(0.6)
    try:
        pg.locator("button:has-text('相遇演示')").click(timeout=2000); time.sleep(1.4)
        pg.screenshot(path=os.path.join(OUT, "11-ao-meet-trip.png"))
    except Exception as e:
        errors.append("trip-meet: " + str(e))

    # 奥数新动图 geo（等积变形）
    pg.goto(BASE + "#/learn/area_equal", wait_until="networkidle"); time.sleep(0.6)
    pg.screenshot(path=os.path.join(OUT, "12-ao-area-geo.png"))

    # 高中专题新动图 conic（圆锥曲线）
    pg.goto(BASE + "#/learn/conic_link", wait_until="networkidle"); time.sleep(0.8)
    try:
        pg.locator("button:has-text('切换')").click(timeout=2000); time.sleep(0.6)
        pg.screenshot(path=os.path.join(OUT, "13-hs-conic.png"))
    except Exception as e:
        errors.append("conic-toggle: " + str(e))

    # 高中专题新动图 solid（空间向量建系）
    pg.goto(BASE + "#/learn/solid_axis", wait_until="networkidle"); time.sleep(0.8)
    try:
        pg.locator("button:has-text('向量 OP 扫过')").click(timeout=2000); time.sleep(0.6)
        pg.screenshot(path=os.path.join(OUT, "14-hs-solid.png"))
    except Exception as e:
        errors.append("solid-play: " + str(e))

    # progress
    pg.goto(BASE + "#/progress", wait_until="networkidle"); time.sleep(0.4)
    pg.screenshot(path=os.path.join(OUT, "10-progress.png"))

    b.close()

print("CONSOLE_ISSUES:", len(errors))
for e in errors[:40]:
    print(" -", e)
