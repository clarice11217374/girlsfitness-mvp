"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Wifi } from "lucide-react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

function formatStatusTime(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function StatusBar({ className = "", style }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(formatStatusTime(new Date()));
    updateTime();
    const id = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`sbar ${className}`.trim()} style={style}>
      <span className="sbar-time" aria-label="当前时间">
        {time}
      </span>
      <span className="sbar-status" aria-hidden>
        <span className="sbar-signal">
          <span />
          <span />
          <span />
          <span />
        </span>
        <Wifi className="sbar-wifi" />
        <span className="sbar-battery">
          <span />
        </span>
      </span>
    </div>
  );
}
