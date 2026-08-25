/* ============================================================
 * 融会贯通 · SVG 动图模块
 * 提供三种几何/算术动画：鸡兔同笼(假设法)、将军饮马(对称点)、瓜豆原理(轨迹)
 * 每个函数接收一个容器 DOM 节点，自行渲染 SVG 与交互控件。
 * ============================================================ */
window.Anim = (function () {
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

  /* ---------- 1. 鸡兔同笼：假设法(抬腿) ---------- */
  function chicken(box) {
    box.innerHTML = "";
    const H = 8, L = 22;                 // 8头22脚
    const rabbit = (L - 2 * H) / 2;      // 3
    const chickenN = H - rabbit;         // 5
    const svg = el("svg", { viewBox: "0 0 600 230" });
    const cap = document.createElement("div");
    cap.className = "anim-cap";
    cap.textContent = "点“演示”看假设法：先假设全是鸡（每头2脚），再让所有动物抬起2条腿，地上剩下的脚全是兔子的。";
    const ctrls = document.createElement("div");
    ctrls.className = "anim-ctrls";
    const btn = document.createElement("button");
    btn.className = "btn"; btn.textContent = "▶ 演示假设法";
    ctrls.appendChild(btn);

    // ground
    svg.appendChild(el("line", { x1: 20, y1: 200, x2: 580, y2: 200, stroke: "#94a3b8", "stroke-width": 2 }));
    const animals = [];
    const startX = 70, gap = 62, bodyY = 150;
    for (let i = 0; i < H; i++) {
      const cx = startX + i * gap;
      const g = el("g", {});
      // body
      g.appendChild(el("ellipse", { cx: cx, cy: bodyY, rx: 18, ry: 13, fill: "#60a5fa", stroke: "#1d4ed8", "stroke-width": 1.5 }));
      // head
      g.appendChild(el("circle", { cx: cx + 16, cy: bodyY - 16, r: 9, fill: "#fde68a", stroke: "#b45309", "stroke-width": 1.5 }));
      g.appendChild(el("circle", { cx: cx + 19, cy: bodyY - 18, r: 1.6, fill: "#1f2937" }));
      // 2 standing legs (chicken's natural 2 legs) — WHITE to stand out on dark bg
      const legL = el("line", { x1: cx - 6, y1: bodyY + 12, x2: cx - 6, y2: 200, stroke: "#f8fafc", "stroke-width": 3, "stroke-linecap": "round" });
      const legR = el("line", { x1: cx + 6, y1: bodyY + 12, x2: cx + 6, y2: 200, stroke: "#f8fafc", "stroke-width": 3, "stroke-linecap": "round" });
      // extra 2 legs (rabbit's additional 2) — ORANGE, hidden until revealed
      const legL2 = el("line", { x1: cx - 3, y1: bodyY + 12, x2: cx - 3, y2: 200, stroke: "#fb923c", "stroke-width": 3, "stroke-linecap": "round", opacity: 0 });
      const legR2 = el("line", { x1: cx + 3, y1: bodyY + 12, x2: cx + 3, y2: 200, stroke: "#fb923c", "stroke-width": 3, "stroke-linecap": "round", opacity: 0 });
      g.appendChild(legL2); g.appendChild(legR2); // orange behind
      g.appendChild(legL); g.appendChild(legR);     // white in front
      svg.appendChild(g);
      animals.push({ g, legL, legR, legL2, legR2 });
    }

    function liftAll(progress) {
      const ang = -160 * progress; // swing white legs way up so they're clearly "lifted"
      animals.forEach(a => {
        [a.legL, a.legR].forEach(lg => {
          const x = +lg.getAttribute("x1"), y = +lg.getAttribute("y1");
          lg.setAttribute("transform", `rotate(${ang} ${x} ${y})`);
        });
      });
    }
    function revealRabbits() {
      for (let i = 0; i < rabbit; i++) {
        animals[i].legL2.setAttribute("opacity", 1);
        animals[i].legR2.setAttribute("opacity", 1);
        // rabbit ears
        const cx = startX + i * gap;
        animals[i].g.appendChild(el("line", { x1: cx + 13, y1: bodyY - 24, x2: cx + 10, y2: bodyY - 38, stroke: "#f472b6", "stroke-width": 2.5, "stroke-linecap": "round" }));
        animals[i].g.appendChild(el("line", { x1: cx + 20, y1: bodyY - 24, x2: cx + 23, y2: bodyY - 38, stroke: "#f472b6", "stroke-width": 2.5, "stroke-linecap": "round" }));
      }
    }
    let step = 0;
    btn.onclick = () => {
      step++;
      if (step === 1) {
        cap.textContent = "第1步：假设全是鸡 → 8头 × 2脚 = 16 脚（地上站着 16 条腿）。";
      } else if (step === 2) {
        cap.textContent = "第2步：所有动物抬起 2 条腿（白色腿）→ 鸡已全部抬起；兔还剩 2 条橙色腿站立。";
        let p = 0; const t = setInterval(() => { p += 0.08; liftAll(Math.min(1, p)); if (p >= 1) clearInterval(t); }, 16);
      } else if (step === 3) {
        const remain = L - 2 * H;
        cap.textContent = `第3步：地上剩 ${remain} 条橙色腿，每只兔站 2 条 → 兔 = ${remain}÷2 = ${rabbit} 只；鸡 = ${H}−${rabbit} = ${chickenN} 只。验算：${chickenN}×2 + ${rabbit}×4 = ${chickenN*2+rabbit*4} = ${L} ✓`;
        revealRabbits();
        btn.disabled = true; btn.textContent = "✓ 完成";
      }
    };
    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);
  }

  /* ---------- 2. 将军饮马：对称点最短路（可拖动） ---------- */
  function general(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 640 360" });
    const riverY = 190, x0 = 40, x1 = 600;
    const A = [180, 80], B = [450, 95];
    const Bp = [B[0], 2 * riverY - B[1]]; // 对称点
    // river
    svg.appendChild(el("rect", { x: x0, y: riverY, width: x1 - x0, height: 26, fill: "#0ea5e9", opacity: 0.25 }));
    svg.appendChild(el("line", { x1: x0, y1: riverY + 13, x2: x1, y2: riverY + 13, stroke: "#38bdf8", "stroke-width": 2 }));
    // optimal line A-B'
    const Mstar = lineIntersectX(A, Bp, riverY);
    svg.appendChild(el("line", { x1: A[0], y1: A[1], x2: Bp[0], y2: Bp[1], stroke: "#facc15", "stroke-width": 1.5, "stroke-dasharray": "6 5", opacity: 0.8 }));
    // B' (reflection)
    svg.appendChild(el("circle", { cx: Bp[0], cy: Bp[1], r: 6, fill: "#94a3b8" }));
    const lblBp = el("text", { x: Bp[0] + 10, y: Bp[1] + 4, fill: "#cbd5e1", "font-size": 13 }); lblBp.textContent = "B′(对称点)"; svg.appendChild(lblBp);
    // A, B
    svg.appendChild(el("circle", { cx: A[0], cy: A[1], r: 7, fill: "#22c55e" }));
    const lblA = el("text", { x: A[0] - 8, y: A[1] - 12, fill: "#cbd5e1", "font-size": 13 }); lblA.textContent = "A"; svg.appendChild(lblA);
    svg.appendChild(el("circle", { cx: B[0], cy: B[1], r: 7, fill: "#f97316" }));
    const lblB = el("text", { x: B[0] + 10, y: B[1] - 10, fill: "#cbd5e1", "font-size": 13 }); lblB.textContent = "B"; svg.appendChild(lblB);
    // path A-M and M-B
    const pathAM = el("line", { x1: A[0], y1: A[1], x2: Mstar, y2: riverY + 13, stroke: "#e2e8f0", "stroke-width": 2 });
    const pathMB = el("line", { x1: Mstar, y1: riverY + 13, x2: B[0], y2: B[1], stroke: "#e2e8f0", "stroke-width": 2 });
    svg.appendChild(pathAM); svg.appendChild(pathMB);
    // M
    const M = el("circle", { cx: Mstar, cy: riverY + 13, r: 9, fill: "#fff", stroke: "#22c55e", "stroke-width": 3, style: "cursor:grab" });
    svg.appendChild(M);

    const cap = document.createElement("div"); cap.className = "anim-cap";
    const info = document.createElement("div"); info.className = "anim-cap"; info.style.color = "#facc15";
    function update(mx) {
      mx = Math.max(x0 + 10, Math.min(x1 - 10, mx));
      const m = [mx, riverY + 13];
      M.setAttribute("cx", mx);
      pathAM.setAttribute("x2", mx); pathMB.setAttribute("x1", mx);
      const s = dist(A, m) + dist(m, B);
      const best = dist(A, Bp);
      const diff = (s - best);
      cap.textContent = `当前 PA+PB = ${s.toFixed(0)}，理论最短(AB′) = ${best.toFixed(0)}`;
      if (diff < 2.5) { info.textContent = "✓ 已落在最短点：作 B 关于河岸的对称点 B′，连 A B′ 与河岸交点即最优。"; cap.style.color = "#86efac"; }
      else { info.textContent = ""; cap.style.color = "#cbd5e1"; }
    }
    update(Mstar);
    // drag
    let drag = false;
    function pos(e) { const r = svg.getBoundingClientRect(); const sx = 640 / r.width; return (e.clientX - r.left) * sx; }
    M.addEventListener("pointerdown", e => { drag = true; M.setAttribute("style", "cursor:grabbing"); M.setPointerCapture(e.pointerId); });
    svg.addEventListener("pointermove", e => { if (drag) update(pos(e)); });
    svg.addEventListener("pointerup", () => { drag = false; M.setAttribute("style", "cursor:grab"); });

    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const b1 = document.createElement("button"); b1.className = "btn"; b1.textContent = "⤴ 跳到最短点";
    b1.onclick = () => update(Mstar);
    ctrls.appendChild(b1);
    box.appendChild(svg); box.appendChild(cap); box.appendChild(info); box.appendChild(ctrls);

    function lineIntersectX(p, q, y) {
      // 直线 pq 与水平线 y 的交点 x
      const t = (y - p[1]) / (q[1] - p[1]);
      return p[0] + t * (q[0] - p[0]);
    }
  }

  /* ---------- 3. 瓜豆原理：主动点走圆，从动点同形走圆 ---------- */
  function melon(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 600 360" });
    const O = [210, 180], R = 80, theta = 60 * Math.PI / 180, k = 1.4;
    // P 轨迹圆
    svg.appendChild(el("circle", { cx: O[0], cy: O[1], r: R, fill: "none", stroke: "#38bdf8", "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
    const lblO = el("text", { x: O[0] - 4, y: O[1] + 4, fill: "#cbd5e1", "font-size": 13 }); lblO.textContent = "O"; svg.appendChild(lblO);
    svg.appendChild(el("circle", { cx: O[0], cy: O[1], r: 3, fill: "#cbd5e1" }));
    // Q 轨迹圆（半径 kR）
    svg.appendChild(el("circle", { cx: O[0], cy: O[1], r: R * k, fill: "none", stroke: "#f472b6", "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
    // OQ 连线参考
    const opLine = el("line", { x1: O[0], y1: O[1], x2: O[0] + R, y2: O[1], stroke: "#475569", "stroke-width": 1 });
    svg.appendChild(opLine);
    const oqLine = el("line", { x1: O[0], y1: O[1], x2: O[0] + R * k, y2: O[1], stroke: "#475569", "stroke-width": 1 });
    svg.appendChild(oqLine);
    // P, Q dots
    const P = el("circle", { cx: O[0] + R, cy: O[1], r: 7, fill: "#38bdf8" });
    const Q = el("circle", { cx: O[0] + R * k, cy: O[1], r: 7, fill: "#f472b6" });
    svg.appendChild(P); svg.appendChild(Q);
    const lblP = el("text", { x: O[0] + R + 8, y: O[1] - 8, fill: "#7dd3fc", "font-size": 13 }); lblP.textContent = "豆 P"; svg.appendChild(lblP);
    const lblQ = el("text", { x: O[0] + R * k - 6, y: O[1] + 22, fill: "#f9a8d4", "font-size": 13 }); lblQ.textContent = "瓜 Q"; svg.appendChild(lblQ);

    const cap = document.createElement("div"); cap.className = "anim-cap";
    cap.textContent = "豆 P 绕 O 走圆；瓜 Q 由 P 绕 O 旋转 60° 并放大 1.4 倍得到 → Q 也走一个圆（轨迹同形）。点击暂停/继续。";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    let playing = true;
    const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "⏸ 暂停";
    btn.onclick = () => { playing = !playing; btn.textContent = playing ? "⏸ 暂停" : "▶ 继续"; };
    ctrls.appendChild(btn);

    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);

    let ang = 0;
    function frame() {
      if (playing) ang += 0.012;
      const px = O[0] + R * Math.cos(ang), py = O[1] + R * Math.sin(ang);
      // Q = O + k * Rot(theta) * (P-O)
      const dx = px - O[0], dy = py - O[1];
      const rx = dx * Math.cos(theta) - dy * Math.sin(theta);
      const ry = dx * Math.sin(theta) + dy * Math.cos(theta);
      const qx = O[0] + k * rx, qy = O[1] + k * ry;
      P.setAttribute("cx", px); P.setAttribute("cy", py);
      Q.setAttribute("cx", qx); Q.setAttribute("cy", qy);
      opLine.setAttribute("x2", px); opLine.setAttribute("y2", py);
      oqLine.setAttribute("x2", qx); oqLine.setAttribute("y2", qy);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 4. 函数图像：一次函数/二次函数（可拖动调参） ---------- */
  function func(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 600 360" });
    const W = 600, H = 360, cx = 60, cy = 300; // 原点
    const sx = 50, sy = 40;                      // 比例尺：x每单位50px, y每单位40px
    // 坐标轴
    svg.appendChild(el("line", { x1: 0, y1: cy, x2: W, y2: cy, stroke: "#64748b", "stroke-width": 1.5 }));
    svg.appendChild(el("line", { x1: cx, y1: 0, x2: cx, y2: H, stroke: "#64748b", "stroke-width": 1.5 }));
    const lblx = el("text", { x: W - 16, y: cy - 6, fill: "#94a3b8", "font-size": 12 }); lblx.textContent = "x"; svg.appendChild(lblx);
    const lbly = el("text", { x: cx + 6, y: 12, fill: "#94a3b8", "font-size": 12 }); lbly.textContent = "y"; svg.appendChild(lbly);
    // 网格刻度
    for (let i = 1; i <= 10; i++) svg.appendChild(el("line", { x1: cx + i * sx, y1: cy - 3, x2: cx + i * sx, y2: cy + 3, stroke: "#475569" }));
    for (let i = 1; i <= 6; i++) svg.appendChild(el("line", { x1: cx - 3, y1: cy - i * sy, x2: cx + 3, y2: cy - i * sy, stroke: "#475569" }));

    let k = 1, b = 0, quad = false;
    const path = el("path", { d: "", fill: "none", stroke: "#22d3ee", "stroke-width": 3 });
    svg.appendChild(path);
    function px(x) { return cx + x * sx; }
    function py(y) { return cy - y * sy; }
    function draw() {
      if (!quad) {
        let d = "";
        for (let x = -cx / sx; x <= (W - cx) / sx; x += 0.05) {
          const y = k * x + b; const X = px(x), Y = py(y);
          d += (d ? "L" : "M") + X.toFixed(1) + " " + Y.toFixed(1) + " ";
        }
        path.setAttribute("d", d);
      } else {
        let d = "";
        for (let x = -cx / sx; x <= (W - cx) / sx; x += 0.05) {
          const y = k * x * x + b; const X = px(x), Y = py(y);
          if (Y < -20 || Y > H + 20) { d += ""; continue; }
          d += (d ? "L" : "M") + X.toFixed(1) + " " + Y.toFixed(1) + " ";
        }
        path.setAttribute("d", d);
      }
    }
    draw();

    const cap = document.createElement("div"); cap.className = "anim-cap";
    const info = document.createElement("div"); info.className = "anim-cap"; info.style.color = "#22d3ee";
    function updateInfo() {
      if (quad) info.textContent = `当前：y = ${k}x² + ${b}，${k > 0 ? "开口向上" : "开口向下"}`;
      else info.textContent = `当前：y = ${k}x + ${b}，斜率 k=${k}（${k > 0 ? "上升" : k < 0 ? "下降" : "水平"}），截距 b=${b}`;
    }
    updateInfo();

    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const bK = btn2("k −0.5"); bK.onclick = () => { k = Math.round((k - 0.5) * 10) / 10; draw(); updateInfo(); };
    const aK = btn2("k +0.5"); aK.onclick = () => { k = Math.round((k + 0.5) * 10) / 10; draw(); updateInfo(); };
    const bB = btn2("b −1"); bB.onclick = () => { b = Math.round((b - 1) * 10) / 10; draw(); updateInfo(); };
    const aB = btn2("b +1"); aB.onclick = () => { b = Math.round((b + 1) * 10) / 10; draw(); updateInfo(); };
    const togg = btn2("切换 一次/二次"); togg.onclick = () => { quad = !quad; k = quad ? 1 : 1; b = 0; draw(); updateInfo(); };
    ctrls.appendChild(bK); ctrls.appendChild(aK); ctrls.appendChild(bB); ctrls.appendChild(aB); ctrls.appendChild(togg);
    box.appendChild(svg); box.appendChild(cap); box.appendChild(info); box.appendChild(ctrls);
    cap.textContent = "拖动下方按钮调节 斜率 k 与 截距 b（或切换二次函数），观察图像如何随参数变化。";

    function btn2(t) { const b = document.createElement("button"); b.className = "btn sm"; b.textContent = t; return b; }
  }

  /* ---------- 5. 动点问题：点沿矩形边移动，实时看 AP 距离与扫过面积 ---------- */
  function move(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 600 320" });
    // 矩形 A(80,60) B(520,60) C(520,240) D(80,240)  — 动点 P 从 A 沿边到 C
    const A = [80, 60], Bp = [520, 60], C = [520, 240], D = [80, 240];
    const rect = el("polygon", { points: `${A} ${Bp} ${C} ${D}`.replace(/,/g, " "), fill: "rgba(56,189,248,0.08)", stroke: "#38bdf8", "stroke-width": 2 });
    // 注意 points 格式：用空格分隔坐标对
    rect.setAttribute("points", `${A[0]},${A[1]} ${Bp[0]},${Bp[1]} ${C[0]},${C[1]} ${D[0]},${D[1]}`);
    svg.appendChild(rect);
    function dot(p, c, r) { const e = el("circle", { cx: p[0], cy: p[1], r: r || 6, fill: c }); svg.appendChild(e); return e; }
    dot(A, "#22c55e"); dot(Bp, "#64748b"); dot(C, "#64748b"); dot(D, "#64748b");
    const lblA = el("text", { x: A[0] - 6, y: A[1] - 10, fill: "#86efac", "font-size": 13 }); lblA.textContent = "A"; svg.appendChild(lblA);
    const lblC = el("text", { x: C[0] + 8, y: C[1] + 4, fill: "#cbd5e1", "font-size": 13 }); lblC.textContent = "C"; svg.appendChild(lblC);
    // 轨迹：A→B→C（两段）
    const topLen = Bp[0] - A[0], rightLen = C[1] - Bp[1];
    const total = topLen + rightLen;
    const pathSeg = el("polyline", { points: `${A[0]},${A[1]} ${Bp[0]},${Bp[1]} ${C[0]},${C[1]}`, fill: "none", stroke: "#f59e0b", "stroke-width": 2, "stroke-dasharray": "6 4" });
    svg.appendChild(pathSeg);
    const P = dot([A[0], A[1]], "#fff", 9); P.setAttribute("stroke", "#22c55e"); P.setAttribute("stroke-width", 3);
    const APline = el("line", { x1: A[0], y1: A[1], x2: A[0], y2: A[1], stroke: "#f87171", "stroke-width": 2 }); svg.appendChild(APline);

    function posAt(t) { // t in [0,1]
      const d = t * total;
      if (d <= topLen) return [A[0] + d, A[1]];
      const dd = d - topLen; return [Bp[0], Bp[1] + dd];
    }
    const cap = document.createElement("div"); cap.className = "anim-cap"; cap.style.color = "#f87171";
    const info = document.createElement("div"); info.className = "anim-cap"; info.style.color = "#fbbf24";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    let t = 0, playing = true;
    const playBtn = document.createElement("button"); playBtn.className = "btn"; playBtn.textContent = "⏸ 暂停";
    playBtn.onclick = () => { playing = !playing; playBtn.textContent = playing ? "⏸ 暂停" : "▶ 继续"; };
    const slide = document.createElement("input"); slide.type = "range"; slide.min = "0"; slide.max = "100"; slide.value = "0"; slide.style.width = "180px";
    slide.oninput = () => { t = +slide.value / 100; playing = false; playBtn.textContent = "▶ 继续"; update(); };
    ctrls.appendChild(playBtn); ctrls.appendChild(slide);

    function update() {
      const p = posAt(t);
      P.setAttribute("cx", p[0]); P.setAttribute("cy", p[1]);
      APline.setAttribute("x2", p[0]); APline.setAttribute("y2", p[1]);
      const ap = Math.hypot(p[0] - A[0], p[1] - A[1]);
      const along = t * total;
      // 扫过面积：上半段为矩形(along * 180); 下半段加整上边矩形 + 右段矩形
      let area;
      if (along <= topLen) area = along * (C[1] - A[1]);
      else area = topLen * (C[1] - A[1]) + (along - topLen) * (Bp[0] - A[0]);
      cap.textContent = `动点 P 已走路程 = ${along.toFixed(0)}；AP 直线距离 = ${ap.toFixed(0)}`;
      info.textContent = `扫过矩形面积 = ${area.toFixed(0)}（面积在拐点处增长速率发生变化 → 分段函数思想）`;
    }
    update();
    box.appendChild(svg); box.appendChild(cap); box.appendChild(info); box.appendChild(ctrls);

    let last = 0;
    function frame(ts) {
      if (playing) {
        if (!last) last = ts;
        const dt = (ts - last) / 1000; last = ts;
        t += dt * 0.25; if (t > 1) t = 0; last = 0;
        slide.value = Math.round(t * 100); update();
      } else { last = 0; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function trip(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 640 260" });
    const cap = document.createElement("div"); cap.className = "anim-cap";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const btnMeet = document.createElement("button"); btnMeet.className = "btn sm"; btnMeet.textContent = "▶ 相遇演示";
    const btnChase = document.createElement("button"); btnChase.className = "btn sm"; btnChase.textContent = "▶ 追及演示";
    ctrls.appendChild(btnMeet); ctrls.appendChild(btnChase);

    svg.appendChild(el("line", { x1: 30, y1: 200, x2: 610, y2: 200, stroke: "#475569", "stroke-width": 2 }));
    svg.appendChild(el("circle", { cx: 60, cy: 200, r: 6, fill: "#0ea5e9" }));
    svg.appendChild(el("circle", { cx: 580, cy: 200, r: 6, fill: "#f59e0b" }));
    const aTxt = el("text", { x: 60, y: 226, "text-anchor": "middle", fill: "#0ea5e9", "font-size": 14 }); aTxt.textContent = "A地";
    const bTxt = el("text", { x: 580, y: 226, "text-anchor": "middle", fill: "#f59e0b", "font-size": 14 }); bTxt.textContent = "B地";
    svg.appendChild(aTxt); svg.appendChild(bTxt);
    const p1 = el("circle", { cx: 60, cy: 185, r: 9, fill: "#0ea5e9" });
    const p2 = el("circle", { cx: 580, cy: 185, r: 9, fill: "#f59e0b" });
    svg.appendChild(p1); svg.appendChild(p2);
    const info = el("text", { x: 320, y: 48, "text-anchor": "middle", fill: "#0f172a", "font-size": 16, "font-weight": "bold" });
    svg.appendChild(info);

    let raf = null;
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

    function play(mode) {
      stop();
      const A = 60, B = 580, y = 185;
      if (mode === "meet") {
        const v1 = 6, v2 = 4;
        cap.textContent = "相遇：甲(蓝)从A向右、乙(橙)从B向左，路程和=总距；相遇时间=总距÷(速度和)。";
        let t = 0;
        const step = () => {
          t += 0.4; const x1 = A + v1 * t, x2 = B - v2 * t;
          p1.setAttribute("cx", x1); p2.setAttribute("cx", x2);
          info.textContent = "t=" + t.toFixed(1) + "  甲走" + (v1*t).toFixed(0) + "  乙走" + (v2*t).toFixed(0);
          if (x1 >= x2) {
            const mx = (x1 + x2) / 2; p1.setAttribute("cx", mx); p2.setAttribute("cx", mx);
            info.textContent = "在距A " + (v1*t).toFixed(0) + " 处相遇 ✓"; raf = null; return;
          }
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      } else {
        const v1 = 8, v2 = 5;
        cap.textContent = "追及：甲(蓝,快)从A在后追乙(橙,慢)在前，追及时间=路程差÷(速度差)。";
        let t = 0;
        const step = () => {
          t += 0.4; const x1 = A + v1 * t, x2 = B + v2 * t;
          p1.setAttribute("cx", x1); p2.setAttribute("cx", x2);
          info.textContent = "t=" + t.toFixed(1) + "  甲走" + (v1*t).toFixed(0) + "  乙已走" + ((B-A)+v2*t).toFixed(0);
          if (x1 >= x2) {
            p1.setAttribute("cx", x2); p2.setAttribute("cx", x2);
            info.textContent = "甲在第 " + (v1*t).toFixed(0) + " 米处追上 ✓"; raf = null; return;
          }
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }
    }
    btnMeet.onclick = () => play("meet");
    btnChase.onclick = () => play("chase");
    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);
  }

  function geo(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 640 280" });
    const cap = document.createElement("div"); cap.className = "anim-cap";
    cap.textContent = "拖动红色顶点（沿灰色虚线平行线移动）：底和高都不变 → 面积恒定。这正是等积变形。";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const areaTxt = document.createElement("div"); areaTxt.className = "anim-cap";
    ctrls.appendChild(areaTxt);

    const baseY = 200, xL = 120, xR = 520;
    svg.appendChild(el("line", { x1: xL, y1: baseY, x2: xR, y2: baseY, stroke: "#475569", "stroke-width": 2 }));
    svg.appendChild(el("line", { x1: 40, y1: 70, x2: 600, y2: 70, stroke: "#cbd5e1", "stroke-width": 1, "stroke-dasharray": "5 5" }));
    const vertex = { x: 320, y: 70 };
    const tri = el("polygon", { points: xL + "," + baseY + " " + xR + "," + baseY + " " + vertex.x + "," + vertex.y, fill: "rgba(14,165,233,0.25)", stroke: "#0ea5e9", "stroke-width": 2 });
    svg.appendChild(tri);
    const v = el("circle", { cx: vertex.x, cy: vertex.y, r: 8, fill: "#ef4444", "cursor": "grab" });
    svg.appendChild(v);
    const heightLine = el("line", { x1: vertex.x, y1: vertex.y, x2: vertex.x, y2: baseY, stroke: "#94a3b8", "stroke-width": 1, "stroke-dasharray": "4 4" });
    svg.appendChild(heightLine);
    const hTxt = el("text", { x: vertex.x + 8, y: (vertex.y + baseY) / 2, fill: "#64748b", "font-size": 13 }); hTxt.textContent = "高h";
    svg.appendChild(hTxt);

    function area() { return (xR - xL) * (baseY - vertex.y) / 2; }
    function update() {
      tri.setAttribute("points", xL + "," + baseY + " " + xR + "," + baseY + " " + vertex.x + "," + vertex.y);
      heightLine.setAttribute("x1", vertex.x); heightLine.setAttribute("x2", vertex.x);
      hTxt.setAttribute("x", vertex.x + 8);
      areaTxt.textContent = "底=" + (xR - xL) + "，高=" + (baseY - vertex.y) + " → 面积=" + area();
    }
    update();

    let drag = false;
    function pos(e) { const r = svg.getBoundingClientRect(); const sx = 640 / r.width; return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sx }; }
    v.addEventListener("pointerdown", () => { drag = true; });
    svg.addEventListener("pointermove", e => {
      if (!drag) return;
      const p = pos(e);
      vertex.x = Math.max(60, Math.min(580, p.x));
      vertex.y = 70;
      v.setAttribute("cx", vertex.x); v.setAttribute("cy", vertex.y);
      update();
    });
    svg.addEventListener("pointerup", () => { drag = false; });
    svg.addEventListener("pointerleave", () => { drag = false; });

    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);
  }

  /* ---------- 8. 立体几何·空间向量建系（可拖动滑块） ---------- */
  function solid(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 600 380" });
    const cap = document.createElement("div"); cap.className = "anim-cap";
    cap.textContent = "拖动滑块改变点 P 的坐标，观察空间直角坐标系与向量 OP 的变化（斜二测示意）。";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const O = { x: 170, y: 300 };
    const ux = { x: 46, y: -10 }, uy = { x: 22, y: -42 }, uz = { x: 0, y: -46 };
    const proj = (x, y, z) => ({ x: O.x + x * ux.x + y * uy.x + z * uz.x, y: O.y + x * ux.y + y * uy.y + z * uz.y });
    function axis(v, color, label) {
      const e = proj(v.x, v.y, v.z);
      svg.appendChild(el("line", { x1: O.x, y1: O.y, x2: e.x, y2: e.y, stroke: color, "stroke-width": 2 }));
      const t = el("text", { x: e.x + 4, y: e.y - 2, fill: color, "font-size": 14 }); t.textContent = label; svg.appendChild(t);
    }
    axis({ x: 8, y: 0, z: 0 }, "#ef4444", "x");
    axis({ x: 0, y: 8, z: 0 }, "#22c55e", "y");
    axis({ x: 0, y: 0, z: 8 }, "#3b82f6", "z");
    function edge(a, b) { const p = proj(a[0], a[1], a[2]), q = proj(b[0], b[1], b[2]); svg.appendChild(el("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#cbd5e1", "stroke-width": 1 })); }
    edge([0,0,0],[8,0,0]); edge([8,0,0],[8,8,0]); edge([8,8,0],[0,8,0]); edge([0,8,0],[0,0,0]);
    edge([0,0,8],[8,0,8]); edge([8,0,8],[8,8,8]); edge([8,8,8],[0,8,8]); edge([0,8,8],[0,0,8]);
    edge([0,0,0],[0,0,8]); edge([8,0,0],[8,0,8]); edge([8,8,0],[8,8,8]); edge([0,8,0],[0,8,8]);
    const st = { x: 4, y: 3, z: 5 };
    const vec = el("line", { x1: O.x, y1: O.y, x2: 0, y2: 0, stroke: "#f59e0b", "stroke-width": 2.5 });
    const pt = el("circle", { cx: 0, cy: 0, r: 7, fill: "#f59e0b", stroke: "#b45309", "stroke-width": 1.5 });
    const label = el("text", { x: 0, y: 0, fill: "#92400e", "font-size": 14, "font-weight": "bold" });
    svg.appendChild(vec); svg.appendChild(pt); svg.appendChild(label);
    function render() {
      const p = proj(st.x, st.y, st.z);
      pt.setAttribute("cx", p.x); pt.setAttribute("cy", p.y);
      vec.setAttribute("x2", p.x); vec.setAttribute("y2", p.y);
      label.setAttribute("x", p.x + 10); label.setAttribute("y", p.y - 8);
      label.textContent = "P(" + st.x + "," + st.y + "," + st.z + ")";
    }
    render();
    const sync = {};
    function mkSlider(name, val) {
      const lab = document.createElement("label"); lab.className = "anim-ctrl"; lab.textContent = name + " ";
      const s = document.createElement("input"); s.type = "range"; s.min = 0; s.max = 8; s.step = 1; s.value = val;
      s.oninput = () => { st[name.toLowerCase()] = +s.value; render(); };
      lab.appendChild(s); sync[name.toLowerCase()] = s; return lab;
    }
    ctrls.appendChild(mkSlider("x", 4)); ctrls.appendChild(mkSlider("y", 3)); ctrls.appendChild(mkSlider("z", 5));
    const play = document.createElement("button"); play.className = "btn sm"; play.textContent = "▶ 向量 OP 扫过";
    play.onclick = () => { let t = 0; const id = setInterval(() => {
      t += 0.06; if (t >= 1) { clearInterval(id); t = 1; }
      st.x = Math.round(8 * t); st.y = Math.round(8 * t); st.z = Math.round(8 * t);
      sync.x.value = st.x; sync.y.value = st.y; sync.z.value = st.z; render();
    }, 16); };
    ctrls.appendChild(play);
    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);
  }

  /* ---------- 9. 解析几何·圆锥曲线（可切换+调参） ---------- */
  function conic(box) {
    box.innerHTML = "";
    const svg = el("svg", { viewBox: "0 0 600 380" });
    const cap = document.createElement("div"); cap.className = "anim-cap";
    cap.textContent = "拖动 a、b 看曲线变化；切换类型观察椭圆 / 双曲线 / 抛物线的焦点、渐近线与准线。";
    const ctrls = document.createElement("div"); ctrls.className = "anim-ctrls";
    const typeBtn = document.createElement("button"); typeBtn.className = "btn sm"; typeBtn.textContent = "切换：椭圆";
    function slider(name, val) {
      const lab = document.createElement("label"); lab.className = "anim-ctrl"; lab.textContent = name + " ";
      const s = document.createElement("input"); s.type = "range"; s.min = 1; s.max = 6; s.step = 1; s.value = val; s.oninput = draw;
      lab.appendChild(s); return lab;
    }
    const aS = slider("a", 4), bS = slider("b", 3);
    ctrls.appendChild(typeBtn); ctrls.appendChild(aS); ctrls.appendChild(bS);
    const O = { x: 300, y: 200 };
    svg.appendChild(el("line", { x1: 30, y1: 200, x2: 570, y2: 200, stroke: "#94a3b8", "stroke-width": 1 }));
    svg.appendChild(el("line", { x1: 300, y1: 30, x2: 300, y2: 370, stroke: "#94a3b8", "stroke-width": 1 }));
    const curveG = el("g", {}); svg.appendChild(curveG);
    const fociG = el("g", {}); svg.appendChild(fociG);
    const info = el("text", { x: 40, y: 60, fill: "#f1f5f9", "font-size": 14, "font-weight": "bold" }); svg.appendChild(info);
    let type = 0; const types = ["椭圆", "双曲线", "抛物线"];
    function poly(pts, color) {
      const pl = el("polyline", { fill: "none", stroke: color || "#2563eb", "stroke-width": 2.5 });
      pl.setAttribute("points", pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "));
      curveG.appendChild(pl);
    }
    function draw() {
      curveG.innerHTML = ""; fociG.innerHTML = "";
      const a = +aS.querySelector("input").value, b = +bS.querySelector("input").value;
      if (type === 0) {
        const c = Math.sqrt(Math.max(0.0001, a * a - b * b));
        let pts = []; for (let i = 0; i <= 120; i++) { const t = i / 120 * 2 * Math.PI; pts.push([O.x + a * 40 * Math.cos(t), O.y - b * 40 * Math.sin(t)]); }
        poly(pts);
        fociG.appendChild(el("circle", { cx: O.x - c * 40, cy: O.y, r: 4, fill: "#ef4444" }));
        fociG.appendChild(el("circle", { cx: O.x + c * 40, cy: O.y, r: 4, fill: "#ef4444" }));
        info.textContent = "椭圆  x²/" + a + "² + y²/" + b + "² = 1   焦点(±" + c.toFixed(2) + ",0)   e=" + (c / a).toFixed(2);
      } else if (type === 1) {
        const c = Math.sqrt(a * a + b * b);
        let p1 = [], p2 = []; for (let i = -70; i <= 70; i++) { const t = i / 22; const x = a * 40 * Math.cosh(t), y = b * 40 * Math.sinh(t); p1.push([O.x + x, O.y - y]); p2.push([O.x - x, O.y - y]); }
        poly(p1); poly(p2);
        fociG.appendChild(el("circle", { cx: O.x - c * 40, cy: O.y, r: 4, fill: "#ef4444" }));
        fociG.appendChild(el("circle", { cx: O.x + c * 40, cy: O.y, r: 4, fill: "#ef4444" }));
        fociG.appendChild(el("line", { x1: O.x - a * 40, y1: O.y - b * 40, x2: O.x + a * 40, y2: O.y + b * 40, stroke: "#fca5a5", "stroke-width": 1, "stroke-dasharray": "5 4" }));
        fociG.appendChild(el("line", { x1: O.x - a * 40, y1: O.y + b * 40, x2: O.x + a * 40, y2: O.y - b * 40, stroke: "#fca5a5", "stroke-width": 1, "stroke-dasharray": "5 4" }));
        info.textContent = "双曲线 x²/" + a + "² − y²/" + b + "² = 1   渐近线 y=±" + (b / a).toFixed(2) + "x";
      } else {
        const p = 2 * a;
        let pts = []; for (let i = -90; i <= 90; i++) { const y = i; const x = y * y / (2 * p); if (x <= 250) pts.push([O.x + x, O.y - y]); }
        poly(pts, "#16a34a");
        fociG.appendChild(el("circle", { cx: O.x + p / 2 * 40, cy: O.y, r: 4, fill: "#ef4444" }));
        fociG.appendChild(el("line", { x1: O.x - p / 2 * 40, y1: 30, x2: O.x - p / 2 * 40, y2: 370, stroke: "#fca5a5", "stroke-width": 1, "stroke-dasharray": "5 4" }));
        info.textContent = "抛物线 y² = " + (2 * a) + "x   焦点(" + (p / 2).toFixed(1) + ",0)   准线 x = " + (-p / 2).toFixed(1);
      }
    }
    typeBtn.onclick = () => { type = (type + 1) % 3; typeBtn.textContent = "切换：" + types[type]; draw(); };
    draw();
    box.appendChild(svg); box.appendChild(cap); box.appendChild(ctrls);
  }

  return { chicken, general, melon, func, move, trip, geo, solid, conic };
})();
