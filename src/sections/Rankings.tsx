import { useMemo, useState } from 'react';
import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import EChart from '@/components/EChart';
import contributors from '@/data/contributor-leaderboard.json';
import orgs from '@/data/organization-leaderboard.json';
import geo from '@/data/geographical-distribution.json';

interface LFXRow { name: string; code?: string; contributions?: number; percentage?: number; roles?: string[]; logo?: string; count?: number }
interface LFXResp<T> { data: T[]; meta?: { total?: number } }

export default function Rankings() {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<'people' | 'orgs'>('people');
  const [q, setQ] = useState('');

  const people = (contributors as LFXResp<LFXRow>).data;
  const orgRows = (orgs as LFXResp<LFXRow>).data;
  const total = (contributors as LFXResp<LFXRow>).meta?.total;

  const filtered = useMemo(() => {
    const src = tab === 'people' ? people : orgRows;
    const list = q ? src.filter(r => r.name.toLowerCase().includes(q.toLowerCase())) : src;
    return list.slice(0, 15);
  }, [tab, q, people, orgRows]);

  const geoOpt = useMemo(() => {
    const rows = (geo as LFXResp<LFXRow>).data.filter(r => r.code !== 'XX').slice(0, 10);
    return {
      grid: { left: 8, right: 40, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: cssVar('--chart-split') } } },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => r.name), axisLabel: { fontSize: 11 } },
      series: [{
        type: 'bar', data: rows.map(r => r.percentage), barWidth: 12,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: cssVar('--c2') }, { offset: 1, color: cssVar('--c1') }] },
        },
        label: { show: true, position: 'right' as const, formatter: '{c}%', fontSize: 10, color: cssVar('--muted') },
      }],
    };
  }, []);

  return (
    <section id="ch3" className="surf-alt py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5">
        <p className="gv-kicker">{lang === 'zh' ? '全球开源影响力排行 · GOSR' : 'Global Open Source Influence Ranking'}</p>
        <h2 className="text-3xl md:text-4xl font-black mt-3" style={{ color: '#f6fbff' }}>{pick(t.ch3.heading, lang)}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-[15px]" style={{ color: '#bad2de' }}>{pick(t.ch3.sub, lang)}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* 排行 */}
          <div className="lg:col-span-2 gv-panel !bg-transparent p-5" style={{ borderColor: '#3a657d' }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex rounded-full border p-0.5" style={{ borderColor: '#3a657d' }}>
                <button onClick={() => setTab('people')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'people' ? 'text-[#0a2c49]' : 'text-[#9ebdcc]'}`}
                  style={tab === 'people' ? { background: '#f2d15c' } : {}}>
                  {pick(t.ch3.contributors, lang)}
                </button>
                <button onClick={() => setTab('orgs')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'orgs' ? 'text-[#0a2c49]' : 'text-[#9ebdcc]'}`}
                  style={tab === 'orgs' ? { background: '#f2d15c' } : {}}>
                  {pick(t.ch3.orgs, lang)}
                </button>
              </div>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={pick(t.ch3.search, lang)}
                className="flex-1 min-w-[160px] rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                style={{ borderColor: '#3a657d', color: '#f6fbff' }} />
              <span className="text-xs" style={{ color: '#7fa3b5' }}>
                {pick(t.ch3.totalLabel, lang)}: <b style={{ color: '#f2d15c' }}>{total?.toLocaleString()}</b>
              </span>
            </div>
            <div className="overflow-x-auto dash-scroll">
              <table className="gv-table">
                <thead>
                  <tr>
                    <th>{pick(t.ch3.rank, lang)}</th><th>{pick(t.ch3.name, lang)}</th>
                    <th className="text-right">{pick(t.ch3.contributions, lang)}</th><th className="text-right">{pick(t.ch3.share, lang)}</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#f6fbff' }}>
                  {filtered.map((r, i) => (
                    <tr key={r.name}>
                      <td className="py-2.5">
                        <span className={`inline-grid place-items-center w-6 h-6 rounded-md text-[11px] font-black ${i < 3 ? 'border' : ''}`}
                          style={i < 3 ? { background: 'rgba(242,209,92,.15)', color: '#f2d15c', borderColor: 'rgba(242,209,92,.4)' } : { color: '#7fa3b5' }}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-medium">{r.name}</span>
                        {r.roles?.includes('maintainer') && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] border" style={{ background: 'rgba(103,213,219,.1)', color: '#67d5db', borderColor: 'rgba(103,213,219,.3)' }}>
                            {pick(t.ch3.maintainer, lang)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-semibold tabular-nums" style={{ color: '#a0c86c' }}>
                        {(r.contributions ?? r.count ?? 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,.1)' }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (r.percentage ?? 0) * 12)}%`, background: 'linear-gradient(90deg, #67d5db, #a0c86c)' }} />
                          </div>
                          <span className="text-xs tabular-nums w-12" style={{ color: '#9ebdcc' }}>{(r.percentage ?? 0).toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-sm" style={{ color: '#5d8296' }}>—</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[11px]" style={{ color: '#5d8296' }}>{pick(t.ch3.note, lang)}</p>
          </div>

          {/* 地理分布 */}
          <div className="gv-panel !bg-transparent p-5" style={{ borderColor: '#3a657d' }}>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#f6fbff' }}>{pick(t.ch3.geo, lang)}</h3>
            <p className="text-xs mb-2" style={{ color: '#7fa3b5' }}>Linux Kernel · LFX Insights</p>
            <EChart option={geoOpt} height={360} />
          </div>
        </div>
      </div>
    </section>
  );
}
