import { style, assets, bg, rect, text, kicker, title, note, footer, image, phoneFrame, pill, rule } from "./shared.mjs";
export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx);
  rect(slide, ctx, 0, 0, 1280, 720, style.bg);
  rect(slide, ctx, 760, 0, 520, 720, style.dark);
  await image(slide, ctx, assets.frame03, 834, 74, 318, 572, "cover", "Demo screen showing today's training plan");
  rect(slide, ctx, 798, 44, 390, 632, "#00000000", { stroke: "#7E708C", strokeWidth: 2 });
  text(slide, ctx, "GirlsFitness", 58, 54, 360, 34, { size: 22, bold: true, color: style.plum, face: style.serif });
  text(slide, ctx, "女性新手健身辅助应用 · 产品演讲稿", 58, 92, 470, 24, { size: 13, color: style.soft, bold: true });
  title(slide, ctx, "把第一次走进健身房，变成一条被照顾的路线。", 58, 178, 650, 166, 44);
  note(slide, ctx, "GirlsFitness 不是把更多动作塞给用户，而是把经期状态、当天体感、器械说明和训练反馈连成一个更温柔的入门闭环。", 62, 374, 590, 66, { size: 18, color: style.ink });
  const metrics = [["20-35", "目标年龄段"], ["4 步", "热身 / 力量 / 有氧 / 拉伸"], ["MVP", "网页版先跑通计划生成"]];
  metrics.forEach((m,i)=>{ const x=62+i*205; rule(slide,ctx,x,518,150,i===0?style.plum:i===1?style.sage:style.blush,3); text(slide,ctx,m[0],x,538,150,34,{size:30,bold:true,face:style.serif,color:style.ink}); note(slide,ctx,m[1],x,578,160,22,{size:11,bold:true}); });
  footer(slide, ctx, 1);
  return slide;
}
