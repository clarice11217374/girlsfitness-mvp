"use client";

type Props = {
  onHome: () => void;
  onOpenPreview: () => void;
  onRecords: () => void;
};

const templates = [
  {
    title: "上肢推 · 力量日",
    meta: "45分钟 · 中等强度 · 器械",
    tags: ["新手友好", "胸肩三头"],
    duration: "45’",
    available: true,
    cover: "push" as const,
  },
  {
    title: "轻量恢复 · 低强度",
    meta: "25分钟 · 低强度 · 无器械",
    tags: ["恢复", "经期友好"],
    duration: "25’",
    available: false,
    cover: "recover" as const,
  },
  {
    title: "臀腿核心 · 燃脂日",
    meta: "50分钟 · 中高强度 · 混合",
    tags: ["臀腿核心", "有氧结合"],
    duration: "50’",
    available: false,
    cover: "legs" as const,
  },
];

export function Training({ onHome, onOpenPreview, onRecords }: Props) {
  return (
    <div className="page training-screen">
      <div className="sbar"><span>9:41</span><span>●●●</span></div>
      <div className="hdr">
        <div>
          <div style={{ fontSize: 13, color: "var(--gray)" }}>训练选择</div>
          <div className="t-title" style={{ fontSize: 26 }}>训练模板</div>
        </div>
      </div>

      <div className="training-scroll">
        <div className="template-list">
          {templates.map((item) => (
            <button
              type="button"
              key={item.title}
              className={`template-card ${item.available ? "" : "disabled"}`}
              onClick={item.available ? onOpenPreview : undefined}
            >
              <div className={`template-cover template-cover--${item.cover}`}>
                <div className="template-time">{item.duration}</div>
              </div>
              <div className="template-body">
                <div className="template-head">
                  <div className="template-title">{item.title}</div>
                  {!item.available && <div className="template-badge">即将支持</div>}
                </div>
                <div className="template-meta">{item.meta}</div>
                <div className="template-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="template-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bnav">
        {[
          { icon: "🏠", lbl: "首页", on: false, click: onHome },
          { icon: "📋", lbl: "训练", on: true },
          { icon: "📊", lbl: "记录", on: false, click: onRecords },
        ].map((n) => (
          <div key={n.lbl} className={`ni ${n.on ? "on" : ""}`} onClick={n.click}>
            <div className="nicon">{n.icon}</div>
            <div className="nlbl">{n.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
