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
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [previewReturnTo, setPreviewReturnTo] = useState<"home" | "training">("home");
  const [execTemplateId, setExecTemplateId] = useState<string | null>(null);
  const cssVars = createThemeCssVars() as React.CSSProperties;

  return (
    <div className="app-root" style={cssVars}>
      <div className="shell">
        {page === "status" && <StatusInput onDone={() => setPage("home")} />}
        {page === "home" && (
          <Home
            onStart={() => {
              setPreviewReturnTo("home");
              setPreviewTemplateId(null);
              setPage("preview");
            }}
            onTraining={() => setPage("training")}
            onRecords={() => setPage("records")}
            onReSelect={() => setPage("status")}
          />
        )}
        {page === "training" && (
          <Training
            onHome={() => setPage("home")}
            onPickTemplate={(id) => {
              setPreviewReturnTo("training");
              setPreviewTemplateId(id);
              setPage("preview");
            }}
            onRecords={() => setPage("records")}
          />
        )}
        {page === "preview" && (
          <Preview
            templateId={previewTemplateId}
            onBack={() => {
              setPage(previewReturnTo === "training" ? "training" : "home");
            }}
            onStart={() => setPage("exec")}
            onStartWorkout={(id) => {
              setExecTemplateId(id);
              setPage("exec");
            }}
          />
        )}
        {page === "exec" && (
          <WorkoutExec
            templateId={execTemplateId}
            onBack={() => setPage("preview")}
            onDone={() => {
              setExecTemplateId(null);
              setPage("complete");
            }}
          />
        )}
        {page === "records" && <Record onHome={() => setPage("home")} onTraining={() => setPage("training")} />}
        {page === "complete" && <Complete onSaved={() => setPage("records")} />}
      </div>
    </div>
  );
}
