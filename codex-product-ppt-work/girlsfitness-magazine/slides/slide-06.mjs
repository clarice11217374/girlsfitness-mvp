import { style, assets, bg, rect, text, kicker, title, note, footer, image, rule } from "./shared.mjs";
export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx, style.dark);
  await image(slide, ctx, assets.storyboard, 0, 0, 1280, 720, "cover", "AI-generated four-panel storyboard for GirlsFitness user journey");
  rect(slide,ctx,0,0,1280,720,"#00000066");
  rect(slide,ctx,56,58,420,604,"#F8F1EAEF");
  text(slide,ctx,"STORYBOARD",84,88,220,22,{size:11,bold:true,color:style.plum});
  title(slide,ctx,"从犹豫到完成：故事版要讲的是一条心理负担下降的曲线。",84,130,336,180,31,style.ink);
  const beats=[["01","走进健身房前，先承认“不确定”。"],["02","用状态选择把身体差异说清楚。"],["03","用步骤和器械提示把动作变简单。"],["04","用完成反馈把坚持变得可见。"]];
  beats.forEach((b,i)=>{const y=348+i*58; text(slide,ctx,b[0],86,y,38,24,{size:20,face:style.serif,bold:true,color:style.plum}); note(slide,ctx,b[1],134,y+3,278,26,{size:13.5,color:style.ink,bold:i===3}); rule(slide,ctx,86,y+40,300,style.line,1);});
  footer(slide, ctx, 6, "Storyboard image generated for this deck; no official logo or app icon implied");
  return slide;
}
