import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx, "#FBF7F2"); kicker(slide, ctx, "MVP scope", "08");
  title(slide, ctx, "MVP 不追求完整 App，先保护一个可被用户完成的闭环。", 58, 106, 900, 88, 34);
  const nodes=[
    ["基础信息",86,292,"用户填写目标、经验、状态"],
    ["计划生成",346,214,"根据周期和体感生成今日训练"],
    ["动作库",620,292,"动作说明、器械提示、注意事项"],
    ["训练引导",346,420,"流线式完成热身到拉伸"],
    ["反馈记录",620,420,"完成情况、感受、打卡趋势"],
  ];
  nodes.forEach((n,i)=>{rect(slide,ctx,n[1],n[2],190,92,i===1?style.plum:i===4?style.sage:style.blush2,{stroke:style.line,strokeWidth:1}); text(slide,ctx,n[0],n[1]+18,n[2]+18,150,24,{size:19,bold:true,color:i===1?"#FFFFFF":style.ink}); note(slide,ctx,n[3],n[1]+18,n[2]+50,150,26,{size:11.5,color:i===1?"#EDE8F2":style.soft});});
  const arrows=[[276,338,60],[536,260,70],[536,466,70],[810,466,60],[536,338,70]]; arrows.forEach(a=>{rule(slide,ctx,a[0],a[1],a[2],style.plum,2); text(slide,ctx,"→",a[0]+a[2]-10,a[1]-17,28,28,{size:20,color:style.plum});});
  rect(slide,ctx,906,230,220,300,style.dark); text(slide,ctx,"后端 / 数据",936,262,160,26,{size:22,bold:true,color:"#FFFFFF"}); note(slide,ctx,"Supabase / Firebase 可先承担账户、训练记录、动作库和反馈表。真正的难点不是数据库名，而是数据结构围绕闭环设计。",936,314,160,140,{size:13,color:"#E9E2EF"}); rule(slide,ctx,936,478,150,style.sage,3); text(slide,ctx,"先少而准",936,496,150,24,{size:18,bold:true,color:"#FFFFFF"});
  footer(slide, ctx, 8);
  return slide;
}
