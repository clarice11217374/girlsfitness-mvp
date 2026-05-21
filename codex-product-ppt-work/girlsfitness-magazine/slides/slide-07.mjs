import { style, bg, rect, text, kicker, title, note, footer, rule } from "./shared.mjs";
export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx); kicker(slide, ctx, "Adaptation logic", "07");
  title(slide, ctx, "经期适配让推荐不再是通用模板，而是“今天适合我”。", 58, 106, 850, 88, 34);
  const cols=["状态输入","推荐策略","训练表达"]; const xs=[78,435,790]; cols.forEach((c,i)=>{text(slide,ctx,c,xs[i],246,250,24,{size:15,bold:true,color:style.plum}); rule(slide,ctx,xs[i],278,250,style.plum,2);});
  const rows=[
    ["经期中 + 精力一般", "降强度，优先稳定核心和拉伸", "温和热身 → 轻力量 → 舒缓拉伸"],
    ["不在经期 + 状态正常", "标准入门强度，保护动作质量", "热身 → 器械教学 → 有氧 → 拉伸"],
    ["不确定 + 有点累", "减少决策负担，给保守方案", "短流程 → 少器械 → 明确完成感"],
  ];
  rows.forEach((r,i)=>{const y=314+i*88; rect(slide,ctx,64,y-14,1060,66,i%2?"#FFF9F2":style.blush2,{stroke:style.line,strokeWidth:1}); r.forEach((cell,j)=>{text(slide,ctx,cell,xs[j],y,250,34,{size:j===0?16:14,bold:j===0,color:j===0?style.ink:style.soft});}); text(slide,ctx,"→",370,y+3,34,22,{size:20,color:style.plum,align:"center"}); text(slide,ctx,"→",725,y+3,34,22,{size:20,color:style.plum,align:"center"});});
  rect(slide,ctx,64,594,1060,44,style.dark); text(slide,ctx,"MVP 里最值得守住的能力：把“身体状态”转译成“下一步训练”，而不是只展示训练库。",92,607,1000,20,{size:16,bold:true,color:"#FFFFFF",align:"center"});
  footer(slide, ctx, 7);
  return slide;
}
