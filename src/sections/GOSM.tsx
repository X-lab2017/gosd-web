import { useMemo, useState } from 'react';
import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import EChart from '@/components/EChart';
import GeoMap, { type MapDatum } from '@/components/GeoMap';
import { parseCsv, num, fmtCompact } from '@/lib/csv';

import f511 from '@/data/ch5/fig-5-1-1_hf_cumulative_models_publishers.csv?raw';
import f512 from '@/data/ch5/fig-5-1-2_country_model_contribution.csv?raw';
import f513 from '@/data/ch5/fig-5-1-3_country_monthly_new_models.csv?raw';
import f521 from '@/data/ch5/fig-5-2-1_hf_cumulative_derivation.csv?raw';
import f522 from '@/data/ch5/fig-5-2-2_cross_country_derivation_flows.csv?raw';
import f523 from '@/data/ch5/fig-5-2-3_modelrank_country_head_trend.csv?raw';
import f531 from '@/data/ch5/fig-5-3-1_openness_quadrants.csv?raw';
import f532 from '@/data/ch5/fig-5-3-2_openness_region_structure.csv?raw';
import f533 from '@/data/ch5/fig-5-3-3_openness_publisher_types.csv?raw';

/* ---------------- i18n ---------------- */

const T = {
  kicker: { zh: '第五章 · 全球开源大模型发展洞察（GOSM）', en: 'Chapter 5 · Global Open Source Model Insight (GOSM)' },
  sub: {
    zh: '聚焦大模型对开源生态的结构性冲击，从供给与贡献、网络与影响力、开源开放与分级体系三个视角，推动"开放"从二元概念走向光谱化、可度量的实践标准。数据基于 Hugging Face 与 OpenGauge（ModelRank v1）快照。',
    en: 'Focused on the structural impact of large models on the open source ecosystem — supply & contribution, network & influence, and openness grading — moving “openness” from a binary notion to a measurable spectrum. Data: Hugging Face & OpenGauge (ModelRank v1) snapshots.',
  },
  tabs: {
    s1: { zh: '5.1 供给与贡献', en: '5.1 Supply & Contribution' },
    s2: { zh: '5.2 网络与影响力', en: '5.2 Network & Influence' },
    s3: { zh: '5.3 开放与分级', en: '5.3 Openness Tiers' },
  },
  findings: {
    s1: {
      zh: '开源大模型供给持续高速扩张：Hugging Face 累计模型数从 2022-09 的 6.6 万增至 2025-09 的 193 万，发布者达 41.3 万。美国以 4.54 万个模型、74.1% 的下载份额保持领先；中国以 5,919 个模型位居第二，模型数、下载量与点赞量均保持快速增长，是增长最快的新兴供给力量。',
      en: 'Open-model supply keeps expanding fast: cumulative HF models grew from 66K (Sep 2022) to 1.93M (Sep 2025), with 413K publishers. The US leads with 45.4K models and a 74.1% download share; China ranks second with 5,919 models — the fastest-growing emerging supply force across models, downloads and likes.',
    },
    s2: {
      zh: '模型复用网络成为影响力的新载体：累计派生模型占全部模型的比例从 2022 年的 0.74% 升至 2025 年的 29.14%，基座—派生关系高度跨国化；ModelRank 头部榜单中美国保持领先，但中国在 Top 100 中的席位逐月稳步提升，模型生态衍生力正在重塑全球分工。',
      en: 'Model reuse networks become the new carrier of influence: the cumulative derived-model share rose from 0.74% (2022) to 29.14% (2025), with heavily cross-border base-derivation relations. The US still leads ModelRank heads, but China’s Top-100 seats keep rising month by month — derivativeness is reshaping the global division of labor.',
    },
    s3: {
      zh: '开放性呈光谱分布而非二元对立：在 870 个评估模型中，"低完整-高开放"占 55.5%，"双高"（高完整×高开放）仅 13.4%。中国样本的高开放比例达 84.9%，社区与非营利组织/高校的"双高"比例（30.0% / 42.6%）显著高于企业（9.7%）——建立全球统一的开放性分级标准，是平衡创新激励与可信治理的关键基础设施。',
      en: 'Openness is a spectrum, not binary: among 870 evaluated models, “low-completeness × high-openness” accounts for 55.5% while “double-high” (high completeness × high openness) is only 13.4%. China’s samples reach 84.9% high-openness; communities and non-profits/universities show double-high ratios (30.0% / 42.6%) far above enterprises (9.7%) — a global tiered openness standard is key infrastructure balancing innovation and trustworthy governance.',
    },
  },
  fig: {
    cum: { zh: 'Hugging Face 累计模型数与发布者数（各年 9 月 13 日快照回溯）', en: 'Cumulative HF models & publishers (Sep-13 snapshots)' },
    map: { zh: '国家模型贡献数量地图（已识别 52 国）', en: 'Models by country (52 identified)' },
    mapBar: { zh: '国家模型数 Top 10（含下载与点赞份额）', en: 'Top 10 countries by models (with download/like shares)' },
    monthly: { zh: '中、美、法、德月度新增模型数（2025.09—2026.08）', en: 'Monthly new models: CN / US / FR / DE' },
    deriv: { zh: '累计派生模型数及其占比（各年 9 月 13 日快照回溯）', en: 'Cumulative derived models & share' },
    flow: { zh: '跨国基座—派生流向桑基图（10,943 对可识别关系）', en: 'Cross-country base-derivation flows (10,943 pairs)' },
    head: { zh: 'ModelRank 头部榜单国家席位逐月变化（Top 100）', en: 'Country seats in ModelRank Top 100 by month' },
    quad: { zh: '完整性 × 开放性四象限分布（870 模型）', en: 'Completeness × openness quadrants (870 models)' },
    region: { zh: '五组区域的开放性结构', en: 'Openness structure by region group' },
    pub: { zh: '四类发布主体的开放表现', en: 'Openness by publisher type' },
  },
  th: {
    country: { zh: '国家', en: 'Country' },
    models: { zh: '模型数', en: 'Models' },
    downloads: { zh: '累计下载', en: 'Downloads' },
    dlShare: { zh: '下载份额', en: 'DL share' },
    likeShare: { zh: '点赞份额', en: 'Like share' },
    type: { zh: '发布主体', en: 'Publisher type' },
    n: { zh: '模型数', en: 'Models' },
    orgs: { zh: '机构数', en: 'Orgs' },
    highOpen: { zh: '高开放', en: 'High-open' },
    doubleHigh: { zh: '双高', en: 'Double-high' },
    doubleHighPct: { zh: '双高比例', en: 'Double-high %' },
  },
  note: {
    zh: '口径：Hugging Face / OpenGauge 快照（回溯至 2026-09-13 仍可见仓库）；地图仅映射已识别国家；5.3 使用既有 870 模型开放性评估（2026-09-14 提取，未重新评估），高完整=L3—L5、高开放=O2—O4。数据文件见报告仓库 data/processed/chapter5/。',
    en: 'Method: Hugging Face / OpenGauge snapshots (backtracked to repos visible on 2026-09-13); the map only plots identified countries; §5.3 uses the existing 870-model openness evaluation (extracted 2026-09-14, not re-evaluated), high completeness = L3–L5, high openness = O2–O4. Data files: data/processed/chapter5/.',
  },
} as const;

