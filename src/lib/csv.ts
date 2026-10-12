/** 极简 CSV 解析：适用于仓库 data/processed 下不带引号转义的规范 CSV */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}

export function num(v: string | undefined): number {
  const n = parseFloat(v ?? '');
  return Number.isFinite(n) ? n : 0;
}

/** 大数缩写：12.3万 / 1.2M */
export function fmtCompact(v: number, lang: 'zh' | 'en'): string {
  if (lang === 'zh') {
    if (v >= 1e8) return `${(v / 1e8).toFixed(2)}亿`;
    if (v >= 1e4) return `${(v / 1e4).toFixed(v >= 1e6 ? 0 : 1)}万`;
  } else {
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  }
  return v.toLocaleString();
}
