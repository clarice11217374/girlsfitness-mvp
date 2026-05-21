export const style = {
  W: 1280,
  H: 720,
  bg: "#F8F1EA",
  ink: "#241E2A",
  soft: "#7B7280",
  plum: "#514462",
  plum2: "#6F607D",
  blush: "#EFDDE4",
  blush2: "#F6E9EC",
  sage: "#A9B8A3",
  mint: "#DDE7D8",
  cream: "#FFF9F2",
  line: "#D9CDC5",
  dark: "#211A29",
  title: "Microsoft YaHei UI",
  body: "Microsoft YaHei UI",
  serif: "Georgia",
};

export const assets = {
  frame01: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-01.png",
  frame03: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-03.png",
  frame04: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-04.png",
  frame08: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-08.png",
  frame11: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-11.png",
  frame12: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/frames/frame-12.png",
  storyboard: "C:/Users/shiyu/Desktop/她代码——健身/girlsfitness-mvp/codex-product-ppt-src/generated/storyboard-four-panel.png",
};

export function bg(slide, ctx, color = style.bg) {
  rect(slide, ctx, 0, 0, 1280, 720, color);
}

export function rect(slide, ctx, x, y, w, h, fill, opts = {}) {
  return ctx.addShape(slide, {
    left: x, top: y, width: w, height: h,
    geometry: opts.geometry || "rect",
    fill,
    line: opts.line || ctx.line(opts.stroke || "#00000000", opts.strokeWidth || 0),
    name: opts.name,
  });
}

export function text(slide, ctx, value, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text: value,
    left: x, top: y, width: w, height: h,
    fontSize: opts.size || 20,
    color: opts.color || style.ink,
    bold: !!opts.bold,
    typeface: opts.face || style.body,
    align: opts.align || "left",
    valign: opts.valign || "top",
    fill: opts.fill || "#00000000",
    line: opts.line || ctx.line("#00000000", 0),
    insets: opts.insets || { left: 0, right: 0, top: 0, bottom: 0 },
    name: opts.name,
  });
}

export function kicker(slide, ctx, label, no = "") {
  rect(slide, ctx, 58, 54, 8, 8, style.plum, { name: `kicker-${no}-marker` });
  text(slide, ctx, label.toUpperCase(), 78, 46, 320, 26, { size: 10, color: style.plum, bold: true, name: `kicker-${no}-label`, valign: "middle" });
  rect(slide, ctx, 58, 78, 1120, 1, style.line);
}

export function title(slide, ctx, value, x = 58, y = 96, w = 780, h = 104, size = 34, color = style.ink) {
  return text(slide, ctx, value, x, y, w, h, { size, color, bold: true, face: style.title });
}

export function note(slide, ctx, value, x, y, w, h, opts = {}) {
  return text(slide, ctx, value, x, y, w, h, { size: opts.size || 13, color: opts.color || style.soft, face: style.body, ...opts });
}

export function footer(slide, ctx, page, source = "GirlsFitness source: product plan + demo video") {
  rect(slide, ctx, 58, 674, 1120, 1, style.line);
  text(slide, ctx, source, 58, 688, 820, 18, { size: 8.5, color: style.soft });
  text(slide, ctx, String(page).padStart(2, "0"), 1138, 684, 40, 22, { size: 13, color: style.plum, bold: true, align: "right", face: style.serif });
}

export function phoneFrame(slide, ctx, x, y, w, h, fill = "#1F1A28") {
  rect(slide, ctx, x - 8, y - 8, w + 16, h + 16, fill, { stroke: fill, strokeWidth: 0 });
  rect(slide, ctx, x, y, w, h, "#FFFFFF", { stroke: "#00000000", strokeWidth: 0 });
}

export async function image(slide, ctx, path, x, y, w, h, fit = "cover", alt = "") {
  return ctx.addImage(slide, { path, left: x, top: y, width: w, height: h, fit, alt });
}

export function pill(slide, ctx, label, x, y, w, color = style.plum, light = false) {
  rect(slide, ctx, x, y, w, 32, light ? style.blush2 : color, { stroke: light ? style.line : color, strokeWidth: 1 });
  text(slide, ctx, label, x + 12, y + 7, w - 24, 16, { size: 10.5, color: light ? style.ink : "#FFFFFF", bold: true, align: "center" });
}

export function rule(slide, ctx, x, y, w, color = style.line, h = 1) {
  rect(slide, ctx, x, y, w, h, color);
}
