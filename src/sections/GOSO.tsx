import { useMemo, useState } from 'react';
import EChart from '@/components/EChart';
import GeoMap, { type MapDatum } from '@/components/GeoMap';
import { chartTokens, cssVar } from '@/theme';
import { parseCsv, num, fmtCompact } from '@/lib/csv';
import { useLang, pick } from '@/i18n';

import worldDev from '@/data/os/world-developers.json';
import worldCon from '@/data/os/world-contribution.json';
import worldInf from '@/data/os/world-influence.json';
import cnDev from '@/data/os/CN-developers.json';
import cnCon from '@/data/os/CN-contribution.json';
import cnInf from '@/data/os/CN-influence.json';

import fig212 from '@/data/ch2/fig-2-1-2_five_region_total_developers.csv?raw';
import fig213 from '@/data/ch2/fig-2-1-3_five_region_active_developers_trend.csv?raw';
import fig222 from '@/data/ch2/fig-2-2-2_five_region_openrank_contribution_trend.csv?raw';
import fig232 from '@/data/ch2/fig-2-3-2_five_region_project_openrank_influence_trend.csv?raw';
import fig241 from '@/data/ch2/fig-2-4-1_global_open_source_talent_map.csv?raw';
import fig242 from '@/data/ch2/fig-2-4-2_five_region_open_source_talent_trend.csv?raw';
import fig244 from '@/data/ch2/fig-2-4-4_china_top10_city_talent_trend.csv?raw';
import fig251 from '@/data/ch2/fig-2-5-1_country_contribution_share_trend.csv?raw';
import fig252 from '@/data/ch2/fig-2-5-2_cross_border_project_contribution_flow.csv?raw';
import fig261 from '@/data/ch2/fig-2-6-1_foundation_share_and_active_repositories.csv?raw';
import fig262 from '@/data/ch2/fig-2-6-2_active_repository_license_trend.csv?raw';
import fig263 from '@/data/ch2/fig-2-6-3_mulan_permissive_license_trend.csv?raw';
import fig271 from '@/data/ch2/fig-2-7-1_platform_active_repository_trend.csv?raw';
import tbl221 from '@/data/ch2/table-2-2-1_china_province_openrank_per_capita_top10.csv?raw';
import tbl241 from '@/data/ch2/table-2-4-1_china_city_talent_top10.csv?raw';
import tbl252 from '@/data/ch2/table-2-5-1_china_us_project_contribution_top10.csv?raw';

/* ---------------- i18n ---------------- */

