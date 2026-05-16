import { style, bg, rect, text, kicker, title, note, footer, pill, rule } from "./shared.mjs";
export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add(); bg(slide, ctx, "#FBF7F2"); kicker(slide, ctx, "Audience", "03");
  title(slide, ctx, "核心用户要的不是鸡血，\n而是安全感、明确感和一点点进步感。", 58, 100, 980, 112, 32);
  const cards = [
    ["健身房新手", "刚办卡、流程不熟、怕做错动作", "给她一条今天能照着做的路线"],
    ["体态改善者", "想变健康、改善体态，但不想被强度压垮", "让计划从低门槛动作开始"],
    ["状态敏感者", "经期前后体感波动，训练强度需要被照顾", "把周期和体感变成计划参数"],
  ];
  cards.forEach((c,i)=>{ const x=72+i*370; rect(slide,ctx,x,280,305,250,i===0?style.blush2:i===1?style.mint:"#F3E7D8",{stroke:style.line,strokeWidth:1}); text(slide,ctx,`0${i+1}`,x+24,304,64,36,{size:32,face:style.serif,bold:true,color:style.plum}); text(slide,ctx,c[0],x+24,360,240,30,{size:24,bold:true}); note(slide,ctx,c[1],x+24,410,244,42,{size:14,color:style.ink}); rule(slide,ctx,x+24,470,225,1===1?style.line:style.line,1); note(slide,ctx,c[2],x+24,492,240,36,{size:13,bold:true,color:style.plum}); });
  pill(slide,ctx,"20-35 岁女性",72,590,150,style.plum); pill(slide,ctx,"想变健康",240,590,128,style.sage); pill(slide,ctx,"缺少情感支持",386,590,156,style.plum2); pill(slide,ctx,"未形成习惯",560,590,134,style.sage); pill(slide,ctx,"身体状态波动",712,590,150,style.plum2);
  footer(slide, ctx, 3);
  return slide;
}

