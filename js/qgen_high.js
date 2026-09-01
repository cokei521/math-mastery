/* ============================================================
 * 融会贯通 · 高中数学方法参数化出题引擎
 * 覆盖：集合、函数、指数对数、三角函数、数列、向量、
 *       立体几何、导数、圆锥曲线、参数方程、概率统计、复数
 * ============================================================ */
(function () {
  const K = { ink: "#334155", sub: "#64748b", line: "#cbd5e1", pri: "#2f6fed", ok: "#16a34a", warn: "#d97706", red: "#dc2626", soft: "#eef3ff", blue: "#2563eb" };
  function S(w, h, inner) { return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`; }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[rnd(0, a.length - 1)]; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function opts(ans, make1, make2, make3) {
    const arr = [String(ans), String(make1()), String(make2()), String(make3())];
    const unique = [...new Set(arr)];
    while (unique.length < 4) { unique.push(String(ans + unique.length)); }
    return { opts: unique.map(String), ans: unique.indexOf(String(ans)) };
  }

  function Q(q, optsObj, level, explain, point, fig) {
    return Object.assign({ q, level: level || "基础", explain, point: point || "" }, optsObj, { fig: fig || null });
  }

  /* ============================================================
   * 1. 集合与逻辑（十年级）
   * ============================================================ */
  function qSet(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 集合运算
        const a = rnd(2, 5);
        const b = rnd(2, 5);
        const inter = Math.min(a, b);
        o = opts(inter + "个", () => (a + b) + "个", () => Math.abs(a - b) + "个", () => "0个");
        q = `集合 A 有 ${a} 个元素，集合 B 有 ${b} 个元素，若 A⊆B，则 A∩B 有？`;
        exp = `A⊆B 时 A∩B = A，有 ${a} 个元素。`;
      } else if (type === 1) {
        // 子集个数
        const n = rnd(2, 4);
        const ansCount = Math.pow(2, n);
        o = opts(`${ansCount}个`, () => ansCount + n, () => ansCount - 1, () => n + "个");
        q = `集合有 ${n} 个元素，它的子集共有？`;
        exp = `n 个元素的集合有 2ⁿ 个子集，2^${n} = ${ansCount} 个。`;
      } else if (type === 2) {
        // 充分必要条件
        o = opts("充分不必要", () => "必要不充分", () => "充要", () => "既不充分也不必要");
        q = `"x > 2" 是 "x > 1" 的什么条件？`;
        exp = `x > 2 能推出 x > 1（充分），但 x > 1 不能推出 x > 2（不必要），故为充分不必要条件。`;
      } else {
        // 命题否定
        o = opts("∀x∈R, x² ≥ 0", () => "∃x∈R, x² ≥ 0", () => "∀x∈R, x² < 0", () => "∃x∈R, x² ≤ 0");
        q = `命题 "∃x∈R, x² < 0" 的否定是？`;
        exp = `存在命题的否定是全称命题：∀x∈R, x² ≥ 0。`;
      }
      results.push(Q(q, o, "基础", exp, "集合与逻辑"));
    }
    return results;
  }

  /* ============================================================
   * 2. 函数概念与性质（十年级）
   * ============================================================ */
  function qFuncConcept(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 定义域
        const a = rnd(1, 5);
        o = opts(`x ≠ ${a}`, () => `x ≠ ${a + 1}`, () => `x ≥ 0`, () => `全体实数`);
        q = `函数 f(x) = 1/(x − ${a}) 的定义域是？`;
        exp = `分母不为 0，x − ${a} ≠ 0，即 x ≠ ${a}。`;
      } else if (type === 1) {
        // 值域
        const a = rnd(1, 5);
        o = opts(`y ≥ ${a}`, () => `y ≤ ${a}`, () => `y > ${a}`, () => `全体实数`);
        q = `函数 f(x) = (x − 1)² + ${a} 的值域是？`;
        exp = `平方项 ≥ 0，故 f(x) ≥ ${a}，值域为 y ≥ ${a}。`;
      } else if (type === 2) {
        // 奇偶性
        o = opts("奇函数", () => "偶函数", () => "既是奇函数又是偶函数", () => "非奇非偶");
        q = `函数 f(x) = x³ 是？`;
        exp = `f(−x) = (−x)³ = −x³ = −f(x)，为奇函数。`;
      } else {
        // 单调性
        const a = rnd(1, 5);
        o = opts("在 R 上递增", () => "在 R 上递减", () => "先减后增", () => "先增后减");
        q = `函数 f(x) = ${a}x + 1 (a > 0) 的单调性是？`;
        exp = `一次函数斜率 a > 0，在 R 上单调递增。`;
      }
      results.push(Q(q, o, "基础", exp, "函数概念与性质"));
    }
    return results;
  }

  /* ============================================================
   * 3. 指数与对数（十年级）
   * ============================================================ */
  function qExpLog(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 指数运算
        const a = rnd(2, 4);
        const m = rnd(1, 3);
        const ansVal = a * m;
        o = opts(`a^${ansVal}`, () => `a^${ansVal + 1}`, () => `a^${ansVal - 1}`, () => `${a * m}`);
        q = `a^${m} · a^${m} = ？`;
        exp = `同底数幂相乘，指数相加：a^${m} · a^${m} = a^${m + m} = a^${ansVal}。`;
      } else if (type === 1) {
        // 对数运算
        const base = rnd(2, 4);
        const ans = rnd(2, 5);
        const val = Math.pow(base, ans);
        o = opts(ans, () => ans + 1, () => ans - 1, () => base);
        q = `log_${base}(${val}) = ？`;
        exp = `由对数定义：${base}^${ans} = ${val}，故 log_${base}(${val}) = ${ans}。`;
      } else if (type === 2) {
        // 对数方程
        const base = rnd(2, 4);
        const ans = rnd(2, 5);
        const val = Math.pow(base, ans);
        o = opts(ans, () => ans + 1, () => ans - 1, () => val);
        q = `解方程 log_${base}(x) = ${ans}，x = ？`;
        exp = `x = ${base}^${ans} = ${val}。`;
      } else {
        // 指数方程
        const base = rnd(2, 4);
        const ans = rnd(1, 4);
        const val = Math.pow(base, ans);
        o = opts(ans, () => ans + 1, () => ans - 1, () => val);
        q = `解方程 ${base}^x = ${val}，x = ？`;
        exp = `x = log_${base}(${val}) = ${ans}。`;
      }
      results.push(Q(q, o, "基础", exp, "指数与对数"));
    }
    return results;
  }

  /* ============================================================
   * 4. 三角函数（十一年级）
   * ============================================================ */
  function qTrig(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // sin 值
        const angles = [30, 45, 60, 90, 120, 135, 150];
        const angle = pick(angles);
        const sinVals = { 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1", 120: "√3/2", 135: "√2/2", 150: "1/2" };
        o = opts(sinVals[angle], () => "0", () => "−1/2", () => "−1");
        q = `sin ${angle}° = ？`;
        exp = `sin ${angle}° = ${sinVals[angle]}。`;
      } else if (type === 1) {
        // cos 值
        const angles = [30, 45, 60, 90, 120, 135, 150];
        const angle = pick(angles);
        const sinVals = { 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1", 120: "√3/2", 135: "√2/2", 150: "1/2" };
        const cosVals = { 30: "√3/2", 45: "√2/2", 60: "1/2", 90: "0", 120: "−1/2", 135: "−√2/2", 150: "−√3/2" };
        o = opts(cosVals[angle], () => sinVals[angle], () => "0", () => "1");
        q = `cos ${angle}° = ？`;
        exp = `cos ${angle}° = ${cosVals[angle]}。`;
      } else if (type === 2) {
        // 三角恒等式
        o = opts("sin²α + cos²α = 1", () => "sin²α − cos²α = 1", () => "sinα + cosα = 1", () => "tanα = sinα/cosα");
        q = `下列等式恒成立的是？`;
        exp = `基本的三角恒等式：sin²α + cos²α = 1。`;
      } else {
        // 诱导公式
        o = opts("-sinα", () => "sinα", () => "cosα", () => "-cosα");
        q = `sin(180° − α) = ？`;
        exp = `诱导公式：sin(180° − α) = sinα。`;
      }
      results.push(Q(q, o, "基础", exp, "三角函数"));
    }
    return results;
  }

  /* ============================================================
   * 5. 三角恒等变换（十一年级）
   * ============================================================ */
  function qTrigId(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 和角公式
        o = opts("sinαcosβ + cosαsinβ", () => "sinαcosβ − cosαsinβ", () => "cosαcosβ − sinαsinβ", () => "cosαcosβ + sinαsinβ");
        q = `sin(α + β) 的展开式是？`;
        exp = `和角公式：sin(α + β) = sinαcosβ + cosαsinβ。`;
      } else if (type === 1) {
        // 二倍角公式
        o = opts("2sinαcosα", () => "sin²α − cos²α", () => "2cos²α − 1", () => "1 − 2sin²α");
        q = `sin2α 的公式是？`;
        exp = `二倍角公式：sin2α = 2sinαcosα。`;
      } else if (type === 2) {
        // 半角公式
        o = opts("±√((1−cosα)/2)", () => "±√((1+cosα)/2)", () => "1−cosα", () => "1+cosα");
        q = `sin(α/2) 的半角公式是？`;
        exp = `半角公式：sin(α/2) = ±√((1−cosα)/2)。`;
      } else {
        // 积化和差
        o = opts("(1/2)[sin(α+β)+sin(α−β)]", () => "(1/2)[cos(α+β)+cos(α−β)]", () => "(1/2)[sin(α+β)−sin(α−β)]", () => "(1/2)[cos(α+β)−cos(α−β)]");
        q = `sinαcosβ 的积化和差公式是？`;
        exp = `积化和差：sinαcosβ = (1/2)[sin(α+β)+sin(α−β)]。`;
      }
      results.push(Q(q, o, "基础", exp, "三角恒等变换"));
    }
    return results;
  }

  /* ============================================================
   * 6. 数列（十一年级）
   * ============================================================ */
  function qSequence(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 等差数列通项
        const a1 = rnd(1, 5);
        const d = rnd(1, 3);
        const n = rnd(3, 6);
        const an = a1 + (n - 1) * d;
        o = opts(an, () => an + d, () => an - d, () => a1 + n * d);
        q = `等差数列首项 ${a1}，公差 ${d}，第 ${n} 项 a_${n} = ？`;
        exp = `a_n = a₁ + (n−1)d = ${a1} + (${n}−1)×${d} = ${an}。`;
      } else if (type === 1) {
        // 等差数列求和
        const a1 = rnd(1, 5);
        const d = rnd(1, 3);
        const n = rnd(3, 6);
        const sn = n * a1 + n * (n - 1) * d / 2;
        o = opts(sn, () => sn + n, () => sn - n, () => a1 * n);
        q = `等差数列首项 ${a1}，公差 ${d}，前 ${n} 项和 S_${n} = ？`;
        exp = `S_n = na₁ + n(n−1)d/2 = ${n}×${a1} + ${n}×${n - 1}×${d}/2 = ${sn}。`;
      } else if (type === 2) {
        // 等比数列通项
        const a1 = rnd(1, 3);
        const q_val = rnd(2, 3);
        const n = rnd(3, 5);
        const an = a1 * Math.pow(q_val, n - 1);
        o = opts(an, () => an * q_val, () => an / q_val, () => a1 * n);
        q = `等比数列首项 ${a1}，公比 ${q_val}，第 ${n} 项 a_${n} = ？`;
        exp = `a_n = a₁ × q^(n−1) = ${a1} × ${q_val}^${n - 1} = ${an}。`;
      } else {
        // 等比数列求和
        const a1 = rnd(1, 3);
        const q_val = rnd(2, 3);
        const n = rnd(2, 4);
        const sn = a1 * (Math.pow(q_val, n) - 1) / (q_val - 1);
        o = opts(sn, () => sn + a1, () => sn - a1, () => a1 * n);
        q = `等比数列首项 ${a1}，公比 ${q_val}，前 ${n} 项和 S_${n} = ？`;
        exp = `S_n = a₁(q^n − 1)/(q − 1) = ${a1}×(${q_val}^${n} − 1)/(${q_val} − 1) = ${sn}。`;
      }
      results.push(Q(q, o, "基础", exp, "数列"));
    }
    return results;
  }

  /* ============================================================
   * 7. 数列求和技巧（十一年级）
   * ============================================================ */
  function qSeqSum(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 裂项相消
        const n = rnd(3, 6);
        const ans = n / (n + 1);
        o = opts(`${n}/${n + 1}`, () => `${n + 1}/${n + 2}`, () => `${n - 1}/n`, () => `1/${n + 1}`);
        q = `求和：1/(1×2) + 1/(2×3) + ... + 1/(${n}×(${n}+1)) = ？`;
        exp = `裂项：1/(k(k+1)) = 1/k − 1/(k+1)，相消后得 ${n}/${n + 1}。`;
      } else if (type === 1) {
        // 错位相减
        const a1 = 1, ratio = 2, n = rnd(3, 5);
        const sn = Math.pow(2, n) - 1;
        o = opts(sn, () => sn + 1, () => sn - 1, () => Math.pow(2, n + 1));
        q = `求和：1 + 2 + 4 + ... + 2^${n - 1} = ？`;
        exp = `等比数列求和：S = (2^${n} − 1)/(2 − 1) = ${sn}。`;
      } else if (type === 2) {
        // 分组求和
        const n = rnd(2, 4);
        const an = 2 * n + 1;
        o = opts(an, () => an + 2, () => an - 2, () => 2 * n);
        q = `数列 a_n = 2n + 1，第 ${n} 项 a_${n} = ？`;
        exp = `a_${n} = 2×${n} + 1 = ${an}。`;
      } else {
        // 并项求和
        const n = rnd(2, 5);
        const ans = n * (n + 1) / 2;
        o = opts(ans, () => ans + 1, () => ans - 1, () => n * n);
        q = `求和：1 + 2 − 3 + 4 − 5 + ... + ${2 * n} = ？`;
        exp = `分组：(1+2)+(−3+4)+(−5+6)+... = ${n} 组，每组 1，和为 ${ans}。`;
      }
      results.push(Q(q, o, "进阶", exp, "数列求和技巧"));
    }
    return results;
  }

  /* ============================================================
   * 8. 平面向量（十一年级）
   * ============================================================ */
  function qVector(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 向量加法
        const ax = rnd(1, 5), ay = rnd(1, 5);
        const bx = rnd(1, 5), by = rnd(1, 5);
        const sx = ax + bx, sy = ay + by;
        o = opts(`(${sx},${sy})`, () => `(${sx + 1},${sy})`, () => `(${ax},${by})`, () => `(${bx},${ay})`);
        q = `向量 a=(${ax},${ay}), b=(${bx},${by})，a+b=？`;
        exp = `向量加法：(a₁+b₁, a₂+b₂) = (${ax}+${bx}, ${ay}+${by}) = (${sx},${sy})。`;
      } else if (type === 1) {
        // 向量减法
        const ax = rnd(2, 6), ay = rnd(2, 6);
        const bx = rnd(1, 4), by = rnd(1, 4);
        const dx = ax - bx, dy = ay - by;
        o = opts(`(${dx},${dy})`, () => `(${dx + 1},${dy})`, () => `(${ax + bx},${ay + by})`, () => `(${bx - ax},${by - ay})`);
        q = `向量 a=(${ax},${ay}), b=(${bx},${by})，a−b=？`;
        exp = `向量减法：(a₁−b₁, a₂−b₂) = (${ax}−${bx}, ${ay}−${by}) = (${dx},${dy})。`;
      } else if (type === 2) {
        // 数量积
        const ax = rnd(1, 5), ay = rnd(1, 5);
        const bx = rnd(1, 5), by = rnd(1, 5);
        const dot = ax * bx + ay * by;
        o = opts(dot, () => dot + 1, () => dot - 1, () => ax * bx);
        q = `向量 a=(${ax},${ay}), b=(${bx},${by})，a·b=？`;
        exp = `数量积：a·b = a₁b₁ + a₂b₂ = ${ax}×${bx} + ${ay}×${by} = ${dot}。`;
      } else {
        // 向量共线
        const k = rnd(2, 4);
        const ax = rnd(1, 3), ay = ax * k;
        const bx = rnd(1, 3);
        const by = bx * k;
        o = opts("共线", () => "不共线", () => "垂直", () => "无法判断");
        q = `向量 a=(${ax},${ay}), b=(${bx},${by})，它们的关系是？`;
        exp = `a = ${k} × b，两向量共线。`;
      }
      results.push(Q(q, o, "基础", exp, "平面向量"));
    }
    return results;
  }

  /* ============================================================
   * 9. 立体几何（十一年级）
   * ============================================================ */
  function qSolid(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 正方体性质
        o = opts("4个", () => "6个", () => "8个", () => "12个");
        q = `正方体有 ${rnd(1, 8)} 个顶点，从每个顶点出发的棱有？`;
        exp = `正方体每个顶点连接 3 条棱，但这里问的是从一个顶点出发的棱数 = 3。`;
      } else if (type === 1) {
        // 三视图
        o = opts("正视图、侧视图、俯视图", () => "正视图、俯视图、剖视图", () => "正视图、侧视图、剖视图", () => "主视图、左视图、右视图");
        q = `三视图包括？`;
        exp = `三视图：正视图（主视图）、侧视图（左视图）、俯视图。`;
      } else if (type === 2) {
        // 线面平行
        o = opts("线在面外且与面内一直线平行", () => "线与面内所有直线平行", () => "线与面内一直线垂直", () => "线在面内");
        q = `直线与平面平行的判定条件是？`;
        exp = `线面平行判定：若平面外一直线与平面内一直线平行，则线面平行。`;
      } else {
        // 面面垂直
        o = opts("一平面过另一平面的垂线", () => "两平面交线垂直", () => "两平面平行", () => "两平面相交");
        q = `两平面垂直的判定条件是？`;
        exp = `面面垂直判定：若一平面过另一平面的垂线，则两平面垂直。`;
      }
      results.push(Q(q, o, "基础", exp, "立体几何"));
    }
    return results;
  }

  /* ============================================================
   * 10. 空间向量建系（十一年级）
   * ============================================================ */
  function qSolidAxis(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 坐标计算
        const x = rnd(1, 5), y = rnd(1, 5), z = rnd(1, 5);
        o = opts(`(${x},${y},${z})`, () => `(${x},${z},${y})`, () => `(${y},${x},${z})`, () => `(-${x},-${y},-${z})`);
        q = `空间点 P 的坐标为 (${x}, ${y}, ${z})，其坐标表示是？`;
        exp = `空间直角坐标系中，点 P 的坐标为 (x, y, z)。`;
      } else if (type === 1) {
        // 向量坐标
        const ax = rnd(1, 5), ay = rnd(1, 5), az = rnd(1, 5);
        const bx = rnd(1, 5), by = rnd(1, 5), bz = rnd(1, 5);
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        o = opts(`(${dx},${dy},${dz})`, () => `(${dx + 1},${dy},${dz})`, () => `(${ax + bx},${ay + by},${az + bz})`, () => `(${bx - ax},${by - ay},${bz - az})`);
        q = `向量 a=(${ax},${ay},${az}), b=(${bx},${by},${bz})，a−b=？`;
        exp = `向量减法：(a₁−b₁, a₂−b₂, a₃−b₃) = (${dx},${dy},${dz})。`;
      } else {
        // 法向量
        o = opts("(0,0,1)", () => "(1,0,0)", () => "(0,1,0)", () => "(1,1,1)");
        q = `平面 xOy 的法向量是？`;
        exp = `xOy 平面的法向量垂直于该平面，可取 (0, 0, 1)。`;
      }
      results.push(Q(q, o, "基础", exp, "空间向量建系"));
    }
    return results;
  }

  /* ============================================================
   * 11. 空间角与距离（十一年级）
   * ============================================================ */
  function qSolidAngle(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 异面直线夹角
        o = opts("锐角或直角", () => "钝角", () => "平角", () => "无法确定");
        q = `异面直线所成角的范围是？`;
        exp = `异面直线所成角范围：(0°, 90°]，即锐角或直角。`;
      } else if (type === 1) {
        // 线面角
        o = opts("线与面内投影的夹角", () => "线与面内任意直线的夹角", () => "两平面的夹角", () => "线与法向量的夹角");
        q = `直线与平面所成角是指？`;
        exp = `线面角是直线与其在平面内投影的夹角，范围 [0°, 90°]。`;
      } else {
        // 二面角
        o = opts("两平面交线的垂面与两平面的交线所成的角", () => "两平面内任意两条直线的夹角", () => "两平面法向量的夹角", () => "两平面内平行线的夹角");
        q = `二面角的平面角是指？`;
        exp = `二面角的平面角是由交线上一点，在两平面内分别作交线的垂线所成的角。`;
      }
      results.push(Q(q, o, "基础", exp, "空间角与距离"));
    }
    return results;
  }

  /* ============================================================
   * 12. 导数与单调性（十二年级）
   * ============================================================ */
  function qDerivative(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 基本导数
        const n_val = rnd(2, 5);
        const ansCoeff = n_val;
        o = opts(`${n_val}x^${n_val - 1}`, () => `x^${n_val}`, () => `${n_val}x^${n_val}`, () => `x^${n_val - 1}`);
        q = `f(x) = x^${n_val} 的导数 f'(x) = ？`;
        exp = `幂函数求导：(x^n)' = n·x^(n−1)，故 f'(x) = ${n_val}x^${n_val - 1}。`;
      } else if (type === 1) {
        // 导数应用（单调性）
        o = opts("f'(x) > 0", () => "f'(x) < 0", () => "f(x) > 0", () => "f(x) < 0");
        q = `函数 f(x) 在区间 I 上单调递增的充要条件是？`;
        exp = `f(x) 在 I 上单调递增 ⇔ f'(x) ≥ 0（在 I 上恒成立）。`;
      } else if (type === 2) {
        // 极值点
        const a = rnd(1, 3);
        o = opts(`f'(x) = 0 且 f''(x) ≠ 0`, () => "f(x) = 0", () => "f'(x) = 0", () => "f''(x) = 0");
        q = `函数 f(x) 在 x₀ 处取得极值的必要条件是？`;
        exp = `极值点必要条件是 f'(x₀) = 0（驻点），但不是充分条件。`;
      } else {
        // 切线方程
        const x0 = rnd(1, 3);
        const slope = rnd(1, 5);
        const y0 = slope * x0;
        o = opts(`y − ${y0} = ${slope}(x − ${x0})`, () => `y − ${x0} = ${slope}(x − ${y0})`, () => `y = ${slope}x + ${x0}`, () => `y = ${slope}x + ${y0}`);
        q = `曲线 y = ${slope}x 在点 (${x0}, ${y0}) 处的切线方程是？`;
        exp = `切线斜率 k = ${slope}，切线方程：y − ${y0} = ${slope}(x − ${x0})。`;
      }
      results.push(Q(q, o, type < 2 ? "基础" : "进阶", exp, "导数与单调性"));
    }
    return results;
  }

  /* ============================================================
   * 13. 导数与单调性极值（十二年级）
   * ============================================================ */
  function qDerivMon(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 求导数
        const a = rnd(2, 5), n_val = rnd(2, 4);
        const coeff = a * n_val;
        o = opts(`${coeff}x^${n_val - 1}`, () => `${a}x^${n_val}`, () => `${coeff}x^${n_val}`, () => `${a * n_val}x^${n_val + 1}`);
        q = `f(x) = ${a}x^${n_val} 的导数 f'(x) = ？`;
        exp = `f'(x) = ${a}·${n_val}·x^${n_val - 1} = ${coeff}x^${n_val - 1}。`;
      } else if (type === 1) {
        // 单调区间
        o = opts("(-∞, 0) 递减，(0, +∞) 递增", () => "(-∞, 0) 递增，(0, +∞) 递减", () => "R 上递增", () => "R 上递减");
        q = `函数 f(x) = x² 的单调区间是？`;
        exp = `f'(x) = 2x，当 x < 0 时 f'(x) < 0（递减），当 x > 0 时 f'(x) > 0（递增）。`;
      } else {
        // 极值
        const a = rnd(1, 3);
        o = opts(`x = 0 处取极小值`, () => `x = 0 处取极大值`, () => `x = ${a} 处取极值`, () => "无极值");
        q = `函数 f(x) = ${a}x² 在 x = 0 处的极值是？`;
        exp = `f'(x) = 2${a}x，x = 0 时 f'(x) = 0，f''(0) = 2${a} > 0，取极小值。`;
      }
      results.push(Q(q, o, type < 2 ? "基础" : "进阶", exp, "导数与单调性极值"));
    }
    return results;
  }

  /* ============================================================
   * 14. 导数与不等式恒成立（十二年级）
   * ============================================================ */
  function qDerivIneq(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 恒成立条件
        o = opts("f(x) ≥ 0 在 R 上恒成立", () => "f(x) > 0 在 R 上恒成立", () => "f(x) ≤ 0 在 R 上恒成立", () => "f(x) < 0 在 R 上恒成立");
        q = `不等式 f(x) ≥ 0 在定义域内恒成立的含义是？`;
        exp = `恒成立指对于定义域内所有 x，都有 f(x) ≥ 0。`;
      } else if (type === 1) {
        // 最值应用
        const a = rnd(1, 3);
        const ansMin = -a;
        o = opts(`f(x) ≥ ${ansMin}`, () => `f(x) ≥ ${ansMin + 1}`, () => `f(x) ≤ ${ansMin}`, () => `f(x) > ${ansMin}`);
        q = `函数 f(x) = x² − ${a} 的最小值是？`;
        exp = `f(x) = x² − ${a} ≥ −${a}，最小值为 ${ansMin}。`;
      } else {
        // 参数范围
        o = opts("a > 0", () => "a < 0", () => "a ≥ 0", () => "a ≤ 0");
        q = `函数 f(x) = ax² + x 在 R 上单调递增，a 的取值范围是？`;
        exp = `f'(x) = 2ax + 1 ≥ 0 恒成立，需 a ≥ 0 且 1 ≥ 0，故 a ≥ 0。`;
      }
      results.push(Q(q, o, "进阶", exp, "导数与不等式恒成立"));
    }
    return results;
  }

  /* ============================================================
   * 15. 函数零点与极值点偏移（十二年级）
   * ============================================================ */
  function qFuncZero(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 零点定义
        o = opts("f(x) = 0 的根", () => "f'(x) = 0 的根", () => "f''(x) = 0 的根", () => "f(x) 的极值点");
        q = `函数 f(x) 的零点是指？`;
        exp = `零点即方程 f(x) = 0 的实数根，或函数图像与 x 轴的交点。`;
      } else if (type === 1) {
        // 零点存在定理
        o = opts("f(a)·f(b) < 0", () => "f(a)·f(b) > 0", () => "f(a) = f(b)", () => "f'(a) = f'(b)");
        q = `函数在 [a,b] 上有零点的充分条件是？`;
        exp = `零点存在定理：若 f(a)·f(b) < 0，则在 (a,b) 内至少有一个零点。`;
      } else {
        // 极值点偏移
        o = opts("f'(x₀) = 0 且 f''(x₀) ≠ 0", () => "f(x₀) = 0", () => "f'(x₀) ≠ 0", () => "f''(x₀) = 0");
        q = `函数 f(x) 在 x₀ 处取得极值的充分条件是？`;
        exp = `极值点充分条件：f'(x₀) = 0 且 f''(x₀) ≠ 0。`;
      }
      results.push(Q(q, o, "基础", exp, "函数零点与极值点偏移"));
    }
    return results;
  }

  /* ============================================================
   * 16. 圆锥曲线初步（十二年级）
   * ============================================================ */
  function qConic(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 椭圆定义
        o = opts("到两定点距离之和为常数", () => "到两定点距离之差为常数", () => "到定点与定直线距离相等", () => "到两定点距离之比为常数");
        q = `椭圆的定义是？`;
        exp = `椭圆：平面内到两定点（焦点）距离之和为常数（大于两焦点距离）的点的轨迹。`;
      } else if (type === 1) {
        // 双曲线定义
        o = opts("到两定点距离之差的绝对值为常数", () => "到两定点距离之和为常数", () => "到定点与定直线距离相等", () => "到两定点距离之比为常数");
        q = `双曲线的定义是？`;
        exp = `双曲线：平面内到两定点（焦点）距离之差的绝对值为常数（小于两焦点距离）的点的轨迹。`;
      } else if (type === 2) {
        // 抛物线定义
        o = opts("到定点与定直线距离相等", () => "到两定点距离之和为常数", () => "到两定点距离之差为常数", () => "到两定点距离之比为常数");
        q = `抛物线的定义是？`;
        exp = `抛物线：平面内到定点（焦点）与定直线（准线）距离相等的点的轨迹。`;
      } else {
        // 离心率
        o = opts("e < 1", () => "e = 1", () => "e > 1", () => "e = 0");
        q = `椭圆的离心率 e 的范围是？`;
        exp = `椭圆离心率 0 < e < 1，e 越接近 0 越圆，越接近 1 越扁。`;
      }
      results.push(Q(q, o, "基础", exp, "圆锥曲线初步"));
    }
    return results;
  }

  /* ============================================================
   * 17. 联立与韦达定理（十二年级）
   * ============================================================ */
  function qConicLink(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 韦达定理
        const sum = rnd(1, 10);
        const prod = rnd(1, 10);
        o = opts(`x₁+x₂=${-sum}, x₁x₂=${prod}`, () => `x₁+x₂=${sum}, x₁x₂=${prod}`, () => `x₁+x₂=${-sum}, x₁x₂=${-prod}`, () => `x₁+x₂=${sum}, x₁x₂=${-prod}`);
        q = `方程 x² + ${sum}x + ${prod} = 0 的两根 x₁, x₂，由韦达定理得？`;
        exp = `韦达定理：x₁+x₂ = −b/a = −${sum}，x₁x₂ = c/a = ${prod}。`;
      } else if (type === 1) {
        // 判别式
        const a = 1, b = rnd(2, 6), c = rnd(1, 5);
        const delta = b * b - 4 * a * c;
        o = opts(delta > 0 ? "有两个不等实根" : delta === 0 ? "有两个相等实根" : "无实根", () => "无法判断", () => "只有一个实根", () => "有复数根");
        q = `方程 x² + ${b}x + ${c} = 0 的判别式 Δ = ${delta}，根的情况是？`;
        exp = `Δ = ${b}² − 4×1×${c} = ${delta}，Δ ${delta > 0 ? ">" : delta === 0 ? "=" : "<"} 0，故${delta > 0 ? "有两个不等实根" : delta === 0 ? "有两个相等实根" : "无实根"}。`;
      } else {
        // 弦长公式
        o = opts("√(1+k²)·|x₁−x₂|", () => "√(1+k²)·(x₁+x₂)", () => "|x₁−x₂|", () => "√(1+k²)·√((x₁+x₂)²−4x₁x₂)");
        q = `直线 y = kx + b 与曲线相交，弦长公式是？`;
        exp = `弦长 = √(1+k²)·|x₁−x₂| = √(1+k²)·√Δ/|a|。`;
      }
      results.push(Q(q, o, "进阶", exp, "联立与韦达定理"));
    }
    return results;
  }

  /* ============================================================
   * 18. 弦长·中点·定点定值（十二年级）
   * ============================================================ */
  function qConicChord(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 中点坐标
        const x1 = rnd(1, 5), x2 = rnd(1, 5);
        const mid = (x1 + x2) / 2;
        o = opts(mid, () => mid + 1, () => mid - 1, () => x1 + x2);
        q = `线段两端点横坐标为 ${x1} 和 ${x2}，中点横坐标是？`;
        exp = `中点横坐标 = (${x1} + ${x2}) / 2 = ${mid}。`;
      } else if (type === 1) {
        // 弦长
        const a = 1, b = rnd(2, 6), c = rnd(1, 5);
        const delta = b * b - 4 * a * c;
        const dist = Math.sqrt(delta) / a;
        o = opts(dist, () => delta, () => Math.sqrt(delta), () => delta / 2);
        q = `方程 x² + ${b}x + ${c} = 0 的两根距离 |x₁−x₂| = ？`;
        exp = `|x₁−x₂| = √Δ/|a| = √${delta} / 1 = ${dist}。`;
      } else {
        // 定点问题
        o = opts("直线过定点 (0, b)", () => "直线过定点 (b, 0)", () => "直线过原点", () => "直线不过定点");
        q = `直线 y = kx + b (k 为参数) 恒过定点？`;
        exp = `当 x = 0 时 y = b，故直线恒过定点 (0, b)。`;
      }
      results.push(Q(q, o, "进阶", exp, "弦长·中点·定点定值"));
    }
    return results;
  }

  /* ============================================================
   * 19. 圆锥曲线性质（十二年级）
   * ============================================================ */
  function qConicProp(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 椭圆性质
        const a = rnd(3, 8);
        const b = rnd(2, a - 1);
        const c = Math.sqrt(a * a - b * b);
        const e = c / a;
        o = opts(e.toFixed(2), () => (e + 0.1).toFixed(2), () => (e - 0.1).toFixed(2), () => "1.00");
        q = `椭圆 x²/${a*a} + y²/${b*b} = 1 的离心率 e ≈ ？`;
        exp = `c = √(a²−b²) = √(${a*a}−${b*b}) = ${c.toFixed(1)}，e = c/a = ${c.toFixed(1)}/${a} ≈ ${e.toFixed(2)}。`;
      } else if (type === 1) {
        // 双曲线性质
        const a = rnd(2, 5);
        const b = rnd(2, 5);
        const c = Math.sqrt(a * a + b * b);
        const e = c / a;
        o = opts(e.toFixed(2), () => (e + 0.1).toFixed(2), () => (e - 0.1).toFixed(2), () => "1.00");
        q = `双曲线 x²/${a*a} − y²/${b*b} = 1 的离心率 e ≈ ？`;
        exp = `c = √(a²+b²) = √(${a*a}+${b*b}) = ${c.toFixed(1)}，e = c/a = ${c.toFixed(1)}/${a} ≈ ${e.toFixed(2)}。`;
      } else if (type === 2) {
        // 抛物线性质
        o = opts("焦点到准线的距离 p", () => "2p", () => "p/2", () => "p²");
        q = `抛物线 y² = 2px 的焦点到准线的距离是？`;
        exp = `抛物线 y² = 2px 的焦点 (p/2, 0)，准线 x = −p/2，距离 = p。`;
      } else {
        // 切线方程
        o = opts("xx₀ + yy₀ = r²", () => "xx₀ − yy₀ = r²", () => "x + y = r", () => "xy = r²");
        q = `圆 x² + y² = r² 在点 (x₀, y₀) 处的切线方程是？`;
        exp = `圆的切线方程：xx₀ + yy₀ = r²。`;
      }
      results.push(Q(q, o, type < 2 ? "进阶" : "基础", exp, "圆锥曲线性质"));
    }
    return results;
  }

  /* ============================================================
   * 20. 参数方程与极坐标（十二年级）
   * ============================================================ */
  function qParamEq(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 3;
      let q, ans, o, exp;
      if (type === 0) {
        // 参数方程化普通方程
        o = opts("x² + y² = r²", () => "x² − y² = r²", () => "y = kx + b", () => "x = r");
        q = `参数方程 x = rcosθ, y = rsinθ 消参后是？`;
        exp = `x² + y² = r²cos²θ + r²sin²θ = r²(cos²θ + sin²θ) = r²。`;
      } else if (type === 1) {
        // 极坐标化直角坐标
        const r = rnd(2, 5);
        o = opts(`${r}cosθ`, () => `${r}sinθ`, () => `${r}/cosθ`, () => `${r}/sinθ`);
        q = `极坐标 ρ = ${r} 化为直角坐标方程是？`;
        exp = `ρ = ${r} → x² + y² = ${r}²，即圆。`;
      } else {
        // 参数方程应用
        o = opts("t", () => "θ", () => "ρ", () => "φ");
        q = `参数方程 x = t², y = 2t 中的参数通常是？`;
        exp = `参数方程中的变量 t（或 θ）称为参数。`;
      }
      results.push(Q(q, o, "基础", exp, "参数方程与极坐标"));
    }
    return results;
  }

  /* ============================================================
   * 21. 复数运算（十年级）
   * ============================================================ */
  function qComplex(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 复数加法
        const a = rnd(1, 5), b = rnd(1, 5);
        const c = rnd(1, 5), d = rnd(1, 5);
        const real = a + c, imag = b + d;
        o = opts(`${real}+${imag}i`, () => `${real + 1}+${imag}i`, () => `${real}+${imag + 1}i`, () => `${a + c}+${b - d}i`);
        q = `( ${a}+${b}i ) + ( ${c}+${d}i ) = ？`;
        exp = `复数加法：实部加实部，虚部加虚部 = (${real}) + (${imag})i。`;
      } else if (type === 1) {
        // 复数乘法
        const a = rnd(1, 3), b = rnd(1, 3);
        const c = rnd(1, 3), d = rnd(1, 3);
        const real = a * c - b * d;
        const imag = a * d + b * c;
        o = opts(`${real}+${imag}i`, () => `${real + 1}+${imag}i`, () => `${real}+${imag + 1}i`, () => `${a * c}+${b * d}i`);
        q = `( ${a}+${b}i ) · ( ${c}+${d}i ) = ？`;
        exp = `复数乘法：(a+bi)(c+di) = (ac−bd) + (ad+bc)i = ${real} + ${imag}i。`;
      } else if (type === 2) {
        // 共轭复数
        const a = rnd(1, 5), b = rnd(1, 5);
        o = opts(`${a}-${b}i`, () => `${a}+${b}i`, () => `-${a}+${b}i`, () => `-${a}-${b}i`);
        q = `复数 z = ${a}+${b}i 的共轭复数是？`;
        exp = `共轭复数实部不变，虚部变号：z̄ = ${a} − ${b}i。`;
      } else {
        // 模长
        const a = rnd(3, 5), b = rnd(3, 5);
        const mod = Math.sqrt(a * a + b * b);
        o = opts(mod.toFixed(1), () => (mod + 1).toFixed(1), () => (mod - 1).toFixed(1), () => (a + b).toFixed(1));
        q = `复数 z = ${a}+${b}i 的模 |z| = ？`;
        exp = `|z| = √(a²+b²) = √(${a*a}+${b*b}) = ${mod.toFixed(1)}。`;
      }
      results.push(Q(q, o, "基础", exp, "复数运算"));
    }
    return results;
  }

  /* ============================================================
   * 22. 分布列与期望方差（十二年级）
   * ============================================================ */
  function qDistExp(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 期望计算
        const E = rnd(2, 10);
        o = opts(E, () => E + 1, () => E - 1, () => E * 2);
        q = `随机变量 X 的期望 E(X) = ${E}，则 E(2X) = ？`;
        exp = `E(2X) = 2E(X) = 2 × ${E} = ${E * 2}。`;
      } else if (type === 1) {
        // 方差计算
        const D = rnd(1, 5);
        o = opts(D, () => D * 2, () => D / 2, () => D + 1);
        q = `随机变量 X 的方差 D(X) = ${D}，则 D(2X) = ？`;
        exp = `D(2X) = 4D(X) = 4 × ${D} = ${D * 4}。`;
      } else if (type === 2) {
        // 分布列性质
        o = opts("所有概率之和为 1", () => "所有概率之和为 0", () => "概率可以为负", () => "概率可以大于 1");
        q = `离散型随机变量分布列的基本性质是？`;
        exp = `分布列性质：所有概率 P(X=xᵢ) ≥ 0，且 ΣP(X=xᵢ) = 1。`;
      } else {
        // 期望性质
        o = opts("E(aX+b) = aE(X)+b", () => "E(aX+b) = aE(X)", () => "E(aX+b) = aE(X)+b²", () => "E(aX+b) = E(X)+b");
        q = `期望的线性性质是？`;
        exp = `E(aX + b) = aE(X) + b。`;
      }
      results.push(Q(q, o, "基础", exp, "分布列与期望方差"));
    }
    return results;
  }

  /* ============================================================
   * 23. 二项分布与正态分布（十二年级）
   * ============================================================ */
  function qDistBinom(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 二项分布期望
        const n_trials = rnd(2, 10);
        const p = 0.5;
        const E = n_trials * p;
        o = opts(E, () => E + 1, () => E - 1, () => p);
        q = `X ~ B(${n_trials}, 0.5)，E(X) = ？`;
        exp = `二项分布期望 E(X) = np = ${n_trials} × 0.5 = ${E}。`;
      } else if (type === 1) {
        // 二项分布方差
        const n_trials = rnd(2, 10);
        const p = 0.5;
        const D = n_trials * p * (1 - p);
        o = opts(D, () => D + 1, () => D - 1, () => p);
        q = `X ~ B(${n_trials}, 0.5)，D(X) = ？`;
        exp = `二项分布方差 D(X) = np(1−p) = ${n_trials} × 0.5 × 0.5 = ${D}。`;
      } else if (type === 2) {
        // 正态分布性质
        o = opts("关于 μ 对称", () => "关于 σ 对称", () => "关于 0 对称", () => "无对称性");
        q = `正态分布 N(μ, σ²) 的图像关于？对称`;
        exp = `正态分布曲线关于 μ 对称，μ 是均值（中心位置）。`;
      } else {
        // 标准正态分布
        o = opts("μ=0, σ=1", () => "μ=0, σ=0", () => "μ=1, σ=0", () => "μ=1, σ=1");
        q = `标准正态分布 N(0,1) 的参数是？`;
        exp = `标准正态分布：均值 μ = 0，标准差 σ = 1。`;
      }
      results.push(Q(q, o, "基础", exp, "二项分布与正态分布"));
    }
    return results;
  }

  /* ============================================================
   * 24. 统计案例（十二年级）
   * ============================================================ */
  function qStatCase(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, ans, o, exp;
      if (type === 0) {
        // 平均数
        const vals = [rnd(60, 100), rnd(60, 100), rnd(60, 100), rnd(60, 100)];
        const avg = Math.round(vals.reduce((a, b) => a + b, 0) / 4);
        o = opts(avg, () => avg + 5, () => avg - 5, () => vals[0]);
        q = `数据 ${vals[0]}, ${vals[1]}, ${vals[2]}, ${vals[3]} 的平均数是？`;
        exp = `平均数 = (${vals[0]}+${vals[1]}+${vals[2]}+${vals[3]})/4 = ${avg}。`;
      } else if (type === 1) {
        // 中位数
        const vals = [rnd(10, 50), rnd(51, 90), rnd(91, 130), rnd(131, 170), rnd(171, 200)];
        vals.sort((a, b) => a - b);
        const med = vals[2];
        o = opts(med, () => vals[1], () => vals[3], () => vals[0]);
        q = `数据 ${vals.join(', ')} 的中位数是？`;
        exp = `排序后中间值为 ${med}。`;
      } else if (type === 2) {
        // 方差
        const mean = rnd(50, 100);
        const vals = [mean - rnd(5, 20), mean, mean + rnd(5, 20), mean];
        const variance = Math.round(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / 4);
        o = opts(variance, () => variance + 10, () => variance - 10, () => mean);
        q = `数据 ${vals.join(', ')}（均值 ${mean}）的方差是？`;
        exp = `方差 = [(v₁−μ)²+...+(v₄−μ)²]/4 = ${variance}。`;
      } else {
        // 频率分布
        o = opts("各组频率之和为 1", () => "各组频率之和为 0", () => "各组频数之和为 1", () => "频率可以大于 1");
        q = `频率分布直方图的基本性质是？`;
        exp = `频率分布性质：各组频率之和 = 1，各组频数之和 = 样本容量。`;
      }
      results.push(Q(q, o, "基础", exp, "统计案例"));
    }
    return results;
  }

  /* ============================================================
   * 拓展专题（高中/大学先修）：欧拉公式、泰勒级数、数形结合、
   *       数学归纳法、均值不等式、二项式定理、容斥原理、递推数列
   * ============================================================ */
  function qEuler(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, o, exp;
      if (type === 0) {
        o = opts("cosθ + i·sinθ", () => "cosθ − i·sinθ", () => "sinθ + i·cosθ", () => "e^θ");
        q = "欧拉公式：e^(iθ) 等于？";
        exp = "欧拉公式 e^(iθ) = cosθ + i·sinθ，把复数与三角联系起来。";
      } else if (type === 1) {
        o = opts("−1", () => "1", () => "i", () => "0");
        q = "欧拉恒等式中 e^(iπ) 的值是？";
        exp = "e^(iπ) = cosπ + i·sinπ = −1 + 0 = −1，故 e^(iπ) + 1 = 0。";
      } else if (type === 2) {
        o = opts("i", () => "−i", () => "1", () => "−1");
        q = "e^(i·π/2) 的值是？";
        exp = "e^(iπ/2) = cos(π/2) + i·sin(π/2) = 0 + i·1 = i。";
      } else {
        o = opts("1", () => "|cosθ|", () => "θ", () => "e^θ");
        q = "复数 e^(iθ) 的模长 |e^(iθ)| 是？";
        exp = "|cosθ + i·sinθ| = √(cos²θ + sin²θ) = 1，始终在单位圆上。";
      }
      results.push(Q(q, o, "基础", exp, "欧拉公式", "euler_circle"));
    }
    return results;
  }

  function qTaylor(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 5;
      let q, o, exp;
      if (type === 0) {
        o = opts("1/24", () => "1/6", () => "1/12", () => "1/2");
        q = "e^x 的麦克劳林展开中 x⁴ 项的系数是？";
        exp = "e^x = Σ xⁿ/n!，x⁴ 系数 = 1/4! = 1/24。";
      } else if (type === 1) {
        o = opts("0", () => "1", () => "−1", () => "1/2");
        q = "sin x 的麦克劳林展开中 x² 项的系数是？";
        exp = "sin x = x − x³/3! + x⁵/5! − …，只含奇次幂，x² 系数为 0。";
      } else if (type === 2) {
        o = opts("−1/2", () => "1/2", () => "−1", () => "1");
        q = "cos x 的麦克劳林展开中 x² 项的系数是？";
        exp = "cos x = 1 − x²/2! + x⁴/4! − …，x² 系数 = −1/2。";
      } else if (type === 3) {
        o = opts("1", () => "−1", () => "1/2", () => "0");
        q = "ln(1+x) 的麦克劳林展开中 x 项的系数是？";
        exp = "ln(1+x) = x − x²/2 + x³/3 − …，x 项系数为 1。";
      } else {
        o = opts("1", () => "3", () => "1/3", () => "−1");
        q = "把 1/(1−x) 展开成幂级数，x³ 项的系数是？";
        exp = "等比级数 1/(1−x) = 1 + x + x² + x³ + …，x³ 系数 = 1。";
      }
      results.push(Q(q, o, "进阶", exp, "泰勒级数", "taylor_graph"));
    }
    return results;
  }

  function qNumShape(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 5;
      let q, o, exp;
      if (type === 0) {
        o = opts("点 3", () => "原点", () => "点 0", () => "点 x");
        q = "|x − 3| 的几何意义是数轴上点 x 到哪里的距离？";
        exp = "|x − a| 表示点 x 到点 a 的距离，故 |x−3| 是到 3 的距离。";
      } else if (type === 1) {
        o = opts("x < −1 或 x > 1", () => "−1 < x < 1", () => "x > 1", () => "x < −1");
        q = "用数形结合解不等式 x² − 1 > 0，解集是？";
        exp = "抛物线 y = x² − 1 在 x 轴上方时 x² > 1，即 x < −1 或 x > 1。";
      } else if (type === 2) {
        o = opts("−1 和 3", () => "1 和 3", () => "−1 和 −3", () => "1 和 −3");
        q = "函数 f(x) = x² − 2x − 3 的零点（与 x 轴交点横坐标）是？";
        exp = "x² − 2x − 3 = 0 → (x−3)(x+1) = 0 → x = 3 或 x = −1。";
      } else if (type === 3) {
        o = opts("第二象限", () => "第一象限", () => "第三象限", () => "第四象限");
        q = "点 (−2, 3) 在平面直角坐标系位于？";
        exp = "x < 0、y > 0，属于第二象限。";
      } else {
        o = opts("0", () => "1", () => "−1", () => "不存在");
        q = "用数形结合看函数 y = |x| 的最小值是？";
        exp = "V 形图像顶点在原点 (0,0)，最小值为 0。";
      }
      results.push(Q(q, o, "基础", exp, "数形结合", "numshape_coord"));
    }
    return results;
  }

  function qInduction(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, o, exp;
      if (type === 0) {
        o = opts("验证 n 取初值（如 n=1）时命题成立", () => "令 n→∞", () => "证明 n=k+1", () => "直接写结论");
        q = "用数学归纳法证明命题，第一步（奠基）要做的是？";
        exp = "第一步验证起始值（如 n=1）时命题成立。";
      } else if (type === 1) {
        o = opts("由 n=k 成立推出 n=k+1 成立", () => "由 n=1 推出 n=2", () => "证明 n=k 成立", () => "令 n→∞");
        q = "归纳法的第二步（递推）要证明的是？";
        exp = "假设 n=k 成立，推出 n=k+1 也成立，形成递推链条。";
      } else if (type === 2) {
        o = opts("5050", () => "5000", () => "10100", () => "100");
        q = "由归纳法可得 1 + 2 + … + 100 = ？";
        exp = "公式 n(n+1)/2，100×101/2 = 5050。";
      } else {
        o = opts("7", () => "8", () => "6", () => "15");
        q = "2⁰ + 2¹ + 2² = ？";
        exp = "1 + 2 + 4 = 7 = 2³ − 1，符合等比求和公式。";
      }
      results.push(Q(q, o, "基础", exp, "数学归纳法", "induction_steps"));
    }
    return results;
  }

  function qAmGm(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, o, exp;
      if (type === 0) {
        o = opts("a + b ≥ 2√(ab)", () => "a + b ≤ 2√(ab)", () => "a + b = 2√(ab)", () => "无确定关系");
        q = "对正数 a、b，基本均值不等式是？";
        exp = "a + b ≥ 2√(ab)，当且仅当 a = b 取等号。";
      } else if (type === 1) {
        o = opts("4", () => "2", () => "8", () => "√4");
        q = "x > 0 时，x + 4/x 的最小值（用均值不等式）是？";
        exp = "x + 4/x ≥ 2√(x·4/x) = 2√4 = 4，当 x = 2 时取等。";
      } else if (type === 2) {
        o = opts("a = b = c", () => "a + b + c = 0", () => "任意正数", () => "a = 0");
        q = "a + b + c ≥ 3·³√(abc) 等号成立的条件是？";
        exp = "三元均值不等式等号当且仅当 a = b = c 时成立。";
      } else {
        o = opts("2", () => "1", () => "0", () => "√2");
        q = "x > 0 时，x + 1/x 的最小值是？";
        exp = "x + 1/x ≥ 2√(x·1/x) = 2，当 x = 1 时取等。";
      }
      results.push(Q(q, o, "进阶", exp, "均值不等式", "amgm_rect"));
    }
    return results;
  }

  function qBinomial(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 5;
      let q, o, exp;
      if (type === 0) {
        o = opts("n + 1", () => "n", () => "2n", () => "n − 1");
        q = "(a + b)^n 展开后共有多少项？";
        exp = "从 aⁿ, a^{n−1}b, … 到 bⁿ 共 n + 1 项。";
      } else if (type === 1) {
        o = opts("3", () => "1", () => "6", () => "2");
        q = "(a + b)³ 展开中 a²b 项的系数是？";
        exp = "组合数为 C(3,1) = 3，故系数为 3。";
      } else if (type === 2) {
        o = opts("6", () => "4", () => "1", () => "24");
        q = "(1 + x)^4 展开式中 x² 项的系数是？";
        exp = "C(4,2) = 6，x² 系数为 6。";
      } else if (type === 3) {
        o = opts("1", () => "5", () => "x⁵", () => "0");
        q = "(x + 1)^5 展开式的常数项是？";
        exp = "取 x⁰ 项：C(5,5)·x⁰·1⁵ = 1，常数项为 1。";
      } else {
        o = opts("2ⁿ", () => "n", () => "n + 1", () => "2n");
        q = "(a + b)^n 各项二项式系数之和是？";
        exp = "令 a = b = 1，得系数和 = (1+1)^n = 2ⁿ。";
      }
      results.push(Q(q, o, "进阶", exp, "二项式定理", "binomial_triangle"));
    }
    return results;
  }

  function qInclusion(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, o, exp;
      if (type === 0) {
        o = opts("30", () => "35", () => "25", () => "5");
        q = "班中 20 人会英语、15 人会日语，两种都会的 5 人，至少会一种的有几人？";
        exp = "20 + 15 − 5 = 30（人）。容斥：会一种 + 会一种 − 都会。";
      } else if (type === 1) {
        o = opts("|A| + |B| − |A∩B|", () => "|A| + |B|", () => "|A|·|B|", () => "|A∩B|");
        q = "两集合容斥原理：|A∪B| = ？";
        exp = "|A∪B| = |A| + |B| − |A∩B|，减去重复计数的交集。";
      } else if (type === 2) {
        o = opts("+ |A∩B∩C|", () => "0", () => "− |A∩B∩C|", () => "|A|·|B|·|C|");
        q = "三集合 |A∪B∪C| = |A|+|B|+|C| − (两两交之和) + ？";
        exp = "加回被多减一次的三者交集 |A∩B∩C|。";
      } else {
        o = opts("67", () => "50", () => "33", () => "83");
        q = "1 到 100 中能被 2 或 3 整除的数共有几个？";
        exp = "被2整除50个、被3整除33个、被6整除16个 → 50+33−16 = 67。";
      }
      results.push(Q(q, o, "进阶", exp, "容斥原理", "inclusion_venn"));
    }
    return results;
  }

  function qRecurrence(n) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const type = i % 4;
      let q, o, exp;
      if (type === 0) {
        o = opts("16", () => "8", () => "32", () => "2");
        q = "数列 a₁ = 1，a_{n+1} = 2a_n，则 a₅ = ？";
        exp = "等比型：a_n = 2^{n−1}，a₅ = 2⁴ = 16。";
      } else if (type === 1) {
        o = opts("17", () => "15", () => "20", () => "18");
        q = "数列 a₁ = 2，a_{n+1} = a_n + 3，则 a₆ = ？";
        exp = "等差型：a_n = 2 + 3(n−1)，a₆ = 2 + 15 = 17。";
      } else if (type === 2) {
        o = opts("15", () => "7", () => "16", () => "31");
        q = "数列 a₁ = 1，a_{n+1} = 2a_n + 1，则 a₄ = ？";
        exp = "逐项算：1 → 3 → 7 → 15，故 a₄ = 15。";
      } else {
        o = opts("3^{n−1}", () => "3ⁿ", () => "n³", () => "3n");
        q = "数列 1, 3, 9, 27, … 的通项 a_n = ？";
        exp = "首项1、公比3的等比数列，a_n = 3^{n−1}。";
      }
      results.push(Q(q, o, "进阶", exp, "递推数列", "recurrence_tree"));
    }
    return results;
  }

  /* ============================================================
   * 注册到 window.TECHNIQUES
   * ============================================================ */
  const GEN = {
    euler: qEuler,
    taylor: qTaylor,
    numshape: qNumShape,
    induction: qInduction,
    amgm: qAmGm,
    binomial: qBinomial,
    inclusion_hs: qInclusion,
    recurrence: qRecurrence,
    set: qSet,
    funcconcept: qFuncConcept,
    explog: qExpLog,
    trig: qTrig,
    sequence: qSequence,
    vector: qVector,
    solid: qSolid,
    derivative: qDerivative,
    conic: qConic,
    complex: qComplex,
    dist_exp: qDistExp,
    dist_binom: qDistBinom,
    stat_case: qStatCase,
    trig_id: qTrigId,
    seqsum: qSeqSum,
    solid_axis: qSolidAxis,
    solid_angle: qSolidAngle,
    deriv_mon: qDerivMon,
    deriv_ineq: qDerivIneq,
    func_zero: qFuncZero,
    conic_link: qConicLink,
    conic_chord: qConicChord,
    conic_prop: qConicProp,
    param_eq: qParamEq
  };

  if (window.TECHNIQUES) {
    window.TECHNIQUES.forEach(t => {
      if (GEN[t.id]) t.qgen = GEN[t.id];
    });
  }
  window.QGEN_HIGH_READY = true;
})();
