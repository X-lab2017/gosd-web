import { useMemo, useState } from 'react';
import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import EChart from '@/components/EChart';
import OSDGWheel from '@/components/OSDGWheel';
import { fmtCompact } from '@/lib/csv';
import orgs from '@/data/organization-leaderboard.json';
import derivatives from '@/data/fig-16_derivatives-per-base-model.json';

/* ---------------- i18n ---------------- */

const T = {
  kicker: { zh: '第一章 · 开源发展目标与度量体系（OSDGs & OSDI）', en: 'Chapter 1 · Open Source Development Goals & Indicators' },
  sub: {
    zh: '开源怎样从广泛参与走向持续贡献，又怎样从技术影响走向公共价值？本章从 Linux 与开放模型两个故事出发，提出开源发展目标（OSDGs）框架，并以开源发展度量体系（OSDI）的二十九项指标给出可验证的观察口径。',
    en: 'How does open source move from broad participation to sustained contribution, and from technical influence to public value? This chapter starts with two stories — Linux and open models — proposes the Open Source Development Goals (OSDGs), and operationalizes them through the 29-indicator OSDI system.',
  },
  tabs: {
    s1: { zh: '1.1 开源的公共价值', en: '1.1 Public Value' },
    s2: { zh: '1.2 OSDGs 目标框架', en: '1.2 OSDGs Framework' },
    s3: { zh: '1.3 OSDI 度量体系', en: '1.3 OSDI Indicators' },
  },
  s1: {
    storyLinux: { zh: '故事一 · Linux：公共基础设施背后的长期协作', en: 'Story 1 · Linux: long-term collaboration behind public infrastructure' },
    storyLinuxP: {
      zh: '一个软件项目的价值不只来自某次发布，也来自围绕它形成的持续维护与协作。LFX Insights 累计榜单显示，Linux 内核全周期贡献者总记录数达 45,855、组织总数 5,686——社区行为数据让我们有机会观察公共基础设施是怎样被共同建设和维护的。',
      en: 'A project’s value comes not only from each release but from the sustained maintenance and collaboration around it. LFX Insights lifetime leaderboards record 45,855 contributors and 5,686 organizations for the Linux kernel — behavioral data lets us observe how public infrastructure is jointly built and maintained.',
    },
    storyLinuxNote: {
      zh: '口径：LFX Insights korg 累计榜单（2026-10-11 导出，未限定时间范围），非本报告年度活跃数；两组外部数据仅作背景案例，不进入 OSDI 指标计算。',
      en: 'Scope: LFX Insights korg lifetime leaderboards (exported 2026-10-11). External snapshots are background cases only — they do not enter OSDI metric computation.',
    },
    storyModel: { zh: '故事二 · 开放模型：一次发布如何变成更多人的创造', en: 'Story 2 · Open models: how one release becomes everyone’s creation' },
    storyModelP: {
      zh: '在模型生态中，影响力表现为后续开发者在已有成果上继续微调、适配与构建新模型。ATOM 样本显示，2026 年 2 月新增微调与衍生模型的 70% 以归属中国发布方的基础模型为起点。观察模型生态需要同时关注"谁发布了模型"与"这些模型支持了谁的进一步创造"。',
      en: 'In the model ecosystem, influence shows up as downstream fine-tuning, adaptation and derivation. In the ATOM sample, 70% of new fine-tuned/derived models in Feb 2026 started from base models published by China-based publishers. Watching this ecosystem means tracking both who publishes models and whose creativity those models enable.',
    },
    storyModelNote: {
      zh: '口径：ATOM Project Hugging Face 跟踪样本，28 个月度观测（2023-11 至 2026-02），按基础模型发布方归属统计，不是下载量或全球模型普查。',
      en: 'Scope: ATOM Project Hugging Face tracked sample, 28 monthly observations (Nov 2023 – Feb 2026), attributed by base-model publisher — not downloads or a global model census.',
    },
    linuxChart: { zh: 'Linux 内核组织协作累计榜（Top 10）', en: 'Linux kernel organizations — lifetime top 10' },
    atomChart: { zh: '新增微调与衍生模型的基座构成（月度占比）', en: 'Monthly share of new fine-tunes/derivatives by base model' },
    changes: { zh: '三种变化：资产、社区与治理', en: 'Three shifts: assets, community, governance' },
    changesCols: {
      zh: ['观察面向', '代码协作中的典型对象与行为', '模型、数据带来的扩展', '对研究方法的要求'],
      en: ['Lens', 'Typical objects & behaviors in code collaboration', 'Extension brought by models & data', 'Research requirements'],
    },
    changesRows: {
      zh: [
        ['技术资产', '仓库、版本、提交、问题与变更请求', '权重、训练与推理代码、数据集、模型与数据文档', '区分资产类型、版本、许可和可获取程度'],
        ['社区关系', '开发者围绕项目开展讨论、评审和维护', '发布者、微调者、评估者、数据提供者及下游使用者形成复用网络', '从参与计数延伸到关系、流向与衍生分析'],
        ['治理责任', '维护规则、决策机制、许可证与安全响应', '数据来源、模型透明度、使用限制和评估责任', '同时记录技术开放与治理证据'],
      ],
      en: [
        ['Technical assets', 'Repositories, versions, commits, issues & change requests', 'Weights, training/inference code, datasets, model & data docs', 'Distinguish asset types, versions, licenses and availability'],
        ['Community relations', 'Developers discuss, review and maintain around projects', 'Publishers, fine-tuners, evaluators, data providers and downstream users form reuse networks', 'Extend from participation counts to relations, flows and derivatives'],
        ['Governance duties', 'Maintenance rules, decision mechanisms, licenses, security response', 'Data provenance, model transparency, usage limits, evaluation responsibility', 'Record both technical openness and governance evidence'],
      ],
    },
    dpg: {
      zh: '从开放技术到数字公共品：SDGs 提供发展目标方向，DPGA 的 DPG 标准提供可审查条件。本报告将"具有公共价值的开放技术实践"与"通过特定标准评审的数字公共品"分别表述；公开可见、可下载权重与完整的开源 AI 也不是同一层次（参考 OSI Open Source AI Definition 1.0）。',
      en: 'From open technology to digital public goods: the SDGs set the direction; the DPGA DPG Standard provides auditable conditions. This report distinguishes "open technology practice with public value" from "DPGs certified through a standard review"; publicly visible, downloadable weights and fully open-source AI are not the same level (cf. OSI Open Source AI Definition 1.0).',
    },
  },
  s2: {
    intro: {
      zh: 'OSDGs 面向智能时代，将开源的公共价值转化为四个可以持续追问的问题：谁能够参与？哪些技术成果可以被共同使用？这些成果怎样连接全球创新？协作又如何得到负责任的治理与持续维护？',
      en: 'For the intelligent age, the OSDGs turn public value into four persistent questions: who can participate? Which outcomes can be shared? How do they connect global innovation? And how is collaboration responsibly governed and sustained?',
    },
    tableCols: { zh: ['支柱', '目标内涵', '二级维度'], en: ['Pillar', 'Aspiration', 'Dimensions'] },
    rows: {
      zh: [
        ['X1 人才规模与多样性', '让更多参与者能够进入、协作并成长', '1.1 规模与密度；1.2 生态多样性'],
        ['X2 技术产出与开放供给', '扩大有质量、可复用的开放技术供给', '2.1 代码产出；2.2 模型开放供给；2.3 数据开放供给'],
        ['X3 全球连接与网络效应', '促进成果流动、采用与进一步创造', '3.1 代码影响力；3.2 模型影响力；3.3 数据集影响力'],
        ['X4 开源善治与公共价值', '为持续协作建立治理基础和公共利益方向', '4.1 治理成熟度；4.2 公共福祉'],
      ],
      en: [
        ['X1 Talent scale & diversity', 'Enable more participants to enter, collaborate and grow', '1.1 Scale & density; 1.2 Ecosystem diversity'],
        ['X2 Output & open supply', 'Expand quality, reusable open technology supply', '2.1 Code output; 2.2 Model supply; 2.3 Data supply'],
        ['X3 Global connection & network effects', 'Enable flow, adoption and further creation', '3.1 Code influence; 3.2 Model influence; 3.3 Dataset influence'],
        ['X4 Good governance & public value', 'Build governance foundations oriented to public good', '4.1 Governance maturity; 4.2 Public welfare'],
      ],
    },
    sdgCols: { zh: ['支柱', '关联 SDGs', '解释边界'], en: ['Pillar', 'Related SDGs', 'Interpretation boundary'] },
    sdgRows: {
      zh: [
        ['X1', '4、8、9、10、11、17', '开发者增多不直接等于就业或公平改善'],
        ['X2', '9、10、17', '发布量不等于技术质量、使用效果或完整开放'],
        ['X3', '8、9、10、11、12、17', '网络影响与复用是过程信号，不直接折算为社会收益'],
        ['X4', '9、10、16、17', '基金会托管或许可标签均不能单独证明治理质量'],
      ],
      en: [
        ['X1', '4, 8, 9, 10, 11, 17', 'More developers ≠ better employment or equity'],
        ['X2', '9, 10, 17', 'Release volume ≠ quality, adoption or full openness'],
        ['X3', '8, 9, 10, 11, 12, 17', 'Network influence is a process signal, not direct social return'],
        ['X4', '9, 10, 16, 17', 'Foundation hosting or license labels alone don’t prove governance quality'],
      ],
    },
    note: {
      zh: 'OSDGs 是本报告提出的研究框架，借鉴并关联 SDGs；指标关联为研究解释，不构成联合国对框架的采用或认证。四个支柱相互联系但不能互相代替——参与人数增加并不自动意味着贡献质量提高。',
      en: 'The OSDGs are a research framework proposed by this report, informed by the SDGs; the mappings are research interpretations and do not constitute UN adoption or endorsement. The four pillars interconnect but cannot substitute for one another.',
    },
  },
  s3: {
    intro: {
      zh: 'OSDI 把四大支柱细化为十个维度、二十九项指标。指标角色分为北极星（持续关注核心方向）、诊断（识别分布与结构）、驱动（观察活动与变化）；二十九项指标不自动合成为一个总分。',
      en: 'The OSDI refines four pillars into ten dimensions and 29 indicators, each with a role: North Star (core direction), diagnostic (distribution & structure) or driver (activity & change). The 29 indicators are not collapsed into a single composite score.',
    },
    cols: { zh: ['支柱 / 维度', '指标', '代码', '角色', 'SDG'], en: ['Pillar / Dimension', 'Indicator', 'Code', 'Role', 'SDG'] },
    role: { north: { zh: '北极星', en: 'North Star' }, diag: { zh: '诊断', en: 'Diagnostic' }, drive: { zh: '驱动', en: 'Driver' } },
    methods: { zh: '方法基础：三类方法分别使用', en: 'Method foundation: three distinct methods' },
    methodRows: {
      zh: [
        ['Activity 活跃度', '发生了多少、何种有效协作行为？', '补充描述参与强度；与活跃人数分开'],
        ['社区 OpenRank 贡献度', '参与者在项目内的协作网络中怎样贡献？', '支持代码协作贡献度及社区分析'],
        ['全域 OpenRank 影响力', '开发者与仓库在更大协作网络中处于什么位置？', '支持代码影响力、主体比较与生态连接分析'],
      ],
      en: [
        ['Activity', 'How much and what kind of effective collaboration happened?', 'Describes participation intensity, apart from headcounts'],
        ['Community OpenRank', 'How do participants contribute within a project’s collaboration network?', 'Supports code contribution and community analysis'],
        ['Global OpenRank', 'Where do developers and repos sit in the wider collaboration network?', 'Supports influence, entity comparison and ecosystem connection'],
      ],
    },
    modelrank: {
      zh: 'ModelRank 面向模型复用网络：一个模型被哪些后续模型复用，这些衍生关系怎样继续扩展。本轮不设定未经验证的公式或权重，下载数、点赞数与衍生模型数可分别作为观察信号，但不直接等于 ModelRank。',
      en: 'ModelRank targets model reuse networks: which downstream models reuse a model and how derivations cascade. No unvalidated formula or weighting is fixed this round; downloads, likes and derivative counts are separate signals — none equals ModelRank directly.',
    },
    tableNote: {
      zh: '完整定义、计算规则、单位与数据状态见报告仓库 data/meta/osdi_indicator_dictionary.csv。',
      en: 'Full definitions, computation rules, units and data status: data/meta/osdi_indicator_dictionary.csv in the report repository.',
    },
  },
} as const;

