import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx, style.dark); kicker(slide, ctx, "Closing ask", "10");
  title(slide, ctx, "GirlsFitness 的价值，是让女性新手不用独自穿过那段不确定。", 58, 110, 930, 118, 38, "#FFFFFF");
  note(slide, ctx, "下一步支持需求应该集中在三个地方：后端结构、反馈数据、用户调研。它们都会直接提高 MVP 的可信度，而不是把产品做大。", 62, 252, 780, 54, { size: 17, color: "#E8E0EA" });
  const asks=[["后端支持","确认 Supabase / Firebase 是否能支撑用户资料、训练计划、记录表。"],["数据分析","把完成率、状态反馈、打卡趋势变成后续推荐依据。"],["用户调研","验证女性新手真正害怕的节点，以及哪类提示最有效。"]];
  asks.forEach((a,i)=>{const x=80+i*360; rect(slide,ctx,x,390,290,150,i===1?style.sage:style.blush,{stroke:"#FFFFFF33",strokeWidth:1}); text(slide,ctx,`0${i+1}`,x+24,416,42,30,{size:28,face:style.serif,bold:true,color:style.dark}); text(slide,ctx,a[0],x+82,420,160,28,{size:21,bold:true,color:style.dark}); note(slide,ctx,a[1],x+24,470,230,44,{size:12.5,color:style.dark});});
  rule(slide,ctx,62,604,1050,"#FFFFFF33",1); text(slide,ctx,"演讲落点：我们不是要做一个更复杂的健身产品，而是做一个更会照顾起点的健身产品。",62,628,900,28,{size:18,bold:true,color:"#FFFFFF"});
  footer(slide, ctx, 10);
  return slide;
}
