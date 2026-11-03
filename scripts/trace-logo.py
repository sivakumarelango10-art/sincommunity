"""Trace the SINC mark into vector parts in the image's own 900x787 space.

Run from the project root when the logo artwork changes:
    pip install numpy opencv-python-headless scikit-image scipy pillow
    python3 scripts/trace-logo.py            # also writes logo-trace-check.svg to look at

Writes src/data/logo-art.json for the opening story:
  heads:   [{x, y, r}] top, bottom-right, bottom-left (same order as the story's nodes)
  centre:  {x, y} centroid of the three heads; reach: mean head distance from it
  arms:    [{outline, swirl}] the arm (ribbon) belonging to each head, same order
           outline: closed path whose start and end meet at the point opposite the shoulder,
                    so drawing from 50% outwards grows both ways from the shoulder
           swirl:   open path from the head's centre, via the shoulder, along the arm's
                    centre line to its inner tip (the line the story draws in "connect")
"""
import json, numpy as np, cv2
from PIL import Image
from skimage.morphology import skeletonize
from scipy.ndimage import gaussian_filter1d
from scipy.interpolate import splprep, splev

import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public/images/brand/sinc-mark-900.webp")
DEST = os.path.join(ROOT, "src/data/logo-art.json")
CHECK = os.path.join(ROOT, "logo-trace-check.svg")   # an overlay of the trace on the artwork (not committed)

im = np.array(Image.open(SRC).convert("RGBA")).astype(float)
a = im[..., 3] / 255; R, B = im[..., 0], im[..., 2]
mask = ((a > 0.5) & (R < 160)).astype(np.uint8)
n, lab, stats, cents = cv2.connectedComponentsWithStats(mask, 8)
parts = [i for i in range(1, n) if stats[i, 4] > 2000]
assert len(parts) == 6, len(parts)

def part_mask(i):
    m = (lab == i).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    disc = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    return cv2.morphologyEx(m, cv2.MORPH_OPEN, disc)          # drop small hooks and specks

def contour(m, sigma=2.0):
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)[:, 0, :].astype(float)
    c[:, 0] = gaussian_filter1d(c[:, 0], sigma, mode="wrap"); c[:, 1] = gaussian_filter1d(c[:, 1], sigma, mode="wrap")
    # clockwise on screen (positive shoelace area with y down)
    area = 0.5 * np.sum(c[:, 0] * np.roll(c[:, 1], -1) - np.roll(c[:, 0], -1) * c[:, 1])
    return c if area > 0 else c[::-1]

def bezier(p, closed, dp=0):
    """Catmull-Rom through the points, written as cubic Beziers (absolute coordinates only)."""
    k = len(p); f = lambda v: f"{v:.{dp}f}"
    out = [f"M{f(p[0][0])} {f(p[0][1])}"]
    for i in (range(k) if closed else range(k - 1)):
        p0 = p[(i - 1) % k] if (closed or i > 0) else p[i]
        p1, p2 = p[i], p[(i + 1) % k]
        p3 = p[(i + 2) % k] if (closed or i + 2 < k) else p2
        c1 = p1 + (p2 - p0) / 6; c2 = p2 - (p3 - p1) / 6
        out.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    return "".join(out) + ("Z" if closed else "")

def simplify(p, closed, tol):
    return cv2.approxPolyDP(p.astype(np.float32).reshape(-1, 1, 2), tol, closed)[:, 0, :].astype(float)

def resample(p, step):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    t = np.arange(0, d[-1], step)
    return np.c_[np.interp(t, d, p[:, 0]), np.interp(t, d, p[:, 1])]

heads, arms = [], []
for i in parts:
    m = part_mask(i); x, y, w, h, area = stats[i]
    if area / (np.pi * (max(w, h) / 2) ** 2) > 0.85:
        (cx, cy), r = cv2.minEnclosingCircle(contour(m).astype(np.float32))
        heads.append({"x": round(float(cx), 1), "y": round(float(cy), 1), "r": round(float(r), 1)})
    else:
        arms.append(m)
top = min(heads, key=lambda h: h["y"]); rest = [h for h in heads if h is not top]
heads = [top, max(rest, key=lambda h: h["x"]), min(rest, key=lambda h: h["x"])]
C = np.array([np.mean([h["x"] for h in heads]), np.mean([h["y"] for h in heads])])
reach = float(np.mean([np.hypot(h["x"] - C[0], h["y"] - C[1]) for h in heads]))

