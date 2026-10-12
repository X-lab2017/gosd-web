import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type SiteTheme = 'light' | 'dark';

interface ThemeCtx {
  theme: SiteTheme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} });

const STORAGE_KEY = 'gosd-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // 默认深色演示模式；浅色阅读模式通过导航栏手动切换
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  return <Ctx.Provider value={{ theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}

/** 读取当前 CSS 变量值（供 ECharts 等非 DOM 消费方使用） */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** ECharts 主题令牌：与 index.css 中的 --c1..--c8 / --chart-* 保持一致 */
export interface ChartTokens {
  series: string[];
  text: string;
  subtext: string;
  axis: string;
  split: string;
  tooltipBg: string;
  tooltipBorder: string;
  mapEmpty: string;
  /** 文字金（关键数字等文字强调）；--gold 仅作装饰/选中 */
  goldText: string;
  /** 装饰金（地图选中/hover 等填充描边场景） */
  goldDisplay: string;
  line: string;
  inRange: string[]; // 地图连续色带（浅 -> 深 / 暗 -> 亮）
}

export function chartTokens(): ChartTokens {
  const dark = document.documentElement.dataset.theme === 'dark';
  const series = ['--c1', '--c2', '--c3', '--c4', '--c5', '--c6', '--c7', '--c8'].map(cssVar);
  return {
    series,
    text: cssVar('--ink'),
    subtext: cssVar('--muted'),
    axis: cssVar('--chart-axis'),
    split: cssVar('--chart-split'),
    tooltipBg: cssVar('--surface'),
    tooltipBorder: cssVar('--line'),
    mapEmpty: cssVar('--map-empty'),
    goldText: cssVar('--gold-text'),
    goldDisplay: cssVar('--gold'),
    line: cssVar('--line'),
    inRange: dark
      ? ['#123750', '#1c5a7a', '#2a7d9c', '#3fa3b8', '#68c8cc', '#a0e6d8']
      : ['#dcebf2', '#bcd8e4', '#8fbfd3', '#5b9fbe', '#337fa6', '#156993'],
  };
}
