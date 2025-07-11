import type { ChecklistItem } from "../types/schema";

export function calculateProgress(items: ChecklistItem[]): number {
  if (!items || items.length === 0) return 0;
  const completedItems = items.filter(item => item.status === "completed").length;
  return Math.round((completedItems / items.length) * 100);
} 