def spine_of(m):
    sk = skeletonize(m > 0); ys, xs = np.nonzero(sk); pts = set(zip(xs.tolist(), ys.tolist()))
    nb = lambda p: [(p[0] + dx, p[1] + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and (p[0] + dx, p[1] + dy) in pts]
    def bfs(s):
        prev = {s: None}; q = [s]
        for p in q:
            for t in nb(p):
                if t not in prev: prev[t] = p; q.append(t)
        path = [q[-1]]
        while prev[path[-1]] is not None: path.append(prev[path[-1]])
        return path
    far = bfs(next(iter(pts)))[0]
    sp = np.array(bfs(far), float)[::3]
    tck, _ = splprep([sp[:, 0], sp[:, 1]], s=len(sp) * 18.0)      # a smooth centre line
    u = np.linspace(0, 1, 160); return np.column_stack(splev(u, tck))

out = []
for j, h in enumerate(heads):
    hc = np.array([h["x"], h["y"]])
    # the arm that passes closest to this head is its body
    def gap(m): c = contour(m); return np.min(np.hypot(c[:, 0] - hc[0], c[:, 1] - hc[1]))
    m = min(arms, key=gap); arms = [x for x in arms if x is not m]
    c = contour(m)
    s_i = int(np.argmin(np.hypot(c[:, 0] - hc[0], c[:, 1] - hc[1])))          # the shoulder
    c = np.roll(c, len(c) // 2 - s_i, axis=0)                               # shoulder at 50% of the length
    outline = bezier(simplify(np.r_[c, c[:1]], False, 1.1)[:-1], True)
    sp = spine_of(m)
    if np.hypot(*(sp[0] - C)) < np.hypot(*(sp[-1] - C)): sp = sp[::-1]     # outer tip -> inner tip
    shoulder = c[len(c) // 2]
    k = int(np.argmin(np.hypot(sp[:, 0] - shoulder[0], sp[:, 1] - shoulder[1])))
    tail = sp[k:]
    # head centre -> into the arm's centre line with a tangent-matched curve (no corner at the join)
    k2 = max(2, int(len(tail) * 0.2)); P3 = tail[k2]
    tang = tail[min(k2 + 3, len(tail) - 1)] - tail[max(k2 - 3, 0)]; tang /= np.hypot(*tang)
    out_dir = (shoulder - hc) / np.hypot(*(shoulder - hc)); dd = np.hypot(*(P3 - hc)) * 0.5
    P1, P2 = hc + out_dir * dd, P3 - tang * dd
    tt = np.linspace(0, 1, 40)[:, None]
    lead = (1 - tt) ** 3 * hc + 3 * (1 - tt) ** 2 * tt * P1 + 3 * (1 - tt) * tt ** 2 * P2 + tt ** 3 * P3
    sw = resample(np.r_[lead[:-1], tail[k2:]], 6.0)
    sw[1:-1, 0] = gaussian_filter1d(sw[:, 0], 5, mode="nearest")[1:-1]; sw[1:-1, 1] = gaussian_filter1d(sw[:, 1], 5, mode="nearest")[1:-1]
    swirl = bezier(simplify(sw, False, 0.8), False, 1)
    out.append({"outline": outline, "swirl": swirl})

data = {"w": 900, "h": 787, "centre": {"x": round(float(C[0]), 1), "y": round(float(C[1]), 1)}, "reach": round(reach, 1), "heads": heads, "arms": out}
json.dump(data, open(DEST, "w"), separators=(",", ":"))
print("centre", data["centre"], "reach", data["reach"]); print("heads", heads)
print("json bytes", len(json.dumps(data, separators=(",", ":"))))

svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 787" width="900" height="787">',
       f'<image href="public/images/brand/sinc-mark-900.webp" width="900" height="787" opacity="0.35"/>']
for h in heads: svg.append(f'<circle cx="{h["x"]}" cy="{h["y"]}" r="{h["r"]}" fill="none" stroke="#e11" stroke-width="2"/>')
for a_ in out:
    svg.append(f'<path d="{a_["outline"]}" fill="none" stroke="#e11" stroke-width="2"/>')
    svg.append(f'<path d="{a_["swirl"]}" fill="none" stroke="#0a0" stroke-width="3"/>')
    # mark where each outline starts (should be opposite the shoulder)
    mm = a_["outline"].split("C")[0][1:].split(); svg.append(f'<circle cx="{mm[0]}" cy="{mm[1]}" r="6" fill="#f0f"/>')
svg.append(f'<circle cx="{C[0]}" cy="{C[1]}" r="5" fill="#00f"/></svg>')
open(CHECK, "w").write("\n".join(svg))
