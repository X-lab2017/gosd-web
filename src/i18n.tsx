import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const dict = {
  nav: {
    summary: { zh: '执行摘要', en: 'Executive Summary' },
    declaration: { zh: '宣言', en: 'Declaration' },
    ch1: { zh: 'OSDGs', en: 'OSDGs' },
    ch2: { zh: '生态观测', en: 'Observatory' },
    ch3: { zh: '影响力排行', en: 'Rankings' },
    ch4: { zh: '技术全景', en: 'Landscape' },
    ch5: { zh: '开源大模型', en: 'Open Models' },
    conclusion: { zh: '未来展望', en: 'Outlook' },
    appendix: { zh: '附录', en: 'Appendix' },
  },
  hero: {
    kicker: { zh: '年度全球开源生态权威观测', en: 'The Annual Global Open Source Observatory' },
    titleA: { zh: '2026 全球开源发展报告', en: 'The 2026 Global Open Source' },
    titleB: { zh: '', en: 'Development Report' },
    tagline: { zh: '从普惠到质量，从参与到影响', en: 'From Inclusion to Quality, From Participation to Impact' },
    logic: { zh: '目标 — 观测 — 评估 — 洞察 — 治理', en: 'Goals — Observation — Evaluation — Insight — Governance' },
    edition: { zh: '网络交互版', en: 'Interactive Web Edition' },
    cta: { zh: '开始探索', en: 'Start Exploring' },
    dataNote: { zh: '数据底座：OpenDigger · OpenRank / OSDI 度量体系', en: 'Data infrastructure: OpenDigger · OpenRank / OSDI metrics' },
  },
  summary: {
    heading: { zh: '执行摘要', en: 'Executive Summary' },
    p1: {
      zh: '在人工智能爆发式增长重塑全球技术格局的 2026 年，开源已不再仅仅是软件开发的方法论，而是演化为支撑智能时代可持续发展的核心数字基础设施。大语言模型、多模态系统与智能体（Agentic AI）的涌现，使开源的内涵从"代码共享"跃迁为"全栈开放"。',
      en: 'In 2026, as explosive AI growth reshapes the global technology landscape, open source has evolved from a software development methodology into the core digital infrastructure underpinning sustainable development in the intelligent age. LLMs, multimodal systems and Agentic AI have pushed open source from "code sharing" to "full-stack openness".',
    },
    p2: {
      zh: '本报告以"从普惠到质量，从参与到影响"为年度主线，将开源发展目标（OSDGs）升级为配套的开源发展度量体系（OSDI），首次实现从"理念框架"到"可量化、可比较、可追踪"的度量闭环。OSDI 围绕社区活力、价值贡献、生态连接、持续成长、多样包容与数字资产六大维度，引入 OpenRank 贡献度与影响力算法，构建全球开源生态的精准画像。',
      en: 'With "From Inclusion to Quality, From Participation to Impact" as its annual theme, this report upgrades the Open Source Development Goals (OSDGs) with the Open Source Development Indicators (OSDI), achieving a closed loop from vision to measurable, comparable and trackable metrics across six dimensions: community vitality, value contribution, ecological connection, sustained growth, diversity and inclusion, and digital assets.',
    },
    p3: {
      zh: '报告发现 2026 年全球开源生态三大关键趋势：其一，Agentic AI 正成为重构开源贡献格局的最大变量（编码代理占其生态 37.6% 影响力份额）；其二，全球南方从"开源参与大国"加速转变为"开源贡献大国"（印度行政区划影响力百强从 3 席跃升至 12 席）；其三，开源大模型进入"分级开放"的竞争新阶段，统一的开放性分级标准成为平衡创新激励与可信治理的关键基础设施。',
      en: 'Three key trends define 2026: first, Agentic AI is the biggest variable restructuring open contribution (coding agents hold 37.6% of its influence share); second, the Global South is shifting from participation power to contribution power (India jumped from 3 to 12 seats in the division top-100); third, open models enter a tiered-openness era, where a unified openness standard becomes key infrastructure balancing innovation and trustworthy governance.',
    },
    stat1v: { zh: '1.93 亿', en: '193M' },
    stat1l: { zh: '全球开发者总量（+27.9%）', en: 'Global developers (+27.9%)' },
    stat2v: { zh: '2890 万', en: '28.9M' },
    stat2l: { zh: '全球活跃开发者（+28.8%）', en: 'Active developers (+28.8%)' },
    stat3v: { zh: '35.0 万', en: '350K' },
    stat3l: { zh: '全球开源人才（OpenRank 前 5%，+7.9%）', en: 'Open-source talent (top 5% OpenRank, +7.9%)' },
  },
  declaration: {
    heading: { zh: '引言：《人工智能开源创新国际合作宣言》', en: 'Preface: Declaration on International Open Source Innovation Cooperation' },
    p1: {
      zh: '本报告以《全球开源与人工智能国际合作宣言》为思想起点。该宣言凝聚了来自各国政府、科技企业、研究机构及开发者社区对于构建公正、开放、安全的人工智能未来的共同承诺，提出"连接、可信、智能、普惠、共治"五大核心原则。',
      en: 'This report takes the Declaration on International Open Source Innovation Cooperation as its intellectual starting point — a shared commitment by governments, technology enterprises, research institutions and developer communities worldwide to a just, open and secure AI future, articulated around five core principles: connection, trust, intelligence, inclusion and co-governance.',
    },
    principles: {
      zh: ['连接：万物智联，普惠共生', '可信：透明可解释，贡献导向', '智能：开放共创智能未来', '普惠：弥合智能鸿沟', '共治：多元参与的治理体系'],
      en: ['Connection: intelligent interconnection for all', 'Trust: transparency and contribution-orientation', 'Intelligence: open co-creation of the AI future', 'Inclusion: bridging the intelligence divide', 'Co-governance: pluralistic participation'],
    },
  },
  appendix: {
    heading: { zh: '附录 A：指标体系与数据来源', en: 'Appendix A: Indicator System & Data Sources' },
    sub: {
      zh: 'OSDI 以《信息技术 开源治理》系列标准为基础，结合 OSDGs、OpenRank 与 ModelRank 模型，形成"活跃度—贡献度—影响力—治理与资产"的评价框架。全部口径表已开源至 GitHub 仓库 data/meta/。',
      en: 'The OSDI builds on the IT open-governance standards, the OSDGs framework and the OpenRank / ModelRank models. All indicator definition tables are open-sourced in the GitHub repository under data/meta/.',
    },
    behaviors: { zh: '五类核心行为', en: 'Five core behaviors' },
    sources: { zh: '数据来源', en: 'Data sources' },
    srcList: {
      zh: ['OpenDigger — 多平台开源协作行为数据', 'Gitee / AtomGit — 中国开源平台数据', 'ATOM Project — 开源模型下载与采用', 'LFX Insights — 基金会项目贡献数据'],
      en: ['OpenDigger — multi-platform collaboration data', 'Gitee / AtomGit — Chinese platform data', 'ATOM Project — open-model downloads & adoption', 'LFX Insights — foundation project contributions'],
    },
  },
  footer: {
    ack: {
      zh: '致谢：中国科协联合国开源创新咨询委员会（CCOSI）· X-lab 开放实验室 · COPU · 开源社 · ALC-Beijing · ModelScope · CSDN',
      en: 'Acknowledgements: CAST UN Consultative Committee on Open Source Innovation (CCOSI) · X-lab · COPU · KAIYUAN.SHE · ALC-Beijing · ModelScope · CSDN',
    },
    repo: { zh: '开源仓库与数据管线', en: 'Open repository & data pipeline' },
    license: { zh: '内容采用 CC BY 4.0 许可', en: 'Content licensed under CC BY 4.0' },
  },
} as const;

export type Dict = typeof dict;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const Ctx = createContext<LangCtx>({ lang: 'zh', setLang: () => {}, t: dict });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');
  return <Ctx.Provider value={{ lang, setLang, t: dict }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function pick(v: { zh: string; en: string }, lang: Lang) {
  return v[lang];
}
