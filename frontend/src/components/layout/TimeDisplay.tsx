"use client";

import { useState, useEffect } from "react";

export function TimeDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time only on the client to avoid hydration mismatch
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="text-sm font-medium text-muted-foreground invisible">00:00:00</div>;
  }

  const hours = time.toLocaleTimeString([], { hour: '2-digit', hour12: false });
  const minutes = time.toLocaleTimeString([], { minute: '2-digit' });
  const seconds = time.toLocaleTimeString([], { second: '2-digit' });
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const formattedDate = time.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col items-end justify-center hidden md:flex border-l border-border pl-6 ml-2">
      <div className="flex items-center gap-1.5">
        <span className="text-primary animate-pulse">🕒</span>
        <div className="flex items-baseline gap-1 text-foreground font-mono tracking-tight bg-muted/30 px-2 py-0.5 rounded-md shadow-sm border border-border/50">
          <span className="text-[15px] font-bold">{hours}:{minutes}</span>
          <span className="text-[11px] font-semibold text-primary">{seconds}</span>
          <span className="text-[10px] font-bold text-muted-foreground ml-0.5">{ampm}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest mt-1 mr-1">{formattedDate}</span>
    </div>
  );
}
