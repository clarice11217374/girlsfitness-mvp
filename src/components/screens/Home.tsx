"use client";

type Props = { onStart: () => void };

export function Home({ onStart }: Props) {
  const days = [
    { n: "一", d: 21 }, { n: "二", d: 22 }, { n: "三", d: 23, dot: true }, { n: "四", d: 24, today: true },
    { n: "五", d: 25 }, { n: "六", d: 26, dot: true }, { n: "日", d: 27 },
  ];
  const hrs = 23;
  const total = 100;
  const pct = Math.round((hrs / total) * 100);

  return (
    <div className="page">
      <div className="sbar"><span>9:41</span><span>●●●</span></div>
      <div className="hdr">
        <div><div style={{ fontSize: 13, color: "var(--gray)" }}>欢迎回来 👋</div><div className="t-title" style={{ fontSize: 26 }}>今日训练</div></div>
        <div className="av">🌸</div>
      </div>
      <div className="sec-row"><div className="t-sec">本周计划</div><div className="see-all">查看全部</div></div>
      <div className="wstrip">
        {days.map((d) => (
          <div className="dcell" key={d.d}><div className="dname">{d.n}</div><div className={`dnum ${d.today ? "today" : ""}`}>{d.d}</div>{d.dot && <div className="ddot" />}</div>
        ))}
      </div>
      <div className="wcard">
        <div className="wtag">⚡ 今日计划</div><div className="wname">上肢推 · 力量日</div><div className="wmeta">45分钟 · 中等强度 · 4个动作</div>
        <button className="wbtn" onClick={onStart}>开始训练</button><div className="wbig">45’</div>
      </div>
      <div className="mcard">
        <div className="mtop"><div className="mlbl">🏆 百小时挑战</div><div className="mval">{hrs}h / {total}h</div></div>
        <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
        <div className="msub">再坚持 {total - hrs} 小时，解锁成就徽章 🎖️</div>
      </div>
      <div className="bnav">
        {[{ icon: "🏠", lbl: "首页", on: true }, { icon: "📋", lbl: "计划" }, { icon: "📊", lbl: "记录" }].map((n) => (
          <div key={n.lbl} className={`ni ${n.on ? "on" : ""}`}><div className="nicon">{n.icon}</div><div className="nlbl">{n.lbl}</div></div>
        ))}
      </div>
    </div>
  );
}
