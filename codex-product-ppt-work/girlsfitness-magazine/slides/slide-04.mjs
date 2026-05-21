import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx); kicker(slide, ctx, "Product loop", "04");
  title(slide, ctx, "产品闭环：先理解今天的身体，再给出今天的训练。", 58, 106, 880, 86, 34);
  const steps = [
    ["状态输入", "经期 / 不在经期 / 不确定\n精力充沛 / 正常 / 有点累"],
    ["智能适配", "根据阶段和体感调整热身、力量、有氧、拉伸"],
    ["流线训练", "按步骤完成动作，每一步给器械和动作说明"],
    ["反馈记录", "结束后记录状态，形成打卡、趋势和进步感"],
  ];
  steps.forEach((s,i)=>{ const x=84+i*286; rect(slide,ctx,x,292,220,210,i%2?"#F3E7D8":style.blush2,{stroke:style.line,strokeWidth:1}); text(slide,ctx,`0${i+1}`,x+20,318,48,30,{size:28,face:style.serif,bold:true,color:style.plum}); text(slide,ctx,s[0],x+20,366,170,28,{size:22,bold:true}); note(slide,ctx,s[1],x+20,416,174,58,{size:12.5,color:style.ink}); if(i<3){ rule(slide,ctx,x+226,397,52,style.plum,2); text(slide,ctx,"→",x+244,378,34,30,{size:28,color:style.plum,align:"center"}); }});
  rect(slide,ctx,76,556,1048,54,style.dark); text(slide,ctx,"关键设计判断：不要把用户留在“我该选哪个训练”的空白里，而是每一步都给她下一步。",104,572,990,22,{size:18,bold:true,color:"#FFFFFF",align:"center"});
  footer(slide, ctx, 4);
  return slide;
}