const INDICATORS: [string, { zh: string; en: string }, string, 'north' | 'diag' | 'drive', string][] = [
  ['X1 / 1.1 规模与密度 · Scale & density', { zh: '活跃开发者规模', en: 'Active developer scale' }, 'DevScale', 'north', '8,9'],
  ['X1 / 1.1', { zh: '人才聚集密度', en: 'Talent density' }, 'TalentDensity', 'diag', '9,11'],
  ['X1 / 1.1', { zh: '新晋开发者增速', en: 'Newcomer growth' }, 'NewcomerGrowth', 'drive', '4,8'],
  ['X1 / 1.2 生态多样性 · Diversity', { zh: '全球开源协作占比', en: 'Global collaboration share' }, 'GlobalCollabShare', 'diag', '10,17'],
  ['X1 / 1.2', { zh: '学术机构贡献占比', en: 'Academic contribution share' }, 'AcademicShare', 'diag', '4,9'],
  ['X2 / 2.1 代码产出 · Code output', { zh: '有效活跃仓库规模', en: 'Active repository scale' }, 'ActiveRepo', 'north', '9'],
  ['X2 / 2.1', { zh: '代码协作贡献度', en: 'Code collaboration contribution' }, 'OpenRankContrib', 'north', '9,17'],
  ['X2 / 2.1', { zh: '高质量 PR 合入量', en: 'Reviewed PR merges' }, 'ReviewedPR', 'drive', '9'],
  ['X2 / 2.2 模型开放供给 · Model supply', { zh: '开源模型发布量', en: 'Open model releases' }, 'OpenModelRelease', 'drive', '9'],
  ['X2 / 2.2', { zh: '模型供给方多样性', en: 'Model supplier diversity' }, 'ModelSupplierDiv', 'diag', '9,10'],
  ['X2 / 2.3 数据开放供给 · Data supply', { zh: '开源数据集发布量', en: 'Open dataset releases' }, 'OpenDatasetRelease', 'drive', '9'],
  ['X2 / 2.3', { zh: '数据供给方多样性', en: 'Data supplier diversity' }, 'DataSupplierDiv', 'diag', '9,10'],
  ['X3 / 3.1 代码影响力 · Code influence', { zh: '代码仓库影响力', en: 'Repository influence' }, 'OpenRankInflu', 'north', '9,17'],
  ['X3 / 3.1', { zh: '高影响力区域数量', en: 'High-impact regions' }, 'HighImpactRegion', 'diag', '10,11'],
  ['X3 / 3.1', { zh: '高影响力组织数量', en: 'High-impact organizations' }, 'HighImpactOrg', 'diag', '17'],
  ['X3 / 3.1', { zh: '高影响力项目数量', en: 'High-impact projects' }, 'HighImpactProj', 'diag', '9'],
  ['X3 / 3.1', { zh: '高影响力人才数量', en: 'High-impact talent' }, 'HighImpactTalent', 'diag', '8,9'],
  ['X3 / 3.2 模型影响力 · Model influence', { zh: '模型采用度', en: 'Model adoption' }, 'ModelAdoption', 'drive', '9'],
  ['X3 / 3.2', { zh: '模型社区热度', en: 'Model community heat' }, 'ModelCommunityHeat', 'drive', '9,17'],
  ['X3 / 3.2', { zh: '模型生态衍生力', en: 'Model ecosystem derivativeness' }, 'ModelRank', 'north', '9'],
  ['X3 / 3.3 数据集影响力 · Dataset influence', { zh: '数据采用度', en: 'Data adoption' }, 'DataAdoption', 'drive', '9'],
  ['X3 / 3.3', { zh: '数据社区热度', en: 'Data community heat' }, 'DataCommunityHeat', 'drive', '9,17'],
  ['X3 / 3.3', { zh: '数据生态复用率', en: 'Data ecosystem reuse rate' }, 'DataEcoReuseRate', 'north', '9,12'],
  ['X4 / 4.1 治理成熟度 · Governance', { zh: '基金会托管比例', en: 'Foundation neutrality ratio' }, 'NeutralityRatio', 'north', '16,17'],
  ['X4 / 4.1', { zh: '治理主体均衡度', en: 'Governance balance' }, 'GovBalance', 'diag', '10,16'],
  ['X4 / 4.1', { zh: '合规许可覆盖率', en: 'Compliance license coverage' }, 'ComplianceLicenseCov', 'diag', '16'],
  ['X4 / 4.2 公共福祉 · Public welfare', { zh: '数字公共品共建度', en: 'DPG co-creation' }, 'DPGCoCreation', 'north', '9,10,17'],
  ['X4 / 4.2', { zh: '高开放度许可占比', en: 'License openness' }, 'LicenseOpenness', 'diag', '9,16'],
  ['X4 / 4.2', { zh: 'AI 资产透明度', en: 'AI asset transparency' }, 'AIAssetTransparency', 'diag', '9,16'],
];

