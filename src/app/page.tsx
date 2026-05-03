"use client";

import { useState } from "react";
import { Complete } from "@/components/screens/Complete";
import { Record } from "@/components/screens/Record";
import { Home } from "@/components/screens/Home";
import { Preview } from "@/components/screens/Preview";
import { StatusInput } from "@/components/screens/StatusInput";
import { Training } from "@/components/screens/Training";
import { WorkoutExec } from "@/components/screens/WorkoutExec";
import { createThemeCssVars } from "@/theme";

export default function AppPage() {
  const [page, setPage] = useState("status");
  const cssVars = createThemeCssVars() as React.CSSProperties;

  return (
    <div className="app-root" style={cssVars}>
      <div className="switcher">
        {[
          { id: "status", lbl: "状态输入" },
          { id: "home", lbl: "首页" },
          { id: "training", lbl: "训练页" },
          { id: "preview", lbl: "预览页" },
          { id: "exec", lbl: "训练执行" },
          { id: "complete", lbl: "完成页" },
          { id: "records", lbl: "记录页" },
        ].map((t) => (
          <div key={t.id} className={`stab ${page === t.id ? "on" : ""}`} onClick={() => setPage(t.id)}>
            {t.lbl}
          </div>
        ))}
      </div>

      <div className="shell">
        {page === "status" && <StatusInput onDone={() => setPage("home")} />}
        {page === "home" && (
          <Home
            onStart={() => setPage("preview")}
            onTraining={() => setPage("training")}
            onRecords={() => setPage("records")}
            onReSelect={() => setPage("status")}
          />
        )}
        {page === "training" && (
          <Training onHome={() => setPage("home")} onOpenPreview={() => setPage("preview")} onRecords={() => setPage("records")} />
        )}
        {page === "preview" && <Preview onBack={() => setPage("home")} onStart={() => setPage("exec")} />}
        {page === "exec" && <WorkoutExec onDone={() => setPage("complete")} />}
        {page === "records" && <Record onHome={() => setPage("home")} onTraining={() => setPage("training")} />}
        {page === "complete" && <Complete onSaved={() => setPage("records")} />}
      </div>

      <div className="foot-note">点击各页面内的按钮可按流程跳转 · 顶部标签可直接切换</div>
    </div>
  );
}
