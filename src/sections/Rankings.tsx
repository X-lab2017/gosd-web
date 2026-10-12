import { useMemo, useState } from 'react';
import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import EChart from '@/components/EChart';
import { parseCsv, num, fmtCompact } from '@/lib/csv';

import t301 from '@/data/ch3/table-3-0-1_gosr_top1_overview.csv?raw';
import t311 from '@/data/ch3/table-3-1-1_global_division_openrank_top30.csv?raw';
import t312 from '@/data/ch3/table-3-1-2_division_country_entry_counts.csv?raw';
import t313 from '@/data/ch3/table-3-1-3_china_province_openrank_top30.csv?raw';
import t314 from '@/data/ch3/table-3-1-4_china_city_openrank_top30.csv?raw';
import t321 from '@/data/ch3/table-3-2-1_global_company_openrank_top30.csv?raw';
import t322 from '@/data/ch3/table-3-2-2_china_company_openrank_top30.csv?raw';
import f321 from '@/data/ch3/fig-3-2-1_global_company_yearly_rank.csv?raw';
import f322 from '@/data/ch3/fig-3-2-2_global_company_monthly_rank.csv?raw';
import f323 from '@/data/ch3/fig-3-2-3_china_company_yearly_rank.csv?raw';
import f324 from '@/data/ch3/fig-3-2-4_china_company_monthly_rank.csv?raw';
import t331 from '@/data/ch3/table-3-3-1_global_foundation_openrank.csv?raw';
import f331 from '@/data/ch3/fig-3-3-1_foundation_monthly_rank.csv?raw';
import t341 from '@/data/ch3/table-3-4-1_global_project_openrank_top30.csv?raw';
import t342 from '@/data/ch3/table-3-4-2_project_country_distribution_top100.csv?raw';
import t343 from '@/data/ch3/table-3-4-3_china_project_openrank_top30.csv?raw';
import t344 from '@/data/ch3/table-3-4-4_china_project_rising.csv?raw';
import t351 from '@/data/ch3/table-3-5-1_new_repo_openrank_top30.csv?raw';
import t352 from '@/data/ch3/table-3-5-2_new_project_openrank_top30.csv?raw';
import t353 from '@/data/ch3/table-3-5-3_new_repo_domain_distribution.csv?raw';
import t354 from '@/data/ch3/table-3-5-4_new_repo_language_distribution.csv?raw';
import f361 from '@/data/ch3/fig-3-6-1_model_influence_top20.csv?raw';
import f362 from '@/data/ch3/fig-3-6-2_model_influence_country_publishers.csv?raw';
import f363 from '@/data/ch3/fig-3-6-3_model_influence_task_distribution.csv?raw';
import t361 from '@/data/ch3/table-3-6-1_model_series_versions.csv?raw';

/* ---------------- i18n ---------------- */

