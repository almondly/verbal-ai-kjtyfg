
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SentenceRecord = {
  text: string;
  ids: string[];
  count: number;
  lastAt: number;
};

const AI_KEY = 'aac_ai_v1';

export function useAI() {
  const [records, setRecords] = useState<SentenceRecord[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(AI_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { records: SentenceRecord[]; todayCount: number; today: string };
          const todayStr = new Date().toDateString();
          if (parsed.today === todayStr) {
            setRecords(parsed.records || []);
            setTodayCount(parsed.todayCount || 0);
          } else {
            setRecords(parsed.records || []);
            setTodayCount(0);
          }
        }
      } catch (e) {
        console.log('AI load error', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          AI_KEY,
          JSON.stringify({ records, todayCount, today: new Date().toDateString() })
        );
      } catch (e) {
        console.log('AI save error', e);
      }
    })();
  }, [records, todayCount]);

  const recordSentence = useCallback((ids: string[], text: string) => {
    const now = Date.now();
    setRecords(prev => {
      const idx = prev.findIndex(r => r.text.toLowerCase() === text.toLowerCase());
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = { ...next[idx], count: next[idx].count + 1, lastAt: now };
      } else {
        next.push({ text, ids, count: 1, lastAt: now });
      }
      return next;
    });
    setTodayCount(c => c + 1);
  }, []);

  const suggestForPrefix = useCallback((prefixText: string) => {
    const prefix = prefixText.trim().toLowerCase();
    // Score by frequency and recency
    const decay = (t: number) => {
      const hours = (Date.now() - t) / (1000 * 60 * 60);
      return Math.exp(-hours / 72); // 3-day half-ish life
    };

    const scored = records
      .map(r => {
        const starts = prefix.length === 0 || r.text.toLowerCase().startsWith(prefix);
        const contains = prefix.length > 0 && r.text.toLowerCase().includes(prefix);
        const base = r.count * 1.0 + decay(r.lastAt) * 2.0;
        const bonus = starts ? 2 : contains ? 0.5 : 0;
        return { text: r.text, score: base + bonus };
      })
      .filter(x => x.score > 0 && (prefix.length === 0 || x.text.toLowerCase().includes(prefix)));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.text);
  }, [records]);

  const resetLearning = useCallback(() => {
    setRecords([]);
    setTodayCount(0);
  }, []);

  return {
    recordSentence,
    suggestForPrefix,
    dailySentenceCount: todayCount,
    resetLearning,
  };
}
