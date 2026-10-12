import { useMemo, useState } from 'react';
import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import EChart from '@/components/EChart';
import { parseCsv, num, fmtCompact } from '@/lib/csv';

/* 4.1 Agentic AI */
import f411 from '@/data/ch4/fig-4-1-1_agentic_ai_landscape.csv?raw';
import f412 from '@/data/ch4/fig-4-1-2_agentic_ai_top10_monthly.csv?raw';
import f413 from '@/data/ch4/fig-4-1-3_agentic_ai_subfield_5y.csv?raw';
import f414 from '@/data/ch4/fig-4-1-4_agentic_ai_country_top3.csv?raw';
import f415 from '@/data/ch4/fig-4-1-5_agentic_ai_scatter_top12.csv?raw';
/* 4.2 AI 大模型 */
import f421 from '@/data/ch4/fig-4-2-1_model_landscape_recent_downloads.csv?raw';
import f422 from '@/data/ch4/fig-4-2-2_model_landscape_total_downloads.csv?raw';
import f423 from '@/data/ch4/fig-4-2-3_model_landscape_likes.csv?raw';
/* 4.3 Cloud */
import f431 from '@/data/ch4/fig-4-3-1_cloud_landscape.csv?raw';
import f432 from '@/data/ch4/fig-4-3-2_cloud_top5_5y.csv?raw';
import f433 from '@/data/ch4/fig-4-3-3_cloud_subfield_5y.csv?raw';
import f434 from '@/data/ch4/fig-4-3-4_cloud_country_top3.csv?raw';
import f435 from '@/data/ch4/fig-4-3-5_cloud_scatter_top12.csv?raw';
/* 4.4 Database */
import f441 from '@/data/ch4/fig-4-4-1_database_landscape.csv?raw';
import f442 from '@/data/ch4/fig-4-4-2_database_top5_5y.csv?raw';
import f443 from '@/data/ch4/fig-4-4-3_database_subfield_5y.csv?raw';
import f444 from '@/data/ch4/fig-4-4-4_database_country_top3.csv?raw';
import f445 from '@/data/ch4/fig-4-4-5_database_scatter_top12.csv?raw';
/* 4.5 RISC-V */
import f451 from '@/data/ch4/fig-4-5-1_riscv_landscape.csv?raw';
import f452 from '@/data/ch4/fig-4-5-2_riscv_top5_5y.csv?raw';
import f453 from '@/data/ch4/fig-4-5-3_riscv_subfield_5y.csv?raw';
import f454 from '@/data/ch4/fig-4-5-4_riscv_country_top3.csv?raw';
import f455 from '@/data/ch4/fig-4-5-5_riscv_scatter_top12.csv?raw';
/* 4.6 PyTorch */
import f461 from '@/data/ch4/fig-4-6-1_pytorch_landscape.csv?raw';
import f462 from '@/data/ch4/fig-4-6-2_pytorch_top5_5y.csv?raw';
import f463 from '@/data/ch4/fig-4-6-3_pytorch_subfield_5y.csv?raw';
import f464 from '@/data/ch4/fig-4-6-4_pytorch_country_top3.csv?raw';
import f465 from '@/data/ch4/fig-4-6-5_pytorch_scatter_top12.csv?raw';

/* ---------------- i18n ---------------- */