const T = {
  kicker: { zh: '第三章 · 全球开源影响力排行榜（GOSR）', en: 'Chapter 3 · Global Open Source Rankings (GOSR)' },
  sub: {
    zh: '围绕区域、企业、基金会、项目与新势力五个维度，基于 OpenRank 构建多层次、可比较的全球开源影响力坐标体系。统计周期 2025 年 7 月—2026 年 6 月，并用年度与月度排名追踪格局演化。',
    en: 'A multi-layer, comparable coordinate system of global open source influence built on OpenRank across five dimensions: region, company, foundation, project and emerging force. Statistical period: Jul 2025 – Jun 2026, with yearly and monthly ranking dynamics.',
  },
  tabs: {
    over: { zh: '总览', en: 'Overview' },
    r: { zh: '3.1 区域 R', en: '3.1 Region' },
    c: { zh: '3.2 企业 C', en: '3.2 Company' },
    f: { zh: '3.3 基金会 F', en: '3.3 Foundation' },
    p: { zh: '3.4 项目 P', en: '3.4 Project' },
    e: { zh: '3.5 新势力 E', en: '3.5 Emerging' },
    m: { zh: '3.6 大模型 M', en: '3.6 Model' },
  },
  findings: {
    over: {
      zh: '美国在区域、企业、基金会三个组织维度保持榜首，而中国已在项目与新势力两个创新维度登顶：OpenHarmony 以 2.6 倍优势蝉联全球项目榜首，开放原子基金会跻身全球前二，CANN 一年内完成从创立到新势力榜第一的跨越。',
      en: 'The US leads the organizational dimensions (region, company, foundation), while China now tops both innovation dimensions: OpenHarmony keeps the project #1 with a 2.6× lead, OpenAtom ranks global #2 among foundations, and CANN went from launch to emerging-force #1 within a year.',
    },
    r: {
      zh: '加州以 50,883.80 独居榜首，是第二名英格兰的 1.4 倍；美国 25 席入选 Top 100，印度从 3 席跃升至 12 席成为最大变量；北京（第 14）与上海（第 16）是中国仅有的两个全球前 20 区域，杭州超越深圳成为中国开源第三城。',
      en: 'California leads with 50,883.80 — 1.4× runner-up England. The US takes 25 Top-100 seats; India jumped from 3 to 12, the biggest shift this year. Beijing (#14) and Shanghai (#16) are China’s only global top-20 regions; Hangzhou overtook Shenzhen as China’s #3 city.',
    },
    c: {
      zh: '微软（167,060.26）与华为（141,253.65）差距收窄至约 2.6 万的历史最小值，全球企业开源进入中美双强时代；华为六年跃升 64 个位次成首家稳居全球前二的非美国企业；2026 年 3 月华为月度排名首次反超微软，Anthropic 冲入前五后回落。',
      en: 'Microsoft (167,060.26) and Huawei (141,253.65) are at a record-narrow ~26K gap — a US–China duopoly. Huawei climbed 64 positions in six years, the first non-US firm ever to hold global #2; it first overtook Microsoft in monthly rank in Mar 2026, while Anthropic spiked into top 5 then fell back.',
    },
    f: {
      zh: 'Linux 基金会家族（196,128.27）独居第一梯队，前三名合计占 Top 10 总和的 85.5%，头部集中度超过企业与项目榜；开放原子（99,965.35）稳居全球第 2，活跃开发者 23,173 名超过 Apache，中国基金会达到历史最高位次；头部三家全年位次零变化，治理信任构成最强护城河。',
      en: 'The Linux Foundation family (196,128.27) stands alone in tier 1; the top 3 hold 85.5% of the top-10 total — the most concentrated leaderboard. OpenAtom (99,965.35) holds global #2 with 23,173 active developers, surpassing Apache — a historic high for a Chinese foundation. The top 3 never changed rank all year: governance trust is the deepest moat.',
    },
    p: {
      zh: 'OpenHarmony 以 75,809.42 蝉联全球第一，是第二名 Azure 的 2.6 倍；PyTorch 升至第 4、vLLM 第 7，华为算力栈 CANN（第 13）与 Ascend（第 15）首次进入全球头部；中国 7 个项目位居 Top 100 第二，全部集中于基础软件与 AI 算力；跃升先锋全部为 AI 相关项目。',
      en: 'OpenHarmony keeps #1 with 75,809.42 — 2.6× runner-up Azure. PyTorch rose to #4, vLLM #7; Huawei’s CANN (#13) and Ascend (#15) entered the global head for the first time. China’s 7 top-100 projects, all in basic software & AI compute, rank second; every rising-star project is AI-related.',
    },
    e: {
      zh: '新势力最大特征是"有组织开源"崛起：openclaw 一年内冷启动登顶新仓库榜，CANN/昇腾系 16 个仓库集体上榜；新创立项目榜 CANN 居首（纳入 68 个仓库）；Top 30 新仓库中 AI 基础软件占 60%，Python 与 C++ 合计 90%，取代 TypeScript 成为新势力双核语言。',
      en: 'The defining feature is organized open source: openclaw cold-started to #1 of new repos within a year, while 16 CANN/Ascend repos made the list together. CANN tops new projects (68 repos). AI infrastructure takes 60% of top-30 new repos; Python + C++ account for 90%, replacing TypeScript as the dual-core languages.',
    },
    m: {
      zh: 'ModelRank 2026 年 8 月 Top 20 中，Qwen 系列占据 16 席，中国发布者主导多模态理解任务；文本生成占 55%。模型影响力榜单按当月归一化分值降序，分值是数值尺度而非百分比。',
      en: 'In the Aug 2026 ModelRank top 20, the Qwen family holds 16 seats and China-based publishers lead multimodal understanding; text generation accounts for 55%. Rankings use the month-normalized score (a numeric scale, not a percentage).',
    },
  },
  fig: {
    gYear: { zh: '全球企业开源影响力年度排名（2016—2026，名次越上越靠前）', en: 'Global company yearly rank (2016–2026, higher = better)' },
    gMonth: { zh: '全球企业月度排名（2025.07—2026.06）', en: 'Global company monthly rank (2025.07–2026.06)' },
    cYear: { zh: '中国企业开源影响力年度排名（2016—2026）', en: 'Chinese company yearly rank (2016–2026)' },
    cMonth: { zh: '中国企业月度排名（2025.07—2026.06）', en: 'Chinese company monthly rank' },
    fMonth: { zh: '头部基金会月度排名（2025.07—2026.06）', en: 'Top foundation monthly rank (2025.07–2026.06)' },
    entries: { zh: 'Top 100 各国入选行政区数量', en: 'Top-100 entries by country' },
    taskDist: { zh: 'Top 20 模型任务分布', en: 'Top-20 models by task' },
    pubCountry: { zh: 'Top 20 发布者国家与模型数', en: 'Top-20 publishers by country' },
    domain: { zh: '新仓库技术领域分布', en: 'New repos by domain' },
    language: { zh: '新仓库主要语言分布', en: 'New repos by language' },
  },
  th: {
    rank: { zh: '#', en: '#' },
    name: { zh: '名称', en: 'Name' },
    openrank: { zh: 'OpenRank', en: 'OpenRank' },
    dev: { zh: '活跃开发者', en: 'Active devs' },
    repos: { zh: '活跃仓库', en: 'Repos' },
    country: { zh: '国家/地区', en: 'Country' },
    initiator: { zh: '发起方', en: 'Initiator' },
    entries: { zh: '入选数', en: 'Entries' },
    representative: { zh: '代表性行政区', en: 'Representative divisions' },
    projects: { zh: '项目数', en: 'Projects' },
    province: { zh: '省份', en: 'Province' },
    city: { zh: '城市', en: 'City' },
    platform: { zh: '平台', en: 'Platform' },
    created: { zh: '创建时间', en: 'Created' },
    prev: { zh: '基期名次', en: 'Prev.' },
    delta: { zh: '变化', en: 'Δ' },
    repoCount: { zh: '仓库数', en: 'Repos' },
    models: { zh: '模型数', en: 'Models' },
    publisher: { zh: '发布者', en: 'Publisher' },
    task: { zh: '任务', en: 'Task' },
    series: { zh: '入榜系列', en: 'Series' },
    versions: { zh: '入榜版本', en: 'Ranked versions' },
    top1: { zh: '本期榜首', en: 'Top 1' },
    chinaBest: { zh: '中国最高位次', en: 'China best' },
    dimension: { zh: '维度', en: 'Dimension' },
  },
  note: {
    zh: '口径：OpenRank 协作网络影响力指标，统计周期 2025-07-01—2026-06-30；月度榜单为近 12 个月；大模型榜为 ModelRank v1（2026-08，OpenGauge × Hugging Face）。数据文件见报告仓库 data/processed/chapter3/。',
    en: 'Method: OpenRank collaboration-network influence, period 2025-07-01 to 2026-06-30; monthly boards cover the last 12 months; the model board uses ModelRank v1 (Aug 2026, OpenGauge × Hugging Face). Data files: data/processed/chapter3/ in the report repository.',
  },
} as const;