const T = {
  kicker: { zh: '第二章 · 全球开源生态观测地图（GOSO）', en: 'Chapter 2 · Global Open Source Observatory (GOSO)' },
  sub: {
    zh: '围绕规模、质量与结构，通过活跃、贡献、影响力、人才、多样性、治理与资产七个维度，构建全球开源动态图谱。点击世界地图中的中国可下钻至省级视图。',
    en: 'Seven lenses — vitality, contribution, influence, talent, diversity, governance and assets — compose a living atlas of global open source. Click China on the world map to drill into provinces.',
  },
  back: { zh: '← 返回世界地图', en: '← Back to world map' },
  drillHint: { zh: '点击地图中的「中国」可下钻至省级分布', en: 'Click “China” on the map to drill down to provinces' },
  dataSrc: { zh: '数据来源：open-share.com（OpenDigger 开放数据）、报告 data/processed 快照，统计周期 2022—2026', en: 'Source: open-share.com (OpenDigger open data) & report data/processed snapshots, 2022–2026' },
  viewOn: { zh: '在 open-share 平台查看交互版', en: 'Interactive version on open-share' },
  tabs: {
    v: { zh: '2.1 活跃地图 V-Map', en: '2.1 Vitality Map' },
    c: { zh: '2.2 贡献地图 C-Map', en: '2.2 Contribution Map' },
    i: { zh: '2.3 影响力地图 I-Map', en: '2.3 Influence Map' },
    t: { zh: '2.4 人才地图 T-Map', en: '2.4 Talent Map' },
    d: { zh: '2.5 多样性地图 D-Map', en: '2.5 Diversity Map' },
    g: { zh: '2.6 治理与公益 G-Map', en: '2.6 Governance Map' },
    a: { zh: '2.7 资产地图 A-Map', en: '2.7 Asset Map' },
  },
  findings: {
    v: {
      zh: '全球开发者达 1.93 亿（+27.9%），活跃开发者 2890 万。美中欧构成第一梯队（3029.8万 / 3014.8万 / 2918.7万），中国活跃开发者增长 42.0%，与美国的差距收窄至约 10.6 万人。',
      en: 'Global developers reached 193M (+27.9%), with 28.9M active. The US, Europe and China form the first tier (30.30M / 30.15M / 29.19M). China’s active developers grew 42.0%, closing the gap with the US to ~106K.',
    },
    c: {
      zh: '欧洲 OpenRank 贡献度约 650 万居首；中国 442.9 万（+47.2%）超过美国 424.0 万，成为近五年全球贡献增长的主要推动力。浙江、台湾、上海人均贡献度领跑。',
      en: 'Europe leads OpenRank contribution (~6.50M); China reached 4.43M (+47.2%), surpassing the US (4.24M) as the main growth engine of the past five years. Zhejiang, Taiwan and Shanghai top per-capita contribution.',
    },
    i: {
      zh: '全球项目 OpenRank 影响力约 273.1 万（+8.5%）。美国与中国合计占 89.7% 形成双核心；中国项目影响力五年增长约 160%，鸿蒙、欧拉与开放原子基金会成为主要增长支撑。',
      en: 'Global project OpenRank influence hit ~2.73M (+8.5%). The US and China hold 89.7% combined; China’s project influence grew ~160% in five years, powered by OpenHarmony, openEuler and the OpenAtom Foundation.',
    },
    t: {
      zh: '全球开源人才（OpenRank 前 5%）约 35.0 万人（+7.9%）。欧洲 5.80 万、美国 3.50 万基础雄厚，中国 1.31 万增速居五域首位；北京、上海合计占全国已定位人才的 45.2%。',
      en: 'Global open-source talent (top 5% OpenRank) reached ~350K (+7.9%). Europe (58.0K) and the US (35.0K) remain deep; China (13.1K) grows fastest. Beijing and Shanghai hold 45.2% of China’s located talent.',
    },
    d: {
      zh: '前五大贡献国合计占比由 49.47% 降至 48.62%，贡献来源趋于多元。美国主导项目海外贡献占 61.72%，中国主导项目本土贡献占 79.22%，中美协作呈现明显不对称性。',
      en: 'The top-5 contributing countries fell from 49.47% to 48.62% share — sources are diversifying. US-led projects draw 61.72% overseas contribution vs 79.22% domestic for China-led ones: a marked asymmetry.',
    },
    g: {
      zh: '基金会活跃仓库增至 3350 个，项目 OpenRank 占比连续五年提升至 2.93%。MIT 与 Apache-2.0 稳居许可证前二，木兰宽松许可证活跃仓库五年增长超 13 倍。',
      en: 'Foundation-hosted active repos grew to 3,350, their OpenRank share rising for five straight years to 2.93%. MIT and Apache-2.0 remain the top licenses; Mulan permissive active repos grew 13× in five years.',
    },
    a: {
      zh: '主要平台累计活跃仓库超 6468 万；Hugging Face 上 63 国的 826 家发布单位共发布 7.23 万个模型、600 亿次下载。中国模型 6017 个（+50.4%），增速高于美国。',
      en: 'Cumulative active repos across platforms exceed 64.68M. On Hugging Face, 826 publishers from 63 countries released 72.3K models with 60B downloads. China’s 6,017 models grew +50.4%, faster than the US.',
    },
  },
  fig: {
    vTotal: { zh: '全球五域开发者总量（2026）', en: 'Five-region total developers (2026)' },
    vTrend: { zh: '五域活跃开发者趋势（2022–2026）', en: 'Active developers trend (2022–2026)' },
    cTrend: { zh: '五域 OpenRank 贡献度趋势', en: 'Five-region OpenRank contribution trend' },
    cPerCapita: { zh: '中国各省市人均 OpenRank 贡献度 Top 10', en: 'China per-capita OpenRank Top 10' },
    iTrend: { zh: '五域项目 OpenRank 影响力趋势', en: 'Five-region project influence trend' },
    tTrend: { zh: '五域开源人才趋势', en: 'Five-region talent trend' },
    tCityTrend: { zh: '中国 Top 10 城市人才趋势', en: 'China top-10 city talent trend' },
    tCityTop: { zh: '中国城市开源人才 Top 10', en: 'China city talent top 10' },
    dShare: { zh: '全球开源贡献结构趋向多元（2022–2026）', en: 'Contribution share by country (2022–2026)' },
    dSankey: { zh: '全球开源贡献流动桑基图', en: 'Cross-border contribution flow (Sankey)' },
    dDuel: { zh: '中美主导项目贡献来源结构（2026）', en: 'Contribution sources: China- vs US-led projects' },
    gFoundation: { zh: '基金会项目 OpenRank 占比与活跃仓库', en: 'Foundation OpenRank share & active repos' },
    gLicense: { zh: '活跃仓库 Top 5 许可证趋势', en: 'Top-5 license trend (active repos)' },
    gMulan: { zh: '木兰宽松许可证累计仓库与影响力', en: 'Mulan permissive: repos & influence' },
    aPlatform: { zh: '主要代码托管平台活跃仓库趋势', en: 'Active repositories by platform' },
  },
  th: {
    rank: { zh: '排名', en: '#' },
    region: { zh: '地区', en: 'Region' },
    perCapita: { zh: '人均贡献度', en: 'Per-capita' },
    openrank: { zh: 'OpenRank', en: 'OpenRank' },
    dev: { zh: '活跃开发者', en: 'Active devs' },
    city: { zh: '城市', en: 'City' },
    talent: { zh: '人才数', en: 'Talent' },
    province: { zh: '省份', en: 'Province' },
  },
  aCards: {
    gh: { zh: 'GitHub 累计活跃仓库（近十年）', en: 'GitHub cumulative active repos (10y)' },
    hfModel: { zh: 'Hugging Face 模型总量', en: 'HF models published' },
    hfDl: { zh: 'HF 模型累计下载', en: 'HF model downloads' },
    hfDs: { zh: 'HF 数据集总量', en: 'HF datasets published' },
    cnModel: { zh: '中国模型数量（占全球 8.3%）', en: 'China models (8.3% of world)' },
    cnDs: { zh: '中国数据集（占全球 10.9%）', en: 'China datasets (10.9% of world)' },
  },
} as const;

