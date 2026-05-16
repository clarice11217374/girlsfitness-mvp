import { style, assets, bg, rect, text, kicker, title, note, footer, image, phoneFrame, rule } from "./shared.mjs";
export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx, "#F4ECE7"); kicker(slide, ctx, "Demo evidence", "05");
  title(slide, ctx, "演示视频已经跑通了从状态问答到训练记录的核心链路。", 58, 106, 880, 82, 34);
  const frames = [[assets.frame01,"告诉我你今天的状态","用户先被询问，而不是直接被安排。"],[assets.frame03,"今日训练计划","系统把状态转译成可执行训练。"],[assets.frame11,"训练后反馈","完成后用感受和记录闭环。"]];
  frames.forEach((f,i)=>{ const x=86+i*370; phoneFrame(slide,ctx,x,248,246,338); image(slide,ctx,f[0],x,248,246,338,"cover",f[1]); text(slide,ctx,f[1],x,608,246,24,{size:17,bold:true,align:"center",color:style.ink}); note(slide,ctx,f[2],x,634,246,34,{size:11.5,align:"center"}); });
  rule(slide,ctx,88,218,1020,style.line,1);
  footer(slide, ctx, 5, "Source: extracted frames from user-provided product demo video");
  return slide;
}
