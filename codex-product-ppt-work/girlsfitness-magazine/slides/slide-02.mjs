import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx); kicker(slide, ctx, "Problem frame", "02");
  title(slide, ctx, "问题不是“她不想练”，而是开始时的阻力太密。", 58, 106, 850, 92, 35);
  note(slide, ctx, "策划书把痛点拆成心理压力、流程陌生、动作不确定、现有 App 个性化不足。产品机会在于把这些摩擦一次性拆小。", 62, 205, 900, 44, { size: 15 });
  const items = [
    ["陌生环境", "第一次进入健身房，不知道从哪里开始。", "01"],
    ["器械焦虑", "担心动作做错、器械不会调、被别人注视。", "02"],
    ["流程中断", "训练 App 操作复杂，容易打断当下节奏。", "03"],
    ["身体波动", "经期前后状态变化明显，通用计划不够贴身。", "04"],
    ["反馈不足", "看不到变化，成就感弱，很难坚持。", "05"],
  ];
  items.forEach((it,i)=>{ const y=304+i*62; text(slide,ctx,it[2],78,y,48,32,{size:26,face:style.serif,bold:true,color:i%2?style.sage:style.plum}); rule(slide,ctx,138,y+18,210,i%2?style.sage:style.plum,2); text(slide,ctx,it[0],370,y+2,180,24,{size:19,bold:true,color:style.ink}); note(slide,ctx,it[1],560,y+5,520,24,{size:14,color:style.soft}); });
  rect(slide,ctx,994,112,136,136,style.blush); text(slide,ctx,"门槛",1019,145,90,34,{size:26,bold:true,align:"center",color:style.plum}); note(slide,ctx,"被拆成可完成的下一步",1010,184,104,38,{size:12,align:"center"});
  footer(slide, ctx, 2);
  return slide;
}