type TabKey = keyof typeof T.tabs;

/* ---------------- 数据装配 ---------------- */

interface LbRow { name: string; name_zh: string; value: number }
interface OsResp { leaderboards: { title_zh: string; data: LbRow[] }[] }

const REGION_EN: Record<string, string> = {
  Europe: 'Europe', China: 'China', 'United States': 'USA',
  India: 'India', 'Global South representatives': 'Global South',
};
const REGION_ZH: Record<string, string> = {
  Europe: '欧洲', China: '中国', 'United States': '美国',
  India: '印度', 'Global South representatives': '全球南方',
};

function countryMap(resp: OsResp, _lang: 'zh' | 'en'): MapDatum[] {
  // 世界地图 GeoJSON 的 name 为英文，匹配必须始终用英文 name；
  // 中文名仅用于 tooltip 展示（nameZh）。
  return resp.leaderboards[0].data.map(r => ({ name: r.name, nameZh: r.name_zh, value: r.value }));
}
function provinceMap(resp: OsResp): MapDatum[] {
  return resp.leaderboards[0].data.map(r => ({ name: r.name_zh, value: r.value }));
}

/* ---------------- 通用图配置 ---------------- */

function lineTrend(csv: string, lang: 'zh' | 'en', area = true) {
  const rows = parseCsv(csv);
  const keys = Object.keys(rows[0]).filter(k => k !== 'year');
  return {
    xAxis: { type: 'category', data: rows.map(r => r.year) },
    yAxis: { type: 'value', scale: true },
    series: keys.map((k, i) => ({
      name: lang === 'zh' ? (REGION_ZH[k] ?? k) : (REGION_EN[k] ?? k),
      type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.4 },
      ...(area ? { areaStyle: { opacity: 0.12 }, emphasis: { focus: 'series' as const } } : {}),
      z: 10 - i,
      data: rows.map(r => num(r[k])),
    })),
    legend: { top: 0 },
  };
}

/* ---------------- 子视图 ---------------- */