const T = {
  kicker: { zh: '第四章 · 全球开源技术全景洞察（GOSL）', en: 'Chapter 4 · Global Open Source Technology Landscape (GOSL)' },
  sub: {
    zh: '聚焦 Agentic AI、AI 大模型、云基础设施、数据库系统、RISC-V 与 PyTorch 六大代表领域，通过项目影响力、技术子类分布、国家贡献和年度变化，呈现全球开源技术生态"不同领域分化发展、同一领域内部结构重组"的格局。OpenRank 总量不视为市场份额或商业规模的直接比较。',
    en: 'Six domains — Agentic AI, LLMs, cloud infrastructure, databases, RISC-V and PyTorch — analyzed through project influence, subfield structure, country contribution and yearly change. OpenRank totals are not read as direct market-share or revenue comparisons.',
  },
  tabs: {
    a1: { zh: '4.1 Agentic AI', en: '4.1 Agentic AI' },
    a2: { zh: '4.2 AI 大模型', en: '4.2 LLMs' },
    a3: { zh: '4.3 云基础设施', en: '4.3 Cloud' },
    a4: { zh: '4.4 数据库系统', en: '4.4 Database' },
    a5: { zh: '4.5 RISC-V', en: '4.5 RISC-V' },
    a6: { zh: '4.6 PyTorch', en: '4.6 PyTorch' },
  },
  findings: {
    a1: {
      zh: '任务入口快速扩展与头部影响力频繁换位同时发生，生态尚未形成稳定格局：69 个核心项目分布于 12 个技术方向，Agentic Coding 占 37.6%，四类高频方向合计 75.0%；Landscape 月度 OpenRank 从 2025-07 的 5,659 升至 2026-03 的 8,413 后回落至 6 月的 4,748，OpenClaw 单月一度贡献 22.2%。2026 年贡献占五年累计的 60.3%，是六个 Landscape 中"最新"的领域。',
      en: 'Rapid entry expansion coexists with frequent head reshuffling — no stable pattern yet: 69 core projects across 12 directions; Agentic Coding holds 37.6% (top-4 directions 75.0%). Monthly OpenRank rose from 5,659 (Jul 2025) to 8,413 (Mar 2026), then fell to 4,748 (Jun); OpenClaw alone contributed 22.2% at peak. The 2026 share of the 5-year total is 60.3% — the “newest” of the six landscapes.',
    },
    a2: {
      zh: '开放模型生态呈多任务并行、模型系列化发展与发布者多元参与特征：不同任务领域头部格局差异明显——中国发布者在文本生成等方向的近期下载、历史下载与社区关注中表现突出，美国发布者在图像与视频、机器人等领域参与度高，巴西、法国、德国、英国等国的发布者在语音、图像生成等专业任务中形成各自优势。',
      en: 'The open-model ecosystem runs multi-task in parallel with serial model families and diverse publishers: China-based publishers stand out in recent/total downloads and likes of text-generation leaders; US publishers are strong in image-video and robotics; publishers from Brazil, France, Germany and the UK win niches in speech and image generation.',
    },
    a3: {
      zh: '整体影响力回落与底层工具链逆势增长并存：Landscape OpenRank 从 2022 年的 142,039 降至 2026 年的 90,028（-36.6%），但 WASM 工具链从 4,549 增至 19,124（约 4.2 倍），其中 LLVM 达 18,561，是 Grafana 的 4.4 倍。2026 年贡献仅占五年累计的 20.5%，是最偏存量的领域之一。',
      en: 'Overall influence fell while底层 toolchain grew: landscape OpenRank dropped from 142,039 (2022) to 90,028 (2026, -36.6%), yet the WASM toolchain grew ~4.2× to 19,124 — LLVM alone at 18,561, 4.4× Grafana. The 2026 share of the 5-year total is just 20.5% — among the most stock-driven domains.',
    },
    a4: {
      zh: '传统技术与新型技术共同调整：前六类传统数据库合计约占 89.9%，向量数据库 2026 年 OpenRank 为 3,398（约 3.5%）；前十项目合计从 2025 年的 27,013 降至 20,404（-24%），且没有一个主要子类在 2026 年保持增长——没有出现"新类别替代传统数据库"的明确证据，而是全生态调整。',
      en: 'Traditional and new technologies adjust together: the top-6 traditional types hold ~89.9%; vector DBs sit at 3,398 (3.5%). The top-10 total fell 24% to 20,404 and no major subfield grew in 2026 — no evidence of a new category replacing traditional databases; the whole ecosystem is adjusting.',
    },
    a5: {
      zh: '外围软件与应用方向开始扩展，但尚不足以改变以硬件实现和 ISA 规范为核心的结构：芯片实现与规范类合计占 70.2%；整体从 2025 年的 8,468.5 回落至 5,818.0，但应用方向从 62.0 增至 424.0（近 7 倍）；新增影响力更多出现在规范、验证、安全基础设施和应用项目，而非新的处理器核心。',
      en: 'Peripheral software and applications are expanding but haven’t changed the hardware/ISA-centric structure: chip implementations + specs hold 70.2%. The total fell from 8,468.5 (2025) to 5,818.0, yet applications grew ~7× to 424.0. New influence comes from specs, verification, security infrastructure and apps — not new CPU cores.',
    },
    a6: {
      zh: '核心框架影响力仍高度集中，但外围系统能力成为重要增量：83 个核心项目覆盖 13 个子类，训练类占 53.6%；训练类从 13,874 降至 9,423，而分布式训练从 1,033 增至 2,194 一年翻倍；外围项目 2026 年合计 OpenRank 达 122,684，已接近核心框架的 137,879（89%）。',
      en: 'Core-framework influence stays concentrated while peripheral systems become the growth engine: 83 core projects across 13 subfields, training at 53.6%. Training fell from 13,874 to 9,423 while distributed training doubled to 2,194; peripheral projects’ 2026 OpenRank hit 122,684 — 89% of the core framework’s 137,879.',
    },
  },
  insights: {
    a1: {
      zh: [
        '编码代理由美国明显领先（42,386），个人助手接近中美并列（美 10,815 / 中 10,583）；工作流构建、记忆知识与上下文、多代理编排等方向由中国贡献居前，记忆知识中国达 8,823。',
        'Claude Code、OpenClaw、Gemini CLI、OpenCode、Codex 的 2026 年贡献均达五年累计九成以上；LangChain 仅约 13%——头部换位背后是明显的近期开发者投入重新集中。',
      ],
      en: [
        'The US clearly leads coding agents (42,386); personal assistants are nearly tied (US 10,815 / CN 10,583). China leads workflow builders, memory & context (8,823) and multi-agent orchestration.',
        'Claude Code, OpenClaw, Gemini CLI, OpenCode and Codex all drew 90%+ of their 5-year contribution in 2026; LangChain only ~13% — the reshuffle reflects concentrated recent investment.',
      ],
    },
    a2: {
      zh: [
        '六个任务领域（文本、图像与视频、语音与音频、多模态、嵌入与检索、机器人）各取 Top 16：下载活跃度、历史积累与社区关注反映开放模型生态的不同侧面。',
        '下载量不等于用户份额，发布者国家按发布方标注，不代表上游基座模型的开发者国家；未知归属保留，不按模型名称猜测。',
      ],
      en: [
        'Six task domains (text, image & video, speech & audio, multimodal, embedding & retrieval, robotics), top 16 each: downloads, cumulative downloads and likes capture different facets of the ecosystem.',
        'Downloads ≠ user share; publisher country marks the publisher, not the base-model developer country; unknown attribution is kept, not guessed from model names.',
      ],
    },
    a3: {
      zh: [
        'LLVM 五年持续上升（2026 年贡献者 4,611 人），近期 OpenRank 与 Project OpenRank 同步上升，为"工具链成为新增长中心"提供开发者侧证据。',
        '持续集成与交付是显著例外：2026 年印度贡献达 1,730，高于美国和中国。',
      ],
      en: [
        'LLVM kept rising for five years (4,611 contributors in 2026), its recent OpenRank climbing with Project OpenRank — developer-side evidence that toolchains are the new growth center.',
        'CI/CD is a notable exception: India’s 2026 contribution reached 1,730, above both the US and China.',
      ],
    },
    a4: {
      zh: [
        'YDB 从 2022 年的 32 快速增长进入头部（2026 年 2,313）；Elasticsearch 五年累计贡献者 4,747 人，2026 年仅 627 人——不同生命周期项目并存。',
        '关系型数据库 2026 年美国（35,704）反超中国（34,249）；向量、时序等方向仍由中国贡献居前。',
      ],
      en: [
        'YDB grew from 32 (2022) into the head (2,313 in 2026); Elasticsearch has 4,747 lifetime contributors but only 627 in 2026 — projects of different lifecycles coexist.',
        'In relational DBs the US (35,704) overtook China (34,249) in 2026; China still leads vector and time-series directions.',
      ],
    },
    a5: {
      zh: [
        'OpenTitan 从 1,632.2 连续回落至 692.7；caliptra-sw 从 73.0 增至 298.6，riscv-unified-db 达 240.7——新增影响力集中在规范、验证、安全基础设施。',
        '芯片实现的美国贡献从 3,347 降至 1,635，而规范与计划中中国贡献从 157 增至 381，软件侧参与正在形成自己的位置。',
      ],
      en: [
        'OpenTitan fell steadily from 1,632.2 to 692.7; caliptra-sw rose from 73.0 to 298.6 and riscv-unified-db reached 240.7 — new influence concentrates in specs, verification and security.',
        'US contribution to chip implementations fell from 3,347 to 1,635 while China’s contribution to specs & programs rose from 157 to 381 — a software-side position is forming.',
      ],
    },
    a6: {
      zh: [
        'Torchtitan、Monarch、TorchComms 在 2026 年快速形成影响力（636 / 459 / 236），与分布式训练翻倍相互对应。',
        '除计算机视觉和强化学习（英国贡献最高）外，其余 11 个子领域均由美国贡献最高；分布式训练美国贡献从 548 增至 4,709。',
      ],
      en: [
        'Torchtitan, Monarch and TorchComms quickly gained influence in 2026 (636 / 459 / 236), matching the doubling of distributed training.',
        'Except computer vision and RL (led by the UK), all 11 other subfields are US-led; US distributed-training contribution grew from 548 to 4,709.',
      ],
    },
  },
  fig: {
    repos: { zh: '核心项目 OpenRank Top 10（2026）', en: 'Top 10 core projects by OpenRank (2026)' },
    monthly: { zh: '核心项目月度 OpenRank（2025.07—2026.06）', en: 'Core project monthly OpenRank' },
    subfield: { zh: '技术子领域 OpenRank 结构（2026）', en: 'Subfield OpenRank structure (2026)' },
    subfield5y: { zh: '技术子领域五年变化', en: 'Subfield 5-year change' },
    country: { zh: '各子领域 2026 Top 3 国家', en: 'Top-3 countries per subfield (2026)' },
    scatter: { zh: '核心项目关联分布（Project OpenRank × 全域 OpenRank，对数轴）', en: 'Project × global OpenRank (log axes)' },
    modelMetric: { zh: '指标', en: 'Metric' },
    recentDl: { zh: '近30天下载量', en: '30-day downloads' },
    totalDl: { zh: '累计下载量', en: 'Total downloads' },
    likes: { zh: '累计点赞量', en: 'Likes' },
  },
  note: {
    zh: '口径：OpenDigger 技术分类标签体系，核心项目筛选 + 2022—2026 年度变化 + 2025.07—2026.06 统计期；散点横轴为项目 OpenRank、纵轴为全域 OpenRank。数据文件见报告仓库 data/processed/chapter4/。',
    en: 'Method: OpenDigger technology taxonomy, curated core projects, 2022–2026 yearly change, period 2025.07–2026.06; scatter x = project OpenRank, y = global OpenRank. Data files: data/processed/chapter4/.',
  },
} as const;