type TabKey = keyof typeof T.tabs;

function Panel({ t, s, children, wide }: { t: string; s?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`gv-panel p-5 ${wide ? 'lg:col-span-2' : ''}`}>
      <h4 className="gv-panel-title">{t}</h4>
      {s && <p className="gv-panel-sub mt-0.5 mb-2">{s}</p>}
      {children}
    </div>
  );
}

/* ================= 主板块 ================= */

export default function GOSM() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabKey>('s1');

  /* 5.1 */
  const cumOpt = useMemo(() => {
    const rows = parseCsv(f511);
    return {
      xAxis: { type: 'category', data: rows.map(r => r.date) },
      yAxis: [
        { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
        { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) }, splitLine: { show: false } },
      ],
      series: [
        { name: lang === 'zh' ? '累计模型数' : 'Models', type: 'bar', barWidth: 30, data: rows.map(r => num(r.models)), itemStyle: { borderRadius: [6, 6, 0, 0], color: cssVar('--c1') } },
        { name: lang === 'zh' ? '发布者数' : 'Publishers', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.6, color: cssVar('--gold') }, itemStyle: { color: cssVar('--gold') }, data: rows.map(r => num(r.publishers)) },
      ],
      legend: { top: 0 },
    };
  }, [lang]);

  const countryRows = useMemo(() => parseCsv(f512).filter(r => r.region_code), []);
  const modelMap = useMemo<MapDatum[]>(() => countryRows.map(r => ({ name: r.country, nameZh: r.country, value: num(r.models) })), [countryRows]);
  const countryBarOpt = useMemo(() => {
    const rows = [...countryRows].sort((a, b) => num(b.models) - num(a.models)).slice(0, 10);
    return {
      grid: { left: 8, right: 150, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => r.country), axisLabel: { fontSize: 11 } },
      series: [
        { name: pick(T.th.models, lang), type: 'bar', barWidth: 12, data: rows.map(r => num(r.models)), itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c2') }, label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted') } },
        { name: pick(T.th.dlShare, lang), type: 'bar', barWidth: 12, barGap: '-100%', z: -1, data: rows.map(r => num(r.downloads_all_time_known_share_pct)), itemStyle: { borderRadius: [0, 6, 6, 0], color: 'rgba(119,169,222,.35)' } },
      ],
      legend: { top: 0 },
    };
  }, [countryRows, lang]);

  const monthlyOpt = useMemo(() => {
    const rows = parseCsv(f513);
    const keys = Object.keys(rows[0]).filter(k => k !== 'month');
    const names: Record<string, { zh: string; en: string }> = { CN: { zh: '中国', en: 'China' }, US: { zh: '美国', en: 'US' }, FR: { zh: '法国', en: 'France' }, DE: { zh: '德国', en: 'Germany' } };
    return {
      xAxis: { type: 'category', data: rows.map(r => r.month), axisLabel: { fontSize: 10, interval: 1 } },
      yAxis: { type: 'value' },
      series: keys.map(k => ({ name: names[k]?.[lang] ?? k, type: 'line' as const, smooth: true, lineStyle: { width: 2.4 }, data: rows.map(r => num(r[k])) })),
      legend: { top: 0 },
    };
  }, [lang]);

  /* 5.2 */
  const derivOpt = useMemo(() => {
    const rows = parseCsv(f521);
    return {
      xAxis: { type: 'category', data: rows.map(r => r.date) },
      yAxis: [
        { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
        { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { show: false } },
      ],
      series: [
        { name: lang === 'zh' ? '累计派生模型' : 'Derived models', type: 'bar', barWidth: 30, data: rows.map(r => num(r.derived_models)), itemStyle: { borderRadius: [6, 6, 0, 0], color: cssVar('--c3') } },
        { name: lang === 'zh' ? '派生占比' : 'Derived %', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.6, color: cssVar('--gold') }, itemStyle: { color: cssVar('--gold') }, label: { show: true, fontSize: 10, color: cssVar('--gold-text'), formatter: '{c}%' }, data: rows.map(r => num(r.derived_pct)) },
      ],
      legend: { top: 0 },
    };
  }, [lang]);

  const sankeyOpt = useMemo(() => {
    const rows = parseCsv(f522);
    const nodes = Array.from(new Set(rows.flatMap(r => [r.source, r.target]))).map(n => ({ name: n }));
    return {
      series: [{
        type: 'sankey', left: 20, right: 90, top: 10, bottom: 10, nodeWidth: 12, nodeGap: 10,
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
        label: { fontSize: 11, color: cssVar('--ink') },
        data: nodes,
        links: rows.map(r => ({ source: r.source, target: r.target, value: num(r.weight) })),
      }],
    };
  }, []);

  const headOpt = useMemo(() => {
    const rows = parseCsv(f523).filter(r => r.k === '100');
    return {
      xAxis: { type: 'category', data: rows.map(r => r.month), axisLabel: { fontSize: 9, interval: 2 } },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}' } },
      series: [
        { name: lang === 'zh' ? '中国席位' : 'China', type: 'line', stack: 's', areaStyle: { opacity: 0.8 }, emphasis: { focus: 'series' as const }, data: rows.map(r => num(r.china)) },
        { name: lang === 'zh' ? '美国席位' : 'US', type: 'line', stack: 's', areaStyle: { opacity: 0.8 }, emphasis: { focus: 'series' as const }, data: rows.map(r => num(r.us)) },
        { name: lang === 'zh' ? '其他已知' : 'Other known', type: 'line', stack: 's', areaStyle: { opacity: 0.8 }, emphasis: { focus: 'series' as const }, data: rows.map(r => num(r.other_known)) },
        { name: lang === 'zh' ? '归属未知' : 'Unknown', type: 'line', stack: 's', areaStyle: { opacity: 0.6 }, emphasis: { focus: 'series' as const }, data: rows.map(r => num(r.unknown)) },
      ],
      legend: { top: 0 },
    };
  }, [lang]);

  /* 5.3 */
  const quadRows = useMemo(() => parseCsv(f531), []);
  const regionOpt = useMemo(() => {
    const rows = parseCsv(f532);
    return {
      grid: { left: 8, right: 16, top: 36, bottom: 4, containLabel: true },
      xAxis: { type: 'category', data: rows.map(r => r.group) },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
      series: [
        { name: lang === 'zh' ? '双高（高完整·高开放）' : 'Double-high', type: 'bar', stack: 's', barWidth: 40, data: rows.map(r => num(r['高完整-高开放']) / num(r.n) * 100), itemStyle: { color: cssVar('--gold') } },
        { name: lang === 'zh' ? '高完整·低开放' : 'High C · Low O', type: 'bar', stack: 's', data: rows.map(r => num(r['高完整-低开放']) / num(r.n) * 100), itemStyle: { color: cssVar('--c3') } },
        { name: lang === 'zh' ? '低完整·高开放' : 'Low C · High O', type: 'bar', stack: 's', data: rows.map(r => num(r['低完整-高开放']) / num(r.n) * 100), itemStyle: { color: cssVar('--c2') } },
        { name: lang === 'zh' ? '双低' : 'Double-low', type: 'bar', stack: 's', data: rows.map(r => num(r['低完整-低开放']) / num(r.n) * 100), itemStyle: { color: 'rgba(143,169,187,.4)' } },
      ],
      legend: { top: 0 },
    };
  }, [lang]);
  const pubRows = useMemo(() => parseCsv(f533), []);

  const quadColor = (c: string, o: string) => (c === '高完整' ? (o === '高开放' ? 'var(--gold)' : 'var(--c3)') : (o === '高开放' ? 'var(--c2)' : 'rgba(143,169,187,.4)'));

  return (
    <section id="ch5" className="surf-alt py-20 md:py-28 scroll-mt-16" style={{ background: 'var(--navy)' }}>
      <div className="mx-auto max-w-7xl px-5">
        <p className="gv-kicker">{pick(T.kicker, lang)}</p>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 gv-sub">{pick(T.sub, lang)}</p>

        <div className="mt-8 flex gap-2 overflow-x-auto dash-scroll pb-1" role="tablist">
          {(Object.keys(T.tabs) as TabKey[]).map(k => (
            <button key={k} role="tab" aria-selected={tab === k} className="gv-tab" onClick={() => setTab(k)}>
              {pick(T.tabs[k], lang)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[#f2d15c]/30 bg-[#f2d15c]/5 px-5 py-4 text-sm leading-7 text-[#efe3b0]">
          ★ {pick(T.findings[tab], lang)}
        </div>

        {/* 5.1 */}
        {tab === 's1' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.cum, lang)} s="fig 5-2（5.1-1）" wide><EChart option={cumOpt} height={300} /></Panel>
            <Panel t={pick(T.fig.map, lang)} s="fig 5-3（5.1-2）">
              <GeoMap map="world" data={modelMap} height={380} unit={lang === 'zh' ? '模型数' : 'models'} />
            </Panel>
            <Panel t={pick(T.fig.mapBar, lang)} s="fig 5-3（5.1-2）">
              <EChart option={countryBarOpt} height={380} />
              <p className="mt-2 text-[11px] gv-panel-sub">{lang === 'zh' ? '浅色条为已识别国家内下载份额（%），深色条为模型数。' : 'Light bars: download share among identified countries (%); dark bars: model count.'}</p>
            </Panel>
            <Panel t={pick(T.fig.monthly, lang)} s="fig 5-4（5.1-3）" wide><EChart option={monthlyOpt} height={300} /></Panel>
          </div>
        )}

        {/* 5.2 */}
        {tab === 's2' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.deriv, lang)} s="fig 5-5（5.2-1）"><EChart option={derivOpt} height={330} /></Panel>
            <Panel t={pick(T.fig.head, lang)} s="fig 5-7（5.2-3）"><EChart option={headOpt} height={330} /></Panel>
            <Panel t={pick(T.fig.flow, lang)} s="fig 5-6（5.2-2）" wide><EChart option={sankeyOpt} height={380} /></Panel>
          </div>
        )}

        {/* 5.3 */}
        {tab === 's3' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.quad, lang)} s="fig 5-8（5.3-1）">
              <div className="grid grid-cols-2 gap-3">
                {quadRows.map((r, i) => (
                  <div key={i} className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'color-mix(in srgb, var(--surface) 70%, transparent)' }}>
                    <div className="text-[11px] font-bold tracking-wide gv-muted">{r.completeness} × {r.openness}</div>
                    <div className="mt-1 text-3xl font-black" style={{ color: quadColor(r.completeness, r.openness) }}>{r.models}</div>
                    <div className="text-xs gv-muted">{num(r.share_pct).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel t={pick(T.fig.region, lang)} s="fig 5-9（5.3-2）"><EChart option={regionOpt} height={300} /></Panel>
            <Panel t={pick(T.fig.pub, lang)} s="fig 5-10（5.3-3）" wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr>
                    <th>{pick(T.th.type, lang)}</th><th className="text-right">{pick(T.th.n, lang)}</th><th className="text-right">{pick(T.th.orgs, lang)}</th>
                    <th className="text-right">{pick(T.th.highOpen, lang)}</th><th className="text-right">{pick(T.th.doubleHigh, lang)}</th><th className="text-right">{pick(T.th.doubleHighPct, lang)}</th>
                  </tr></thead>
                  <tbody>
                    {pubRows.map((r, i) => (
                      <tr key={i}>
                        <td className="font-semibold">{r.publisher_type}</td>
                        <td className="text-right tabular-nums">{r.models}</td>
                        <td className="text-right tabular-nums">{r.organizations}</td>
                        <td className="text-right tabular-nums">{r.high_open}</td>
                        <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{r.double_high}</td>
                        <td className="text-right tabular-nums">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,.1)' }}>
                              <div className="h-full rounded-full" style={{ width: `${Math.min(100, num(r.double_high_pct))}%`, background: 'var(--gold)' }} />
                            </div>
                            {num(r.double_high_pct).toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        <p className="mt-8 text-xs gv-muted">{pick(T.note, lang)}</p>
      </div>
    </section>
  );
}
