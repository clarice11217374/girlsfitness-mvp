import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx); kicker(slide, ctx, "Roadmap", "09");
  title(slide, ctx, "接下来 8 周，把“能讲清楚”推进到“能被新手真实完成”。", 58, 106, 940, 88, 34);
  const phases=[
    ["调研", "访谈 / 竞品 / 需求文档", "Week 1"],
    ["低保真", "页面流程和用户测试脚本", "Week 2"],
    ["高保真", "Figma 细化 + 视觉资产", "Week 3-4"],
    ["MVP 开发", "前端、后端函数、动作库", "Week 5-6"],
    ["Demo 测试", "记录反馈，修改推荐逻辑", "Week 7-8"],
  ];
  rule(slide,ctx,98,374,1000,style.line,2);
  phases.forEach((p,i)=>{const x=98+i*250; rect(slide,ctx,x,348,18,54,i%2?style.sage:style.plum); text(slide,ctx,p[2],x-12,304,90,22,{size:13,bold:true,color:style.plum}); text(slide,ctx,p[0],x-12,430,140,28,{size:23,bold:true}); note(slide,ctx,p[1],x-12,468,172,42,{size:12.5});});
  rect(slide,ctx,80,568,1040,42,style.blush2,{stroke:style.line,strokeWidth:1}); text(slide,ctx,"团队分工已具备雏形：前端 / 高保真、后端逻辑、用户体验、测试与提示词优化。路线图要服务于这条分工，而不是扩大范围。",106,580,990,18,{size:14,bold:true,color:style.ink,align:"center"});
  footer(slide, ctx, 9);
  return slide;
}