type TabKey = keyof typeof T.tabs;

/* ---------------- 通用 ---------------- */

function Panel({ t, s, children, wide, scroll }: { t: string; s?: string; children: React.ReactNode; wide?: boolean; scroll?: number }) {
  return (
    <div className={`gv-panel p-5 ${wide ? 'lg:col-span-2' : ''}`}>
      <h4 className="gv-panel-title">{t}</h4>
      {s && <p className="gv-panel-sub mt-0.5 mb-2">{s}</p>}
      <div className={scroll ? 'overflow-x-auto dash-scroll' : ''} style={scroll ? { maxHeight: scroll } : undefined}>
        {children}
      </div>
    </div>
  );
}

/** 排名折线：原始列转行，空值置 null，y 轴反转（第 1 名在顶部） */
function rankLines(csv: string) {
  const rows = parseCsv(csv);
  const keys = Object.keys(rows[0]).filter(k => k !== 'year' && k !== 'month');
  const x = rows.map(r => r.year ?? r.month);
  return {
    xAxis: { type: 'category', data: x, boundaryGap: false, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', inverse: true, min: 1, maxInterval: 4, axisLabel: { fontSize: 10 } },
    series: keys.map(k => ({
      name: k, type: 'line' as const, smooth: false, showSymbol: false, lineStyle: { width: 2 },
      data: rows.map(r => (r[k] === '' || r[k] === undefined ? null : num(r[k]))),
    })),
    legend: { top: 0 },
  };
}

function TopMark({ i }: { i: number }) {
  return (
    <span className={`inline-grid place-items-center w-6 h-6 rounded-md text-[11px] font-black ${i < 3 ? 'border' : ''}`}
      style={i < 3 ? { background: 'rgba(242,209,92,.15)', color: '#f2d15c', borderColor: 'rgba(242,209,92,.4)' } : { color: '#7fa3b5' }}>
      {i + 1}
    </span>
  );
}

/* ================= 主板块 ================= */

export default function Rankings() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabKey>('over');

  const overRows = useMemo(() => parseCsv(t301), []);
  const rGlobal = useMemo(() => parseCsv(t311), []);
  const rCountry = useMemo(() => parseCsv(t312), []);
  const rProvince = useMemo(() => parseCsv(t313), []);
  const rCity = useMemo(() => parseCsv(t314), []);
  const cGlobal = useMemo(() => parseCsv(t321), []);
  const cChina = useMemo(() => parseCsv(t322), []);
  const fRows = useMemo(() => parseCsv(t331), []);
  const pGlobal = useMemo(() => parseCsv(t341), []);
  const pCountry = useMemo(() => parseCsv(t342), []);
  const pChina = useMemo(() => parseCsv(t343), []);
  const pRising = useMemo(() => parseCsv(t344), []);
  const eRepo = useMemo(() => parseCsv(t351), []);
  const eProject = useMemo(() => parseCsv(t352), []);
  const eDomain = useMemo(() => parseCsv(t353), []);
  const eLang = useMemo(() => parseCsv(t354), []);
  const mTop = useMemo(() => parseCsv(f361), []);
  const mTask = useMemo(() => parseCsv(f363), []);
  const mSeries = useMemo(() => parseCsv(t361), []);

  const entriesOpt = useMemo(() => ({
    grid: { left: 8, right: 60, top: 8, bottom: 4, containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', inverse: true, data: rCountry.slice(0, 14).map(r => r.country_zh), axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 12, data: rCountry.slice(0, 14).map(r => num(r.entries_in_top100)),
      itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c2') },
      label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted') },
    }],
  }), [rCountry]);

  const taskOpt = useMemo(() => ({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['42%', '68%'], center: ['50%', '54%'],
      itemStyle: { borderColor: cssVar('--surface'), borderWidth: 2 },
      label: { fontSize: 11, color: cssVar('--ink'), formatter: '{b}\n{c} ({d}%)' },
      data: mTask.map(r => ({ name: r.task, value: num(r.models) })),
    }],
  }), [mTask]);

  const pubCountryOpt = useMemo(() => {
    const byCountry = new Map<string, number>();
    parseCsv(f362).forEach(r => byCountry.set(r.country, (byCountry.get(r.country) ?? 0) + num(r.models)));
    const arr = [...byCountry.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      grid: { left: 8, right: 60, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', inverse: true, data: arr.map(d => d[0]), axisLabel: { fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: 14, data: arr.map(d => d[1]),
        itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c3') },
        label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted') },
      }],
    };
  }, []);

  const domainOpt = useMemo(() => ({
    grid: { left: 8, right: 64, top: 8, bottom: 4, containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', inverse: true, data: eDomain.map(r => r.domain), axisLabel: { fontSize: 10, width: 150, overflow: 'truncate' } },
    series: [{
      type: 'bar', barWidth: 14, data: eDomain.map(r => num(r.share_pct.replace('%', ''))),
      itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c1') },
      label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted'), formatter: '{c}%' },
    }],
  }), [eDomain]);

  const langOpt = useMemo(() => ({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '66%'], center: ['50%', '54%'],
      itemStyle: { borderColor: cssVar('--surface'), borderWidth: 2 },
      label: { fontSize: 11, color: cssVar('--ink'), formatter: '{b}\n{c} ({d}%)' },
      data: eLang.map(r => ({ name: r.language, value: num(r.repo_count) })),
    }],
  }), [eLang]);

  return (
    <section id="ch3" className="surf-alt py-20 md:py-28 scroll-mt-16" style={{ background: 'var(--navy)' }}>
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

        {/* 总览 */}
        {tab === 'over' && (
          <div className="mt-6 grid gap-6">
            <Panel t={lang === 'zh' ? 'GOSR 五大榜单榜首与中国最高位次速览' : 'Top 1 of five leaderboards & China’s best rank'} s="table 3-1" wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr>
                    <th>{pick(T.th.dimension, lang)}</th><th>{pick(T.th.name, lang)}</th>
                    <th>{pick(T.th.top1, lang)}</th><th className="text-right">{pick(T.th.openrank, lang)}</th><th>{pick(T.th.chinaBest, lang)}</th>
                  </tr></thead>
                  <tbody>
                    {overRows.map(r => (
                      <tr key={r.dimension}>
                        <td className="font-semibold whitespace-nowrap">{r.dimension}</td>
                        <td className="text-xs">{r.leaderboard}</td>
                        <td>{r.top1}</td>
                        <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.top1_openrank).toLocaleString()}</td>
                        <td className="text-xs">{r.china_best_rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel t={pick(T.fig.gYear, lang)} s="fig 3-2" wide><EChart option={rankLines(f321)} height={340} /></Panel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['2.6×', lang === 'zh' ? 'OpenHarmony 榜首领先倍数' : 'OpenHarmony lead over #2'],
                ['12 席', lang === 'zh' ? '印度 Top 100 入选数（上年 3 席）' : 'India Top-100 entries (3 last year)'],
                ['64 位', lang === 'zh' ? '华为六年跃升位次' : 'Huawei positions gained in 6y'],
                ['85.5%', lang === 'zh' ? '基金会榜前三名集中度' : 'Top-3 concentration (foundations)']].map(([v, l], i) => (
                <div key={i} className="gv-card !p-4">
                  <div className="gv-num text-2xl md:text-3xl">{v}</div>
                  <div className="text-xs mt-1 gv-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3.1 R */}
        {tab === 'r' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '全球行政区划影响力 Top 30' : 'Global divisions top 30'} s="table 3-2" scroll={440}>
              <table className="gv-table">
                <thead><tr>
                  <th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.country, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th>
                </tr></thead>
                <tbody>
                  {rGlobal.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{lang === 'zh' ? r.province_zh : r.province}</td>
                      <td className="text-xs">{lang === 'zh' ? r.country_zh : r.country}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.developer_count_10k).toFixed(1)}万</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={pick(T.fig.entries, lang)} s="table 3-3">
              <EChart option={entriesOpt} height={430} />
            </Panel>
            <Panel t={lang === 'zh' ? '中国省级行政区影响力 Top 30' : 'China provinces top 30'} s="table 3-4" scroll={360}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {rProvince.map((r, i) => (
                    <tr key={r.rank}><td><TopMark i={i} /></td><td>{r.province_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.developer_count_10k).toFixed(1)}万</td></tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={lang === 'zh' ? '中国城市级影响力 Top 30' : 'China cities top 30'} s="table 3-5" scroll={360}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.city, lang)}</th><th>{pick(T.th.province, lang)}</th><th className="text-right">{pick(T.th.openrank, lang)}</th></tr></thead>
                <tbody>
                  {rCity.map((r, i) => (
                    <tr key={r.rank}><td><TopMark i={i} /></td><td>{r.city}</td><td className="text-xs">{r.province_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        )}

        {/* 3.2 C */}
        {tab === 'c' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '全球开源企业影响力 Top 30' : 'Global companies top 30'} s="table 3-6" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.country, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.repos, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {cGlobal.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{lang === 'zh' ? r.company_zh : r.company}</td>
                      <td className="text-xs">{r.country_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{fmtCompact(num(r.active_repos), lang)}</td>
                      <td className="text-right tabular-nums">{fmtCompact(num(r.active_developers), lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={lang === 'zh' ? '中国开源企业影响力 Top 30' : 'Chinese companies top 30'} s="table 3-7" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.repos, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {cChina.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{lang === 'zh' ? r.company_zh : r.company}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{fmtCompact(num(r.active_repos), lang)}</td>
                      <td className="text-right tabular-nums">{fmtCompact(num(r.active_developers), lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={pick(T.fig.cYear, lang)} s="fig 3-4"><EChart option={rankLines(f323)} height={320} /></Panel>
            <Panel t={pick(T.fig.cMonth, lang)} s="fig 3-5"><EChart option={rankLines(f324)} height={320} /></Panel>
            <Panel t={pick(T.fig.gMonth, lang)} s="fig 3-3" wide><EChart option={rankLines(f322)} height={300} /></Panel>
          </div>
        )}

        {/* 3.3 F */}
        {tab === 'f' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '全球开源基金会影响力排行榜' : 'Global open source foundations'} s="table 3-8" scroll={400}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.country, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {fRows.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{lang === 'zh' ? r.foundation_zh : r.foundation}</td>
                      <td className="text-xs">{r.country_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.active_developers).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={pick(T.fig.fMonth, lang)} s="fig 3-6"><EChart option={rankLines(f331)} height={400} /></Panel>
          </div>
        )}

        {/* 3.4 P */}
        {tab === 'p' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '全球开源项目影响力 Top 30' : 'Global projects top 30'} s="table 3-9" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.initiator, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {pGlobal.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{r.project}</td>
                      <td className="text-xs">{r.initiator_zh} {r.country_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.active_developers).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <div className="grid gap-6">
              <Panel t={lang === 'zh' ? 'Top 100 项目发起国家/地区分布' : 'Top-100 projects by origin country'} s="table 3-10" scroll={320}>
                <table className="gv-table">
                  <thead><tr><th>{pick(T.th.country, lang)}</th><th className="text-right">{pick(T.th.projects, lang)}</th><th>{pick(T.th.representative, lang)}</th></tr></thead>
                  <tbody>
                    {pCountry.map((r, i) => (
                      <tr key={i}><td>{r.country_zh}</td>
                        <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{r.projects_in_top100}</td>
                        <td className="text-xs">{r.representative_projects}</td></tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
              <Panel t={lang === 'zh' ? '中国项目跃升先锋榜' : 'China rising projects'} s="table 3-12">
                <table className="gv-table">
                  <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th className="text-right">{pick(T.th.prev, lang)}</th>
                    <th className="text-right">{pick(T.th.delta, lang)}</th><th className="text-right">{pick(T.th.openrank, lang)}</th></tr></thead>
                  <tbody>
                    {pRising.map(r => (
                      <tr key={r.rank}>
                        <td className="gv-num">{r.rank}</td>
                        <td className="font-medium">{r.project} <span className="text-[10px] gv-muted">{r.initiator_zh}</span></td>
                        <td className="text-right text-xs">{r.prev_rank}</td>
                        <td className="text-right text-xs" style={{ color: '#a0c86c' }}>{r.rank_delta}</td>
                        <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            </div>
            <Panel t={lang === 'zh' ? '中国开源项目影响力 Top 30' : 'Chinese projects top 30'} s="table 3-11" wide scroll={400}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.initiator, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th></tr></thead>
                <tbody>
                  {pChina.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium">{r.project}</td>
                      <td className="text-xs">{r.initiator_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.active_developers).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        )}

        {/* 3.5 E */}
        {tab === 'e' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? '本年新创建仓库 Top 30' : 'New repos top 30'} s="table 3-13" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.platform, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.dev, lang)}</th><th>{pick(T.th.created, lang)}</th></tr></thead>
                <tbody>
                  {eRepo.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium text-xs">{r.repo}</td>
                      <td className="text-xs">{r.platform}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{num(r.active_developers).toLocaleString()}</td>
                      <td className="text-xs">{r.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={lang === 'zh' ? '本年新创立项目 Top 30' : 'New projects top 30'} s="table 3-14" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.initiator, lang)}</th>
                  <th className="text-right">{pick(T.th.openrank, lang)}</th><th className="text-right">{pick(T.th.repoCount, lang)}</th></tr></thead>
                <tbody>
                  {eProject.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium text-xs">{r.project} <span className="gv-muted">{r.country_zh}</span></td>
                      <td className="text-[10px]">{r.initiator_zh}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{num(r.openrank).toLocaleString()}</td>
                      <td className="text-right tabular-nums">{r.repo_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel t={pick(T.fig.domain, lang)} s="table 3-15"><EChart option={domainOpt} height={260} /></Panel>
            <Panel t={pick(T.fig.language, lang)} s="table 3-16"><EChart option={langOpt} height={260} /></Panel>
          </div>
        )}

        {/* 3.6 M */}
        {tab === 'm' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={lang === 'zh' ? 'ModelRank 模型影响力 Top 20（2026-08）' : 'ModelRank top 20 (Aug 2026)'} s="fig 3-6-1" scroll={440}>
              <table className="gv-table">
                <thead><tr><th>{pick(T.th.rank, lang)}</th><th>{pick(T.th.name, lang)}</th><th>{pick(T.th.publisher, lang)}</th>
                  <th>{pick(T.th.country, lang)}</th><th className="text-right">{pick(T.th.openrank, lang)}</th></tr></thead>
                <tbody>
                  {mTop.map((r, i) => (
                    <tr key={r.rank}>
                      <td><TopMark i={i} /></td>
                      <td className="font-medium text-xs">{r.model_id}</td>
                      <td className="text-xs">{r.publisher}</td>
                      <td className="text-xs">{r.country}</td>
                      <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{Math.round(num(r.modelrank_value)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <div className="grid gap-6">
              <Panel t={pick(T.fig.taskDist, lang)} s="fig 3-6-3"><EChart option={taskOpt} height={230} /></Panel>
              <Panel t={pick(T.fig.pubCountry, lang)} s="fig 3-6-2"><EChart option={pubCountryOpt} height={250} /></Panel>
            </div>
            <Panel t={lang === 'zh' ? 'Qwen / Llama 入榜系列与版本' : 'Ranked Qwen / Llama series & versions'} s="table 3-6-1" wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr><th>{pick(T.th.series, lang)}</th><th className="text-right">{pick(T.th.models, lang)}</th><th>{pick(T.th.versions, lang)}</th></tr></thead>
                  <tbody>
                    {mSeries.map((r, i) => (
                      <tr key={i}><td className="font-semibold">{r.model_series}</td>
                        <td className="text-right tabular-nums" style={{ color: '#f2d15c' }}>{r.models}</td>
                        <td className="text-xs">{r.ranked_versions}</td></tr>
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
