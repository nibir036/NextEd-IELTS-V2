'use client';

import { useCallback, useEffect, useState } from 'react';

function storageKey(skill: string) {
  return `tips-saved-lessons:${skill}`;
}

function readSaved(skill: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(skill));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Per-skill saved/bookmarked lesson slugs, persisted to localStorage
 * (no backend concept of "saved lessons" exists yet). Re-reads on
 * `skill` change so switching skills doesn't carry over a stale set.
 */
export function useSavedLessons(skill: string) {
  const [saved, setSaved] = useState<Set<string>>(() => readSaved(skill));

  useEffect(() => {
    setSaved(readSaved(skill));
  }, [skill]);

  const toggle = useCallback(
    (lessonSlug: string) => {
      setSaved((prev) => {
        const next = new Set(prev);
        if (next.has(lessonSlug)) next.delete(lessonSlug);
        else next.add(lessonSlug);
        try {
          window.localStorage.setItem(storageKey(skill), JSON.stringify(Array.from(next)));
        } catch {
          // localStorage unavailable (private browsing, quota) -- the
          // in-memory state still updates for this session.
        }
        return next;
      });
    },
    [skill],
  );

  return { saved, toggle };
}
