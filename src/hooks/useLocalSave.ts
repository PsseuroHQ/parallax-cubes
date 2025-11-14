/* ==============================
src/hooks/useLocalSave.ts v1.0.0
- Simple localStorage persistence
============================== */

import { useEffect } from 'react';


export const loadSave = <T,>(key: string, fallback: T): T => {
    try { const raw = localStorage.getItem(key); if (!raw) return fallback; return JSON.parse(raw) as T; }
    catch (e) { console.warn('Failed to load save', e); return fallback; }
};


export const saveToLocal = (key: string, data: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('Failed to save', e); }
};