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
    stat1v: { zh: '45,855', en: '45,855' },
    stat1l: { zh: 'Linux 内核全周期贡献者（LFX）', en: 'Lifetime Linux Kernel contributors (LFX)' },
    stat2v: { zh: '20 亿+', en: '2B+' },
    stat2l: { zh: 'HuggingFace 开源模型累计下载（ATOM）', en: 'Cumulative open-model downloads on HuggingFace (ATOM)' },
    stat3v: { zh: '40%+', en: '40%+' },
    stat3l: { zh: 'Qwen 衍生模型月度占比峰值', en: 'Peak monthly share of Qwen derivatives' },
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
  ch1: {
    heading: { zh: '第一章：开源发展目标（OSDGs）与度量体系（OSDI）', en: 'Chapter 1: Open Source Development Goals & Indicators' },
    sub: {
      zh: 'OSDGs 构建与联合国可持续发展目标（SDGs）相映射的开源行动框架，回答"开源如何服务于可持续发展"；OSDI 则回答"如何衡量开源做得好"——从理念到度量，形成可量化、可比较、可追踪的闭环。',
      en: 'The OSDGs establish an action framework mapping open source to the UN Sustainable Development Goals, while the OSDI answers "how to measure open source done well" — a closed loop from vision to quantifiable, comparable and trackable metrics.',
    },
    pillars: {
      zh: [
        { k: 'P1 社区活力', d: '开发者规模、仓库活跃度、新兴力量' },
        { k: 'P2 价值贡献', d: '贡献深度、贡献价值、技术影响' },
        { k: 'P3 生态连接', d: '协作广度、协作深度、网络中心性' },
        { k: 'P4 持续成长', d: '公共技术、绿色技术、公平技术' },
      ],
      en: [
        { k: 'P1 Vitality', d: 'Developer scale, repository activity, emerging forces' },
        { k: 'P2 Contribution', d: 'Contribution depth, value, technical influence' },
        { k: 'P3 Connection', d: 'Collaboration breadth, depth, network centrality' },
        { k: 'P4 Evolution', d: 'Public, green and equitable technology' },
      ],
    },
    sdg: {
      zh: '与联合国 SDGs 的系统映射：开源作为实现《2030 年可持续发展议程》的关键路径',
      en: 'Systematic mapping to the UN SDGs: open source as a key path to the 2030 Agenda for Sustainable Development',
    },
  },
  ch2: {
    heading: { zh: '第二章：全球开源生态观测地图（GOSO）', en: 'Chapter 2: Global Open Source Observatory' },
    sub: {
      zh: '通过活跃度、贡献度、项目影响力、人才、多样性、治理与数字资产七张动态地图，呈现全球开源生态从"规模扩张"到"质量分化"的结构性变化。以下为基于真实数据的可交互预览。',
      en: 'Seven dynamic maps — activity, contribution, project influence, talent, diversity, governance and digital assets — reveal the structural shift of global open source from "scale expansion" to "quality differentiation". Below: interactive previews built on real data.',
    },
    c1t: { zh: 'HuggingFace 用户区域份额周度趋势', en: 'Weekly HuggingFace user share by region' },
    c1s: { zh: 'DeepSeek R1 发布后，中国区份额从约 8% 跃升至近 28%', en: 'After DeepSeek R1, China share jumped from ~8% to nearly 28%' },
    c2t: { zh: '开源模型累计下载：中美欧竞赛', en: 'Cumulative open-model downloads: the race' },
    c2s: { zh: '中国厂商下载增速显著高于美国，"翻转"正在发生', en: 'Chinese vendors grow much faster — the "flip" is happening' },
    c3t: { zh: '开源大模型推理 Token 份额（OpenRouter）', en: 'Open-model inference token share (OpenRouter)' },
    c3s: { zh: 'DeepSeek 主导推理市场，新玩家份额动态变化', en: 'DeepSeek dominates inference; new entrants fluctuate' },
  },
  ch3: {
    heading: { zh: '第三章：全球开源影响力排行榜（GOSR）', en: 'Chapter 3: Global Open Source Influence Ranking' },
    sub: {
      zh: '基于 OpenRank 构建可比较的影响力评估体系。以下以 Linux 内核（LFX Insights 口径，全周期）为例展示交互式排行组件；正式版将发布基于 OpenRank 的六大榜单（R/C/F/P/E/M）。',
      en: 'A comparable influence evaluation system built on OpenRank. Below: an interactive ranking component previewed with the Linux Kernel (LFX Insights, lifetime); the final edition will release six OpenRank-based leaderboards (R/C/F/P/E/M).',
    },
    contributors: { zh: '贡献者排行', en: 'Contributors' },
    orgs: { zh: '组织排行', en: 'Organizations' },
    geo: { zh: '贡献者地理分布', en: 'Geographic distribution' },
    search: { zh: '搜索贡献者…', en: 'Search contributors…' },
    rank: { zh: '排名', en: '#' },
    name: { zh: '名称', en: 'Name' },
    contributions: { zh: '贡献活动', en: 'Activities' },
    share: { zh: '占比', en: 'Share' },
    role: { zh: '角色', en: 'Role' },
    maintainer: { zh: '维护者', en: 'Maintainer' },
    totalLabel: { zh: '全周期贡献者总数', en: 'Total lifetime contributors' },
    note: { zh: '口径说明：LFX Insights 贡献活动数 ≠ OpenRank，正式榜单以 OpenRank 为准', en: 'Note: LFX activity counts differ from OpenRank; final rankings use OpenRank' },
  },
  ch4: {
    heading: { zh: '第四章：全球开源技术全景洞察（GOSL）', en: 'Chapter 4: Global Open Source Technology Landscape Insight' },
    sub: {
      zh: '聚焦六大关键战场，分析技术演进、竞争格局与合作模式。各节深度报告撰写中，网站将持续更新。',
      en: 'Deep-dives into six key technology battlegrounds. Sections under active development — this site updates continuously.',
    },
    fields: {
      zh: [
        { k: '4.1 Agentic AI', d: '智能体技术如何重构开源贡献逻辑' },
        { k: '4.2 AI 大模型全景', d: '开源大模型的供给格局与开放性光谱' },
        { k: '4.3 云基础设施', d: '云原生生态的演进与竞争' },
        { k: '4.4 数据库系统', d: 'DB-Engines 市场动态与开源替代' },
        { k: '4.5 RISC-V', d: '开放指令集与芯片生态' },
        { k: '4.6 PyTorch 基金会', d: '从深度学习框架到基金会治理' },
      ],
      en: [
        { k: '4.1 Agentic AI', d: 'How agentic technology restructures open contribution' },
        { k: '4.2 AI LLM Landscape', d: 'Supply landscape and openness spectrum of open LLMs' },
        { k: '4.3 Cloud Infrastructure', d: 'Evolution and competition of cloud-native ecosystems' },
        { k: '4.4 Database Systems', d: 'DB-Engines dynamics and open-source alternatives' },
        { k: '4.5 RISC-V', d: 'Open instruction sets and the chip ecosystem' },
        { k: '4.6 PyTorch Foundation', d: 'From deep learning framework to foundation governance' },
      ],
    },
    status: { zh: '撰写中', en: 'In progress' },
  },
  ch5: {
    heading: { zh: '第五章：全球开源大模型发展洞察（GOSM）', en: 'Chapter 5: Global Open Source Model Insight' },
    sub: {
      zh: '深入剖析开源大模型的供给格局、复用影响力与开放性分级体系，推动"开放"从二元概念走向光谱化、可度量的实践标准。本章基于 ATOM 项目等数据源持续更新。',
      en: 'An in-depth analysis of open-model supply, reuse influence and tiered openness — moving "openness" from a binary notion to a measurable spectrum. Continuously updated from sources including the ATOM Project.',
    },
    c1t: { zh: '基座模型衍生微调占比（月度）', en: 'Monthly derivatives share by base model' },
    c1s: { zh: 'Qwen 衍生占比峰值超 40%，Llama 份额从近 50% 回落至约 15%', en: 'Qwen derivatives peaked above 40%; Llama fell from ~50% to ~15%' },
    c2t: { zh: 'LMArena 社区 Elo：中美逐月对比', en: 'LMArena community Elo: monthly China vs US' },
    c2s: { zh: '2024 年 8 月起中国开源模型实现强势反超', en: 'China overtook from August 2024 and never looked back' },
    c3t: { zh: '新入局者累计下载（2025.7 起）', en: 'New entrants cumulative downloads (since Jul 2025)' },
  },
  conclusion: {
    heading: { zh: '第六章：未来展望与政策建议', en: 'Chapter 6: Outlook & Policy Recommendations' },
    trends: {
      zh: [
        { k: '范式转移', d: '从"代码共享"到"模型即数字公共品"，责任开源成为标杆' },
        { k: '治理进化', d: '自动化伦理审查与供应链安全实时监控成为社区标配' },
        { k: '资源重构', d: '算力瓶颈下，边缘计算 + 高效小模型与绿色开源兴起' },
        { k: '许可演进', d: 'RAIL 等负责任 AI 协议与经典许可证的混合模式主流化' },
      ],
      en: [
        { k: 'Paradigm Shift', d: 'From code sharing to models as digital public goods; responsible open source becomes the benchmark' },
        { k: 'Governance Evolution', d: 'Automated ethics review and real-time supply-chain security become standard' },
        { k: 'Resource Restructuring', d: 'Edge computing, efficient small models and green open source rise under compute constraints' },
        { k: 'License Evolution', d: 'Hybrid models mixing RAIL-style responsible AI terms with classic licenses go mainstream' },
      ],
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