function WorldDrill({ world, cn, unit }: { world: MapDatum[]; cn: MapDatum[]; unit: { zh: string; en: string } }) {
  const { lang } = useLang();
  const [drill, setDrill] = useState(false);
  return (
    <div className="gv-panel p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="gv-panel-title">{drill ? (lang === 'zh' ? '中国 · 省级分布' : 'China · by province') : (lang === 'zh' ? '全球分布' : 'Global distribution')}</h4>
          <p className="gv-panel-sub mt-0.5">{pick(T.drillHint, lang)}</p>
        </div>
        {drill && (
          <button className="gv-chip hover:border-[var(--brand)] cursor-pointer" onClick={() => setDrill(false)}>{pick(T.back, lang)}</button>
        )}
      </div>
      {drill
        ? <GeoMap map="CN" data={cn} height={400} unit={pick(unit, lang)} />
        : <GeoMap map="world" data={world} height={400} unit={pick(unit, lang)} onPick={name => { if (name === 'China') setDrill(true); }} />}
    </div>
  );
}

function Panel({ t, s, children, wide }: { t: string; s: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`gv-panel p-5 ${wide ? 'lg:col-span-2' : ''}`}>
      <h4 className="gv-panel-title">{t}</h4>
      <p className="gv-panel-sub mt-0.5 mb-2">{s}</p>
      {children}
    </div>
  );
}

/* ================= 主板块 ================= */

