import { useState, useCallback } from "react";

const MAX_UPLOADS_PER_DAY = 20;

function getTodayKey() {
  return `upload_count_${new Date().toISOString().slice(0, 10)}`;
}

function getCount(): number {
  const key = getTodayKey();
  return parseInt(localStorage.getItem(key) || "0", 10);
}

export function useUploadLimit() {
  const [count, setCount] = useState(getCount);

  const remaining = Math.max(0, MAX_UPLOADS_PER_DAY - count);
  const canUpload = remaining > 0;

  const recordUpload = useCallback(() => {
    const key = getTodayKey();
    const newCount = getCount() + 1;
    localStorage.setItem(key, String(newCount));
    setCount(newCount);
  }, []);

  return { remaining, canUpload, recordUpload, count };
}