type TabKey = keyof typeof T.tabs;

/* ---------------- 通用图配置 ---------------- */

function Panel({ t, s, children, wide }: { t: string; s?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`gv-panel p-5 ${wide ? 'lg:col-span-2' : ''}`}>
      <h4 className="gv-panel-title">{t}</h4>
      {s && <p className="gv-panel-sub mt-0.5 mb-2">{s}</p>}
      {children}
    </div>
  );
}

/** 项目清单 → Top N 横向条形图（兼容 BOM 首列） */
function reposBar(csv: string, n: number, lang: 'zh' | 'en') {
  const rows = parseCsv(csv).slice(0, n);
  const nameKey = 'repo_name' in rows[0] ? 'repo_name' : Object.keys(rows[0])[1];
  const valKey = 'total_openrank' in rows[0] ? 'total_openrank' : Object.keys(rows[0]).pop()!;
  return {
    grid: { left: 8, right: 70, top: 8, bottom: 4, containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
    yAxis: { type: 'category', inverse: true, data: rows.map(r => r[nameKey]), axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 12, data: rows.map(r => num(r[valKey])),
      itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c2') },
      label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted'), formatter: (p: { value: number }) => fmtCompact(p.value, lang) },
    }],
  };
}

/** 子领域五年表 → 2026 横向条形（按值排序） */
function subfieldBar2026(csv: string, lang: 'zh' | 'en') {
  const rows = parseCsv(csv);
  const nameKey = '子领域' in rows[0] ? '子领域' : Object.keys(rows[0])[1];
  const sorted = [...rows].sort((a, b) => num(b['2026']) - num(a['2026']));
  return {
    grid: { left: 8, right: 70, top: 8, bottom: 4, containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
    yAxis: { type: 'category', inverse: true, data: sorted.map(r => r[nameKey]), axisLabel: { fontSize: 10, width: 130, overflow: 'truncate' as const } },
    series: [{
      type: 'bar', barWidth: 10, data: sorted.map(r => num(r['2026'])),
      itemStyle: { borderRadius: [0, 5, 5, 0], color: cssVar('--c3') },
      label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted'), formatter: (p: { value: number }) => fmtCompact(p.value, lang) },
    }],
  };
}

/** 子领域五年表 → 多年折线 */
function subfieldLines(csv: string) {
  const rows = parseCsv(csv);
  const nameKey = '子领域' in rows[0] ? '子领域' : Object.keys(rows[0])[1];
  return {
    xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025', '2026'] },
    yAxis: { type: 'value', scale: true },
    series: rows.slice(0, 8).map(r => ({
      name: r[nameKey], type: 'line' as const, smooth: true, showSymbol: false, lineStyle: { width: 2 },
      data: ['2022', '2023', '2024', '2025', '2026'].map(y => num(r[y])),
    })),
    legend: { top: 0, type: 'scroll' as const },
  };
}

/** 国家 Top3 表 → 分组条形 */
function countryGrouped(csv: string) {
  const rows = parseCsv(csv);
  const fields = Array.from(new Set(rows.map(r => r['子领域'])));
  const countries = Array.from(new Set(rows.map(r => r['国家'])));
  return {
    grid: { left: 8, right: 16, top: 36, bottom: 4, containLabel: true },
    xAxis: { type: 'category', data: fields, axisLabel: { fontSize: 9, interval: 0, rotate: 24 } },
    yAxis: { type: 'value', scale: true },
    series: countries.map(c => ({
      name: c, type: 'bar' as const, barMaxWidth: 14,
      data: fields.map(f => num(rows.find(r => r['子领域'] === f && r['国家'] === c)?.['2026'])),
    })),
    legend: { top: 0 },
  };
}

/** 五年项目表 → 折线 */
function projectLines(csv: string) {
  const rows = parseCsv(csv);
  return {
    xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025', '2026'] },
    yAxis: { type: 'value', scale: true },
    series: rows.map(r => ({
      name: r.project, type: 'line' as const, smooth: true, showSymbol: false, lineStyle: { width: 2.2 },
      data: ['2022', '2023', '2024', '2025', '2026'].map(y => num(r[y])),
    })),
    legend: { top: 0 },
  };
}

/** 散点：Project OpenRank × OpenRank */
function scatterOpt(csv: string) {
  const rows = parseCsv(csv);
  return {
    grid: { left: 8, right: 24, top: 16, bottom: 4, containLabel: true },
    xAxis: { type: 'log', name: 'Project OpenRank', nameTextStyle: { fontSize: 10 }, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'log', name: 'OpenRank', nameTextStyle: { fontSize: 10 }, axisLabel: { fontSize: 10 } },
    series: [{
      type: 'scatter',
      symbolSize: (v: number[]) => Math.min(26, 6 + Math.sqrt(v[2]) / 6),
      itemStyle: { color: cssVar('--c4'), opacity: 0.75 },
      label: { show: true, position: 'top' as const, fontSize: 9, color: cssVar('--muted'), formatter: (p: { name: string }) => p.name },
      data: rows.map(r => ({ name: r['项目'], value: [num(r['Project OpenRank']) || 1, num(r['OpenRank']) || 1, num(r['组合分'])] })),
    }],
  };
}

/* ---------------- 4.2 模型全景 ---------------- */

const DOMAINS = [
  { key: 'text', zh: '文本生成', en: 'Text' },
  { key: 'image-video', zh: '图像与视频', en: 'Image & Video' },
  { key: 'speech-audio', zh: '语音与音频', en: 'Speech & Audio' },
  { key: 'multimodal', zh: '多模态', en: 'Multimodal' },
  { key: 'embedding-retrieval', zh: '嵌入与检索', en: 'Embedding & Retrieval' },
  { key: 'robotics', zh: '机器人', en: 'Robotics' },
] as const;

function ModelLandscape({ lang }: { lang: 'zh' | 'en' }) {
  const [domain, setDomain] = useState<string>('text');
  const [metric, setMetric] = useState<'recent' | 'total' | 'likes'>('recent');

  const opt = useMemo(() => {
    const csv = metric === 'recent' ? f421 : metric === 'total' ? f422 : f423;
    const valKey = metric === 'likes' ? 'likes' : metric === 'total' ? 'downloads_all_time' : 'downloads';
    const rows = parseCsv(csv).filter(r => r.domain_key === domain).slice(0, 12);
    return {
      grid: { left: 8, right: 76, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => r.model_name), axisLabel: { fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: 13, data: rows.map(r => num(r[valKey])),
        itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c1') },
        label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted'), formatter: (p: { value: number }) => fmtCompact(p.value, lang) },
      }],
    };
  }, [domain, metric, lang]);

  const metricLabel = metric === 'recent' ? pick(T.fig.recentDl, lang) : metric === 'total' ? pick(T.fig.totalDl, lang) : pick(T.fig.likes, lang);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {DOMAINS.map(d => (
          <button key={d.key} className="gv-tab" aria-selected={domain === d.key} onClick={() => setDomain(d.key)}>
            {lang === 'zh' ? d.zh : d.en}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-xs gv-muted">{pick(T.fig.modelMetric, lang)}:</span>
        {(['recent', 'total', 'likes'] as const).map(m => (
          <button key={m} className="gv-tab" aria-selected={metric === m} onClick={() => setMetric(m)}>
            {m === 'recent' ? pick(T.fig.recentDl, lang) : m === 'total' ? pick(T.fig.totalDl, lang) : pick(T.fig.likes, lang)}
          </button>
        ))}
      </div>
      <EChart option={opt} height={420} />
      <p className="mt-2 text-[11px] gv-panel-sub">
        {lang === 'zh' ? '当前视图：' : 'View: '}{DOMAINS.find(d => d.key === domain)?.[lang] ?? domain} · {metricLabel} · Top 12 / 16
      </p>
    </div>
  );
}

/* ================= 主板块 ================= */

export default function Landscape() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabKey>('a1');

  return (
    <section id="ch4" className="surf-alt py-20 md:py-28 scroll-mt-16">
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

        {/* 4.1 Agentic AI */}
        {tab === 'a1' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.monthly, lang)} s="fig 4-2" wide>
              <AgenticMonthly />
            </Panel>
            <Panel t={pick(T.fig.repos, lang)} s="fig 4-1"><EChart option={reposBar(f411, 10, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield, lang)} s="fig 4-3"><EChart option={subfieldBar2026(f413, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.country, lang)} s="fig 4-4" wide><EChart option={countryGrouped(f414)} height={300} /></Panel>
            <Panel t={pick(T.fig.scatter, lang)} s="fig 4-5"><EChart option={scatterOpt(f415)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield5y, lang)} s="fig 4-3 · 2022—2026"><EChart option={subfieldLines(f413)} height={330} /></Panel>
            <InsightList items={T.insights.a1[lang]} wide />
          </div>
        )}

        {/* 4.2 大模型 */}
        {tab === 'a2' && (
          <div className="mt-6 grid gap-6">
            <Panel t={lang === 'zh' ? '开放模型生态六任务领域 Top 16' : 'Open-model ecosystem: top 16 across six task domains'} s="fig 4.2-1/2/3 · Hugging Face × OpenGauge, 2026-10-02" wide>
              <ModelLandscape lang={lang} />
            </Panel>
            <InsightList items={T.insights.a2[lang]} wide />
          </div>
        )}

        {/* 4.3 Cloud */}
        {tab === 'a3' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.repos, lang)} s="fig 4-6"><EChart option={reposBar(f431, 10, lang)} height={330} /></Panel>
            <Panel t={lang === 'zh' ? '头部项目五年变化（LLVM 逆势增长）' : 'Top projects 5-year change (LLVM rising)'} s="fig 4-7"><EChart option={projectLines(f432)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield, lang)} s="fig 4-8"><EChart option={subfieldBar2026(f433, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.country, lang)} s="fig 4-9" wide><EChart option={countryGrouped(f434)} height={300} /></Panel>
            <Panel t={pick(T.fig.scatter, lang)} s="fig 4-10"><EChart option={scatterOpt(f435)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield5y, lang)} s="fig 4-8 · 2022—2026"><EChart option={subfieldLines(f433)} height={330} /></Panel>
            <InsightList items={T.insights.a3[lang]} wide />
          </div>
        )}

        {/* 4.4 Database */}
        {tab === 'a4' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.repos, lang)} s="fig 4-11"><EChart option={reposBar(f441, 10, lang)} height={330} /></Panel>
            <Panel t={lang === 'zh' ? '头部项目五年变化' : 'Top projects 5-year change'} s="fig 4-12"><EChart option={projectLines(f442)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield, lang)} s="fig 4-12"><EChart option={subfieldBar2026(f443, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.country, lang)} s="fig 4-13" wide><EChart option={countryGrouped(f444)} height={300} /></Panel>
            <Panel t={pick(T.fig.scatter, lang)} s="fig 4-14"><EChart option={scatterOpt(f445)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield5y, lang)} s="fig 4-12 · 2022—2026"><EChart option={subfieldLines(f443)} height={330} /></Panel>
            <InsightList items={T.insights.a4[lang]} wide />
          </div>
        )}

        {/* 4.5 RISC-V */}
        {tab === 'a5' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.repos, lang)} s="fig 4-15"><EChart option={reposBar(f451, 10, lang)} height={330} /></Panel>
            <Panel t={lang === 'zh' ? '头部项目五年变化' : 'Top projects 5-year change'} s="fig 4-16"><EChart option={projectLines(f452)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield, lang)} s="fig 4-17"><EChart option={subfieldBar2026(f453, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.country, lang)} s="fig 4-18" wide><EChart option={countryGrouped(f454)} height={300} /></Panel>
            <Panel t={pick(T.fig.scatter, lang)} s="fig 4-19"><EChart option={scatterOpt(f455)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield5y, lang)} s="fig 4-17 · 2022—2026"><EChart option={subfieldLines(f453)} height={330} /></Panel>
            <InsightList items={T.insights.a5[lang]} wide />
          </div>
        )}

        {/* 4.6 PyTorch */}
        {tab === 'a6' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel t={pick(T.fig.repos, lang)} s="fig 4-20"><EChart option={reposBar(f461, 10, lang)} height={330} /></Panel>
            <Panel t={lang === 'zh' ? '头部项目五年变化' : 'Top projects 5-year change'} s="fig 4-21"><EChart option={projectLines(f462)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield, lang)} s="fig 4-22"><EChart option={subfieldBar2026(f463, lang)} height={330} /></Panel>
            <Panel t={pick(T.fig.country, lang)} s="fig 4-23" wide><EChart option={countryGrouped(f464)} height={300} /></Panel>
            <Panel t={pick(T.fig.scatter, lang)} s="fig 4-24"><EChart option={scatterOpt(f465)} height={330} /></Panel>
            <Panel t={pick(T.fig.subfield5y, lang)} s="fig 4-22 · 2022—2026"><EChart option={subfieldLines(f463)} height={330} /></Panel>
            <InsightList items={T.insights.a6[lang]} wide />
          </div>
        )}

        <p className="mt-8 text-xs gv-muted">{pick(T.note, lang)}</p>
      </div>
    </section>
  );
}

function AgenticMonthly() {
  const opt = useMemo(() => {
    const rows = parseCsv(f412);
    const keys = Object.keys(rows[0]).filter(k => k !== '项目');
    return {
      xAxis: { type: 'category', data: keys, axisLabel: { fontSize: 9, interval: 1 } },
      yAxis: { type: 'value' },
      series: rows.map(r => ({ name: r['项目'], type: 'line' as const, smooth: true, showSymbol: false, lineStyle: { width: 2 }, data: keys.map(k => num(r[k])) })),
      legend: { top: 0, type: 'scroll' as const },
    };
  }, []);
  return <EChart option={opt} height={320} />;
}

function InsightList({ items, wide }: { items: readonly string[]; wide?: boolean }) {
  return (
    <ul className={`grid gap-3 self-start ${wide ? 'lg:col-span-2' : ''}`}>
      {items.map((s, i) => (
        <li key={i} className="rounded-xl border px-5 py-3.5 text-sm leading-7"
          style={{ borderColor: 'rgba(103,213,219,.25)', background: 'rgba(103,213,219,.05)', color: '#cfe8ee' }}>
          ▸ {s}
        </li>
      ))}
    </ul>
  );
}