export default function GOSO() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabKey>('v');
  const tokens = chartTokens();

  const devMap = useMemo(() => countryMap(worldDev as unknown as OsResp, lang), [lang]);
  const conMap = useMemo(() => countryMap(worldCon as unknown as OsResp, lang), [lang]);
  const infMap = useMemo(() => countryMap(worldInf as unknown as OsResp, lang), [lang]);
  const talentMap = useMemo<MapDatum[]>(() => parseCsv(fig241).map(r => ({ name: r.region_name, value: num(r.talent_count) })), []);

  const vTotalOpt = useMemo(() => {
    const rows = parseCsv(fig212);
    return {
      xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => lang === 'zh' ? r.region_zh : r.region) },
      series: [{ type: 'bar', data: rows.map(r => num(r.developers)), barWidth: 16, itemStyle: { borderRadius: [0, 8, 8, 0], color: cssVar('--c2') }, label: { show: true, position: 'right' as const, formatter: (p: { value: number }) => fmtCompact(p.value, lang), fontSize: 11, color: tokens.subtext } }],
      grid: { left: 8, right: 70, top: 10, bottom: 4, containLabel: true },
    };
  }, [lang]);

  const perCapitaRows = useMemo(() => parseCsv(tbl221), []);
  const talentTopRows = useMemo(() => parseCsv(tbl241), []);
  const mulanOpt = useMemo(() => {
    const rows = parseCsv(fig263);
    return {
      xAxis: { type: 'category', data: rows.map(r => r.year) },
      yAxis: [
        { type: 'value', name: lang === 'zh' ? '仓库' : 'Repos' },
        { type: 'value', name: 'OpenRank', splitLine: { show: false } },
      ],
      series: [
        { name: lang === 'zh' ? '累计活跃仓库' : 'Cumulative repos', type: 'bar', data: rows.map(r => num(r.cumulative_active_repositories)), barWidth: 18, itemStyle: { borderRadius: [6, 6, 0, 0], color: cssVar('--c2') } },
        { name: lang === 'zh' ? '项目影响力' : 'Influence', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.6, color: cssVar('--gold') }, itemStyle: { color: cssVar('--gold') }, data: rows.map(r => num(r.project_openrank_influence)) },
      ],
      legend: { top: 0 },
    };
  }, [lang]);

  const foundationOpt = useMemo(() => {
    const rows = parseCsv(fig261);
    return {
      xAxis: { type: 'category', data: rows.map(r => r.year) },
      yAxis: [
        { type: 'value', name: lang === 'zh' ? '活跃仓库' : 'Repos' },
        { type: 'value', name: '%', min: 0, max: 4, splitLine: { show: false } },
      ],
      series: [
        { name: lang === 'zh' ? '基金会活跃仓库' : 'Foundation repos', type: 'bar', data: rows.map(r => num(r.active_repositories)), barWidth: 22, itemStyle: { borderRadius: [6, 6, 0, 0], color: cssVar('--c3') } },
        { name: lang === 'zh' ? 'OpenRank 占比 %' : 'OpenRank share %', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.6, color: cssVar('--gold') }, itemStyle: { color: cssVar('--gold') }, label: { show: true, fontSize: 10, color: cssVar('--gold') }, data: rows.map(r => num(r.foundation_project_openrank_share_pct)) },
      ],
      legend: { top: 0 },
    };
  }, [lang]);

  const licenseOpt = useMemo(() => {
    const rows = parseCsv(fig262);
    const keys = Object.keys(rows[0]).filter(k => k !== 'year');
    return {
      xAxis: { type: 'category', data: rows.map(r => r.year) },
      yAxis: { type: 'value', scale: true },
      series: keys.map(k => ({ name: k, type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.2 }, data: rows.map(r => num(r[k])) })),
      legend: { top: 0 },
    };
  }, []);

  const sankeyOpt = useMemo(() => {
    const rows = parseCsv(fig252);
    const nodes = Array.from(new Set(rows.flatMap(r => [r.source, r.target]))).map(n => ({ name: n }));
    return {
      series: [{
        type: 'sankey', left: 20, right: 90, top: 10, bottom: 10,
        nodeWidth: 12, nodeGap: 10,
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
        label: { fontSize: 11, color: cssVar('--ink') },
        data: nodes,
        links: rows.map(r => ({ source: r.source, target: r.target, value: num(r.weight) })),
      }],
    };
  }, []);

  const platformOpt = useMemo(() => {
    const rows = parseCsv(fig271);
    const keys = Object.keys(rows[0]).filter(k => k !== 'year');
    return {
      xAxis: { type: 'category', data: rows.map(r => r.year) },
      yAxis: { type: 'value', scale: true, axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
      series: keys.map(k => ({ name: k, type: 'line', smooth: true, lineStyle: { width: 2.4 }, areaStyle: { opacity: 0.1 }, data: rows.map(r => num(r[k])) })),
      legend: { top: 0 },
    };
  }, [lang]);

  const aStat = (v: string, l: { zh: string; en: string }) => (
    <div className="gv-card !p-4">
      <div className="gv-num text-3xl">{v}</div>
      <div className="gv-panel-sub mt-1">{pick(l, lang)}</div>
    </div>
  );

  return (
    <section id="ch2" className="surf-alt py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5">
        <p className="gv-kicker">{pick(T.kicker, lang)}</p>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#bad2de]">{pick(T.sub, lang)}</p>

        {/* 小节切换 */}
        <div className="mt-8 flex gap-2 overflow-x-auto dash-scroll pb-1" role="tablist">
          {(Object.keys(T.tabs) as TabKey[]).map(k => (
            <button key={k} role="tab" aria-selected={tab === k} className="gv-tab" onClick={() => setTab(k)}>
              {pick(T.tabs[k], lang)}
            </button>
          ))}
        </div>

        {/* 核心发现 */}
        <div className="mt-6 rounded-xl border border-[#f2d15c]/30 bg-[#f2d15c]/5 px-5 py-4 text-sm leading-7 text-[#efe3b0]">
          ★ {pick(T.findings[tab], lang)}
        </div>

        {/* 2.1 V-Map */}
        {tab === 'v' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WorldDrill world={devMap} cn={provinceMap(cnDev as unknown as OsResp)} unit={{ zh: '开发者', en: 'developers' }} />
            <Panel t={pick(T.fig.vTotal, lang)} s="fig 2-1-2"><EChart option={vTotalOpt} height={180} /></Panel>
            <Panel t={pick(T.fig.vTrend, lang)} s="fig 2-1-3" wide><EChart option={lineTrend(fig213, lang)} height={300} /></Panel>
          </div>
        )}

        {/* 2.2 C-Map */}
        {tab === 'c' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WorldDrill world={conMap} cn={provinceMap(cnCon as unknown as OsResp)} unit={{ zh: 'OpenRank 贡献度', en: 'OpenRank' }} />
            <Panel t={pick(T.fig.cTrend, lang)} s="fig 2-2-2"><EChart option={lineTrend(fig222, lang)} height={320} /></Panel>
            <Panel t={pick(T.fig.cPerCapita, lang)} s="table 2-2-1" wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr>
                    <th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.region, lang)}</th>
                    <th>{pick(T.th.perCapita, lang)}</th><th>{pick(T.th.openrank, lang)}</th><th>{pick(T.th.dev, lang)}</th>
                  </tr></thead>
                  <tbody style={{ color: '#f6fbff' }}>
                    {perCapitaRows.map(r => (
                      <tr key={r.rank}>
                        <td className="gv-num">{r.rank}</td>
                        <td>{r.region}</td>
                        <td>{num(r.openrank_per_active_developer).toFixed(3)}</td>
                        <td>{Math.round(num(r.openrank)).toLocaleString()}</td>
                        <td>{Math.round(num(r.active_developers)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* 2.3 I-Map */}
        {tab === 'i' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WorldDrill world={infMap} cn={provinceMap(cnInf as unknown as OsResp)} unit={{ zh: '项目 OpenRank 影响力', en: 'Project OpenRank' }} />
            <Panel t={pick(T.fig.iTrend, lang)} s="fig 2-3-2"><EChart option={lineTrend(fig232, lang)} height={320} /></Panel>
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['89.7%', lang === 'zh' ? '美中项目影响力合计占比' : 'US+China share of influence'], ['+160%', lang === 'zh' ? '中国项目影响力五年增长' : 'China 5y influence growth'], ['273.1万', lang === 'zh' ? '全球项目 OpenRank 影响力' : 'Global project OpenRank'], ['+8.5%', lang === 'zh' ? '2026 同比增速' : '2026 YoY growth']].map(([v, l], i) => (
                <div key={i} className="gv-card !p-4" style={{ background: 'rgba(255,255,255,.04)', borderColor: '#3a657d' }}>
                  <div className="gv-num text-2xl md:text-3xl">{v}</div>
                  <div className="text-xs mt-1" style={{ color: '#9ebdcc' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.4 T-Map */}
        {tab === 't' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '全球开源人才地图（OpenRank 前 5%）' : 'Global open-source talent map (top 5% OpenRank)'} s="fig 2-4-1">
              <GeoMap map="world" data={talentMap} height={400} unit={lang === 'zh' ? '人才' : 'talent'} />
            </Panel>
            <Panel t={pick(T.fig.tTrend, lang)} s="fig 2-4-2"><EChart option={lineTrend(fig242, lang)} height={300} /></Panel>
            <Panel t={pick(T.fig.tCityTop, lang)} s="table 2-4-1">
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.city, lang)}</th><th>{pick(T.th.talent, lang)}</th><th>{pick(T.th.province, lang)}</th></tr></thead>
                <tbody style={{ color: '#f6fbff' }}>
                  {talentTopRows.map(r => (
                    <tr key={r.rank}><td className="gv-num">{r.rank}</td><td>{r.city}</td><td>{num(r.talent_count).toLocaleString()}</td><td>{r.province}</td></tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={pick(T.fig.tCityTrend, lang)} s="fig 2-4-4"><EChart option={((): Record<string, unknown> => {
              const rows = parseCsv(fig244);
              const keys = Object.keys(rows[0]).filter(k => k !== 'year');
              return { xAxis: { type: 'category', data: rows.map(r => r.year) }, yAxis: { type: 'value' }, legend: { top: 0 }, series: keys.map(k => ({ name: k, type: 'line', smooth: true, lineStyle: { width: 2.2 }, data: rows.map(r => num(r[k])) })) };
            })()} height={320} /></Panel>
          </div>
        )}

        {/* 2.5 D-Map */}
        {tab === 'd' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.dShare, lang)} s="fig 2-5-1" wide>
              <EChart option={((): Record<string, unknown> => {
                const rows = parseCsv(fig251);
                const keys = Object.keys(rows[0]).filter(k => k !== 'year');
                return {
                  xAxis: { type: 'category', data: rows.map(r => r.year), boundaryGap: false },
                  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
                  legend: { top: 0 },
                  series: keys.map((k, i) => ({
                    name: lang === 'zh' ? ({ 'United States': '美国', Germany: '德国', China: '中国', 'United Kingdom': '英国', India: '印度', 'Other countries': '其他国家' } as Record<string, string>)[k] ?? k : k,
                    type: 'line', stack: 's', smooth: true, showSymbol: false,
                    areaStyle: { opacity: 0.85 }, emphasis: { focus: 'series' as const },
                    lineStyle: { width: 1, color: '#0a2c49' },
                    data: rows.map(r => num(r[k])),
                    z: i,
                  })),
                };
              })()} height={340} />
            </Panel>
            <Panel t={pick(T.fig.dSankey, lang)} s="fig 2-5-2"><EChart option={sankeyOpt} height={340} /></Panel>
            <Panel t={pick(T.fig.dDuel, lang)} s="table 2-5-1" wide>
              <ChinaUsBars lang={lang} />
            </Panel>
          </div>
        )}

        {/* 2.6 G-Map */}
        {tab === 'g' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.gFoundation, lang)} s="fig 2-6-1"><EChart option={foundationOpt} height={320} /></Panel>
            <Panel t={pick(T.fig.gLicense, lang)} s="fig 2-6-2"><EChart option={licenseOpt} height={320} /></Panel>
            <Panel t={pick(T.fig.gMulan, lang)} s="fig 2-6-3" wide><EChart option={mulanOpt} height={320} /></Panel>
          </div>
        )}

        {/* 2.7 A-Map */}
        {tab === 'a' && (
          <div className="mt-6 grid gap-6">
            <Panel t={pick(T.fig.aPlatform, lang)} s="fig 2-7-1" wide><EChart option={platformOpt} height={320} /></Panel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {aStat('6468万+', T.aCards.gh)}
              {aStat('7.23万', T.aCards.hfModel)}
              {aStat('600亿', T.aCards.hfDl)}
              {aStat('1.23万', T.aCards.hfDs)}
              {aStat('6017', T.aCards.cnModel)}
              {aStat('1338', T.aCards.cnDs)}
            </div>
            <p className="text-xs" style={{ color: '#9ebdcc' }}>
              {lang === 'zh'
                ? '注：模型与数据集国家分布地图（图 2-7-2 / 2-7-3）基于 Hugging Face 发布数据，正式接入前以 open-share 平台交互视图为准。'
                : 'Note: model/dataset country maps (fig 2-7-2 / 2-7-3) are based on Hugging Face publisher data; pending final integration, see the interactive view on open-share.'}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: '#7fa3b5' }}>
          <span>{pick(T.dataSrc, lang)}</span>
          <a className="underline decoration-[#67d5db]/60 underline-offset-4 hover:text-[#f2d15c] transition-colors"
            href="https://open-share.com/insight/open-world/gosd" target="_blank" rel="noreferrer">
            {pick(T.viewOn, lang)} ↗
          </a>
        </div>
      </div>
    </section>
  );
}

