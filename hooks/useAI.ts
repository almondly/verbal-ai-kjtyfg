
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SentenceRecord = {
  text: string;
  ids: string[];
  count: number;
  lastAt: number;
};

const AI_KEY = 'aac_ai_v1';

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

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

  // Build n-gram statistics on the fly (memoized)
  const ngramStats = useMemo(() => {
    const bigrams = new Map<string, Map<string, number>>();
    const trigrams = new Map<string, Map<string, number>>();
    const unigram = new Map<string, number>();
    const recencyBoost = (t: number) => {
      const hours = (Date.now() - t) / (1000 * 60 * 60);
      return Math.exp(-hours / 72); // 3-day half-ish life
    };

    for (const r of records) {
      const words = tokenize(r.text.toLowerCase());
      // accumulate unigrams
      for (const w of words) {
        unigram.set(w, (unigram.get(w) || 0) + r.count);
      }
      for (let i = 0; i < words.length - 1; i++) {
        const k = words[i];
        const nxt = words[i + 1];
        if (!bigrams.has(k)) bigrams.set(k, new Map());
        const m = bigrams.get(k)!;
        m.set(nxt, (m.get(nxt) || 0) + r.count + recencyBoost(r.lastAt));
      }
      for (let i = 0; i < words.length - 2; i++) {
        const k = `${words[i]} ${words[i + 1]}`;
        const nxt = words[i + 2];
        if (!trigrams.has(k)) trigrams.set(k, new Map());
        const m = trigrams.get(k)!;
        m.set(nxt, (m.get(nxt) || 0) + r.count + recencyBoost(r.lastAt) * 1.5);
      }
    }

    return { bigrams, trigrams, unigram };
  }, [records]);

  const suggestNextWords = useCallback((currentWords: string[], libraryWords: string[], max = 6) => {
    const words = currentWords.map(w => w.toLowerCase()).filter(Boolean);
    const last = words[words.length - 1];
    const last2 = words.slice(-2).join(' ');
    const { bigrams, trigrams, unigram } = ngramStats;

    const candidates = new Map<string, number>();

    // 1) Trigram suggestions
    if (words.length >= 2 && trigrams.has(last2)) {
      const m = trigrams.get(last2)!;
      for (const [w, s] of m.entries()) candidates.set(w, (candidates.get(w) || 0) + s + 4);
    }

    // 2) Bigram suggestions
    if (last && bigrams.has(last)) {
      const m = bigrams.get(last)!;
      for (const [w, s] of m.entries()) candidates.set(w, (candidates.get(w) || 0) + s + 2);
    }

    // 3) Fallback to common unigrams (overall frequent words)
    if (candidates.size < max) {
      const sortedUnigrams = Array.from(unigram.entries()).sort((a, b) => b[1] - a[1]);
      for (const [w, s] of sortedUnigrams) {
        if (!candidates.has(w)) candidates.set(w, s);
        if (candidates.size >= max) break;
      }
    }

    // 4) Blend in library words to ensure discoverability
    if (candidates.size < max) {
      for (const lw of libraryWords) {
        const lwLower = lw.toLowerCase();
        if (!candidates.has(lwLower)) candidates.set(lwLower, 0.1);
        if (candidates.size >= max) break;
      }
    }

    // Rank and return
    const ranked = Array.from(candidates.entries())
      .filter(([w]) => w && w !== '')
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([w]) => w);

    // Keep the original case if it's in the library; otherwise use lowercase (Apple-like).
    const librarySet = new Map<string, string>();
    for (const lw of libraryWords) librarySet.set(lw.toLowerCase(), lw);

    return ranked.map(w => librarySet.get(w) || w);
  }, [ngramStats]);

  const resetLearning = useCallback(() => {
    setRecords([]);
    setTodayCount(0);
  }, []);

  return {
    recordSentence,
    suggestNextWords,
    dailySentenceCount: todayCount,
    resetLearning,
  };
}