/* ---------------- 组件 ---------------- */

interface LFXRow { name: string; contributions?: number; percentage?: number; count?: number }
interface LFXResp { data: LFXRow[]; meta?: { total?: number } }

function Panel({ t, s, children, wide }: { t: string; s?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`gv-panel p-5 ${wide ? 'lg:col-span-2' : ''}`}>
      <h4 className="gv-panel-title">{t}</h4>
      {s && <p className="gv-panel-sub mt-0.5 mb-2">{s}</p>}
      {children}
    </div>
  );
}

export default function Ch1() {
  const { lang } = useLang();
  const [tab, setTab] = useState<'s1' | 's2' | 's3'>('s1');

  const orgOpt = useMemo(() => {
    const rows = (orgs as LFXResp).data.slice(0, 10);
    return {
      grid: { left: 8, right: 76, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtCompact(v, lang) } },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => r.name), axisLabel: { fontSize: 11 } },
      series: [{
        type: 'bar', data: rows.map(r => r.contributions ?? r.count ?? 0), barWidth: 13,
        itemStyle: { borderRadius: [0, 6, 6, 0], color: cssVar('--c2') },
        label: { show: true, position: 'right' as const, fontSize: 10, color: cssVar('--muted'), formatter: (p: { value: number }) => fmtCompact(p.value, lang) },
      }],
    };
  }, [lang]);

  const atomOpt = useMemo(() => {
    const rows = derivatives as Record<string, number | string>[];
    const keys = ['qwen', 'llama', 'deepseek', 'mistral', 'openai'];
    const names: Record<string, string> = { qwen: 'Qwen', llama: 'Llama', deepseek: 'DeepSeek', mistral: 'Mistral', openai: 'OpenAI' };
    return {
      xAxis: { type: 'category', data: rows.map(r => String(r.period).trim()), axisLabel: { fontSize: 10, interval: 3 } },
      yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
      series: keys.map(k => ({
        name: names[k], type: 'line' as const, smooth: true, showSymbol: false, stack: 's',
        areaStyle: { opacity: 0.25 }, emphasis: { focus: 'series' as const },
        data: rows.map(r => r[k]),
      })),
      legend: { top: 0 },
    };
  }, []);

  const roleChip = (r: 'north' | 'diag' | 'drive') => {
    const color = r === 'north' ? 'var(--gold-text)' : r === 'diag' ? 'var(--cyan)' : 'var(--c5, #a0c86c)';
    return <span className="gv-chip" style={{ color, borderColor: color }}>{pick(T.s3.role[r], lang)}</span>;
  };

  return (
    <section id="ch1" className="surf-alt py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5">
        <p className="gv-kicker">{pick(T.kicker, lang)}</p>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 gv-sub">{pick(T.sub, lang)}</p>

        <div className="mt-8 flex gap-2 overflow-x-auto dash-scroll pb-1" role="tablist">
          {(Object.keys(T.tabs) as ('s1' | 's2' | 's3')[]).map(k => (
            <button key={k} role="tab" aria-selected={tab === k} className="gv-tab" onClick={() => setTab(k)}>
              {pick(T.tabs[k], lang)}
            </button>
          ))}
        </div>

        {tab === 's1' && (
          <div className="mt-6 grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel t={pick(T.s1.storyLinux, lang)} wide>
                <p className="text-sm leading-7 gv-muted">{pick(T.s1.storyLinuxP, lang)}</p>
                <div className="mt-4"><EChart option={orgOpt} height={330} /></div>
                <p className="mt-2 text-[11px] gv-panel-sub">{pick(T.s1.storyLinuxNote, lang)}</p>
              </Panel>
              <Panel t={pick(T.s1.storyModel, lang)}>
                <p className="text-sm leading-7 gv-muted">{pick(T.s1.storyModelP, lang)}</p>
                <div className="mt-4"><EChart option={atomOpt} height={330} /></div>
                <p className="mt-2 text-[11px] gv-panel-sub">{pick(T.s1.storyModelNote, lang)}</p>
              </Panel>
            </div>
            <Panel t={pick(T.s1.changes, lang)} wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr>{T.s1.changesCols[lang].map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>
                    {T.s1.changesRows[lang].map((r, i) => (
                      <tr key={i}>{r.map((c, j) => <td key={j} className={j === 0 ? 'font-semibold whitespace-nowrap' : ''}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <p className="rounded-xl border border-[#f2d15c]/30 bg-[#f2d15c]/5 px-5 py-4 text-sm leading-7 text-[#efe3b0]">
              ★ {pick(T.s1.dpg, lang)}
            </p>
          </div>
        )}

        {tab === 's2' && (
          <div className="mt-6 grid gap-6">
            <p className="text-sm leading-7 gv-sub max-w-4xl">{pick(T.s2.intro, lang)}</p>
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              <div className="gv-panel p-5"><OSDGWheel /></div>
              <Panel t={lang === 'zh' ? '四大支柱与十个维度' : 'Four pillars & ten dimensions'}>
                <table className="gv-table">
                  <thead><tr>{T.s2.tableCols[lang].map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>
                    {T.s2.rows[lang].map((r, i) => (
                      <tr key={i}>
                        <td className="font-semibold whitespace-nowrap" style={{ color: ['var(--cyan)', 'var(--c3)', 'var(--c4)', 'var(--c5, #a0c86c)'][i] }}>{r[0]}</td>
                        <td>{r[1]}</td><td className="text-xs leading-5">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            </div>
            <Panel t={lang === 'zh' ? 'OSDGs 与 SDGs 的研究关联' : 'OSDGs–SDGs research mapping'} wide>
              <div className="overflow-x-auto dash-scroll">
                <table className="gv-table">
                  <thead><tr>{T.s2.sdgCols[lang].map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>
                    {T.s2.sdgRows[lang].map((r, i) => (
                      <tr key={i}><td className="font-semibold">{r[0]}</td><td>{r[1]}</td><td className="text-xs">{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <p className="rounded-xl border border-[#f2d15c]/30 bg-[#f2d15c]/5 px-5 py-4 text-sm leading-7 text-[#efe3b0]">
              ★ {pick(T.s2.note, lang)}
            </p>
          </div>
        )}

        {tab === 's3' && (
          <div className="mt-6 grid gap-6">
            <p className="text-sm leading-7 gv-sub max-w-4xl">{pick(T.s3.intro, lang)}</p>
            <Panel t={lang === 'zh' ? '二十九项指标总表' : 'The 29 indicators'} wide>
              <div className="overflow-x-auto dash-scroll" style={{ maxHeight: 520 }}>
                <table className="gv-table">
                  <thead><tr>{T.s3.cols[lang].map((c, i) => <th key={i} className="sticky top-0" style={{ background: 'var(--surface)' }}>{c}</th>)}</tr></thead>
                  <tbody>
                    {INDICATORS.map(([dim, name, code, role, sdg], i) => (
                      <tr key={i}>
                        <td className="text-xs whitespace-nowrap gv-muted">{dim}</td>
                        <td className="font-medium">{pick(name, lang)}</td>
                        <td><code className="text-[11px]" style={{ color: 'var(--cyan)' }}>{code}</code></td>
                        <td>{roleChip(role)}</td>
                        <td className="text-xs gv-muted">{sdg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] gv-panel-sub">{pick(T.s3.tableNote, lang)}</p>
            </Panel>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel t={pick(T.s3.methods, lang)}>
                <table className="gv-table">
                  <thead><tr>{(lang === 'zh' ? ['方法', '回答的问题', '本报告中的用途'] : ['Method', 'Question it answers', 'Use in this report']).map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>
                    {T.s3.methodRows[lang].map((r, i) => (
                      <tr key={i}><td className="font-semibold whitespace-nowrap">{r[0]}</td><td className="text-xs leading-5">{r[1]}</td><td className="text-xs leading-5">{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
              <p className="rounded-xl border border-[#f2d15c]/30 bg-[#f2d15c]/5 px-5 py-4 text-sm leading-7 text-[#efe3b0] self-start">
                ★ {pick(T.s3.modelrank, lang)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