/** 中美主导项目贡献来源堆叠条（table 2-5-1） */
function ChinaUsBars({ lang }: { lang: 'zh' | 'en' }) {
  const option = useMemo<Record<string, unknown>>(() => {
    // 列：project_country, rank, developer_country, openrank, share_pct
    const rows = parseCsv(tbl252);
    const countries = Array.from(new Set(rows.map(r => r.developer_country)));
    const projects = ['China', 'United States'];
    const nameMap: Record<string, { zh: string; en: string }> = {
      China: { zh: '中国', en: 'China' }, 'United States': { zh: '美国', en: 'United States' },
      Canada: { zh: '加拿大', en: 'Canada' }, Germany: { zh: '德国', en: 'Germany' },
      Singapore: { zh: '新加坡', en: 'Singapore' }, India: { zh: '印度', en: 'India' },
      'United Kingdom': { zh: '英国', en: 'UK' }, Japan: { zh: '日本', en: 'Japan' },
      France: { zh: '法国', en: 'France' }, Others: { zh: '其他', en: 'Others' },
    };
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number) => `${v}%` },
      legend: { top: 0 },
      xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      yAxis: {
        type: 'category', inverse: true,
        data: projects.map(p => (lang === 'zh' ? (p === 'China' ? '中国主导项目' : '美国主导项目') : (p === 'China' ? 'China-led projects' : 'US-led projects'))),
      },
      series: countries.map(c => ({
        name: nameMap[c]?.[lang] ?? c,
        type: 'bar', stack: 's', barWidth: 28,
        data: projects.map(p => num(rows.find(r => r.project_country === p && r.developer_country === c)?.share_pct)),
        emphasis: { focus: 'series' as const },
      })),
      grid: { left: 8, right: 20, top: 34, bottom: 4, containLabel: true },
    };
  }, [lang]);
  return <EChart option={option} height={300} />;
}
