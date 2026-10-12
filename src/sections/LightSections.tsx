import { useLang, pick } from '@/i18n';
import logo from '@/assets/brand/xlabai-horizontal-dark.png';

function SectionHead({ id, zh, en, subZh, subEn, alt }: { id: string; zh: string; en: string; subZh?: string; subEn?: string; alt?: boolean }) {
  const { lang } = useLang();
  return (
    <div id={id} className="scroll-mt-24 max-w-3xl">
      <p className="gv-kicker">{lang === 'zh' ? 'Global Open Source Development Report' : '全球开源发展报告'}</p>
      <h2 className="gv-h2 mt-3" style={alt ? { color: '#f6fbff' } : undefined}>{lang === 'zh' ? zh : en}</h2>
      {subZh && <p className={`gv-sub mt-4 ${alt ? '!text-[#bad2de]' : ''}`}>{lang === 'zh' ? subZh : subEn}</p>}
    </div>
  );
}

/* ---- 执行摘要 ---- */
export function Summary() {
  const { lang, t } = useLang();
  return (
    <section className="surf">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="summary" zh={t.summary.heading.zh} en={t.summary.heading.en} />
        <div className="mt-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-5 gv-ink leading-relaxed text-[15px]">
            <p className="first-letter:text-4xl first-letter:font-black first-letter:mr-1" style={{ color: 'var(--brand)' }}>{pick(t.summary.p1, lang)}</p>
            <p className="gv-muted">{pick(t.summary.p2, lang)}</p>
            <p className="gv-muted">{pick(t.summary.p3, lang)}</p>
          </div>
          <div className="lg:col-span-2 grid gap-4">
            {[
              { v: pick(t.summary.stat1v, lang), l: pick(t.summary.stat1l, lang) },
              { v: pick(t.summary.stat2v, lang), l: pick(t.summary.stat2l, lang) },
              { v: pick(t.summary.stat3v, lang), l: pick(t.summary.stat3l, lang) },
            ].map((s, i) => (
              <div key={i} className="gv-card" style={{ borderLeft: '4px solid var(--gold)' }}>
                <div className="text-4xl font-black gv-ink">{s.v}</div>
                <div className="mt-1 text-sm gv-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- 引言宣言（固定深蓝金） ---- */
export function Declaration() {
  const { lang, t } = useLang();
  return (
    <section className="surf-alt">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="declaration" alt zh={t.declaration.heading.zh} en={t.declaration.heading.en} subZh={t.declaration.p1.zh} subEn={t.declaration.p1.en} />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(lang === 'zh' ? t.declaration.principles.zh : t.declaration.principles.en).map((p, i) => (
            <div key={i} className="rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)' }}>
              <div className="w-8 h-8 rounded-lg grid place-items-center text-sm font-black mb-3"
                style={i % 2 === 0 ? { background: 'rgba(103,213,219,.15)', color: '#67d5db' } : { background: 'rgba(242,209,92,.15)', color: '#f2d15c' }}>
                {i + 1}
              </div>
              <p className="text-sm font-semibold leading-snug text-white/90">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- 第六章 ---- */
const CH6 = {
  trends: {
    zh: [
      { k: '范式转移：从"代码共享"到"模型即数字公共品"', p: '单纯的技术开源将向"责任开源"转型：标杆项目不仅公开代码与权重，更强调训练数据可追溯、伦理合规与长期治理结构透明。获得 AI DPG 认证的项目将成为政府采购与全球协作的首选标准。' },
      { k: '治理进化：敏捷响应与实时合规成为刚需', p: '面对 Agentic AI 的自主决策风险，静态合规框架已失效："自动化伦理审查"与"供应链安全实时监控"将成为社区标配，SBOM 将从代码扩展到模型参数层与数据集层。' },
      { k: '资源重构：算力瓶颈下的"分布式绿色计算"', p: '"边缘计算 + 小参数高效模型"将迎来爆发；"绿色开源"成为硬性指标，项目将被要求披露碳排放数据并提供能耗优化版本；DePIN 与开源社区结合可能成为解决算力不均的新路径。' },
      { k: '许可演进：混合许可模式的主流化', p: '"负责任 AI 使用协议（RAIL）"与经典开放许可证的结合将成为主流：底层基础框架保持完全开源构建生态，上层应用或高风险功能采用受限许可保护商业利益与安全边界。' },
    ],
    en: [
      { k: 'Paradigm shift: from code sharing to models as digital public goods', p: 'Technical openness alone will give way to "responsible open source": benchmark projects will emphasize data provenance, ethical compliance and transparent long-term governance. AI DPG certification will become the preferred standard for government procurement and global collaboration.' },
      { k: 'Governance evolution: agile response & real-time compliance', p: 'Static compliance frameworks fail against autonomous agentic risks: automated ethics review and real-time supply-chain security monitoring will become community defaults, and SBOMs will extend from code to model weights and datasets.' },
      { k: 'Resource restructuring: distributed green computing under compute constraints', p: 'Edge computing plus efficient small models will boom; "green open source" becomes a hard requirement with carbon disclosure and energy-optimized builds; DePIN combined with open communities may ease compute inequality.' },
      { k: 'License evolution: hybrid licensing goes mainstream', p: 'RAIL-style responsible-AI terms combined with classic open licenses will dominate: fully open base frameworks to build ecosystems, restricted terms for upper-layer apps or high-risk functions.' },
    ],
  },
  gov: {
    title: { zh: '面向政府部门：从"监管者"转向"赋能者"', en: 'For governments: from regulator to enabler' },
    zh: [
      ['构建国家级开源战略基础设施', '资助中立透明的 AI 性能与安全基准测试中心；设立政府背书的公共数据集与多语言开源模型仓库，优先支持教育、医疗、环保等 SDGs 领域。'],
      ['完善适配开源创新的法律监管框架', '确立"数字公共产品"法律地位并推动 DPG 认证国际互认；对无重大过错的贡献者适用"避风港原则"；公共部门采购强制遵循开放接口标准，防止供应商锁定。'],
      ['设立专项基金支持长期维护', '实施"关键基础设施护航计划"，为操作系统、数据库、基础 AI 框架的核心维护者薪资、安全审计与漏洞奖励提供资金；引导企业研发预算划拨"上游优先"比例。'],
    ],
    en: [
      ['Build national open source strategic infrastructure', 'Fund neutral, transparent AI benchmarking centers; back public datasets and multilingual open-model repositories prioritizing SDG domains like education, health and environment.'],
      ['Modernize legal & regulatory frameworks', 'Establish legal status for digital public goods with mutual DPG recognition; apply safe-harbor principles to good-faith contributors; mandate open interfaces in public procurement to prevent vendor lock-in.'],
      ['Create funds for long-term maintenance', 'Launch a critical-infrastructure stewardship program covering maintainer salaries, security audits and bug bounties; guide enterprises to earmark an "upstream-first" share of R&D budgets.'],
    ],
  },
  biz: {
    title: { zh: '面向企业与组织：从"成本中心"转向"价值引擎"', en: 'For enterprises: from cost center to value engine' },
    zh: [
      ['品牌与人才战略', '将开源作为展示技术实力、吸引顶尖人才和提升品牌声誉的手段，积极参与顶级社区治理，提升行业标准话语权；切忌"假开源"。'],
      ['透明且负责任的发布流程', '发布开源 AI 项目时同步发布 Model Cards 与 Safety Guides，披露局限性、潜在偏见及环境影响；建立内部供应链扫描与依赖管理机制，积极回馈上游。'],
      ['拥抱去中心化协作', '将旗舰项目移交 Linux 基金会、Apache、开放原子等中立机构托管；参与跨行业开源联盟，共同定义下一代互联网基础设施标准。'],
    ],
    en: [
      ['Brand & talent strategy', 'Use open source to demonstrate engineering strength, attract top talent and build brand; engage in governance of top communities — and avoid "openwashing".'],
      ['Transparent, responsible release process', 'Ship Model Cards and Safety Guides with every open AI project, disclosing limitations, biases and environmental impact; run internal supply-chain scanning and give back upstream.'],
      ['Embrace decentralized collaboration', 'Move flagship projects to neutral stewardship (Linux Foundation, Apache, OpenAtom); join cross-industry alliances to co-define next-generation infrastructure standards.'],
    ],
  },
  comm: {
    title: { zh: '面向全球社区的行动倡议', en: 'Call to action for the global community' },
    zh: [
      ['捍卫开源精神', '警惕以专利壁垒、服务条款或技术手段限制用户自由的行为；反对社区歧视，营造包容多元的交流氛围。'],
      ['促进全球包容性发展', '加强与全球南方的合作：本地化翻译、低门槛工具适配、在线技能培训；基础软件与大模型优先支持小语种及非西方文化语境。'],
      ['共同守护数字伦理底线', '对恶意利用开源技术制造虚假信息、深度伪造的行为零容忍；鼓励将开源力量投入气候变化、公共卫生、教育公平等全球挑战。'],
    ],
    en: [
      ['Defend the spirit of open source', 'Stay alert to patent barriers, terms of service or technical means restricting user freedom; oppose discrimination and foster inclusive communities.'],
      ['Advance global inclusion', 'Partner with the Global South: localized translations, low-barrier tooling, online skills training; prioritize minor languages and non-Western cultural contexts in base software and models.'],
      ['Guard digital ethics together', 'Zero tolerance for misuse such as disinformation and deepfakes; channel open source into climate change, public health and education equity.'],
    ],
  },
  closing: {
    zh: '回顾 2025—2026 年，全球开源生态正处于历史性的转折点。我们期待一个更加公平、透明、绿色且可持续的全球开源 AI 生态系统：政府提供肥沃的制度土壤，企业贡献坚实的工程基础，社区激发无限的创新活力，个人享受技术的普惠福祉。开源不仅是一种开发模式，更是一种关于信任、协作与共享的全球文明形态。',
    en: 'Looking back at 2025–2026, global open source stands at a historic inflection point. We look forward to a more equitable, transparent, green and sustainable open-source AI ecosystem: governments providing fertile institutional soil, enterprises contributing solid engineering, communities sparking boundless innovation, and individuals enjoying inclusive wellbeing. Open source is not just a development model — it is a global civilization of trust, collaboration and sharing.',
  },
} as const;

export function Conclusion() {
  const { lang } = useLang();
  const trends = CH6.trends[lang];
  const sections = [
    { t: CH6.gov.title, rows: CH6.gov[lang] },
    { t: CH6.biz.title, rows: CH6.biz[lang] },
    { t: CH6.comm.title, rows: CH6.comm[lang] },
  ];
  return (
    <section id="conclusion" className="surf scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead
          id="conclusion-inner"
          zh="第六章：未来展望与政策建议" en="Chapter 6: Outlook & Policy Recommendations"
          subZh="基于前五章 GOSO、GOSR、GOSL、GOSM 的深度分析，识别出重塑未来 3—5 年全球 AI 基础设施的四大趋势，并面向政府、企业与全球社区提出行动建议。"
          subEn="Building on GOSO, GOSR, GOSL and GOSM, we identify four trends reshaping global AI infrastructure over the next 3–5 years, with recommendations for governments, enterprises and the global community."
        />
        <h3 className="mt-12 gv-h3">{lang === 'zh' ? '6.1 核心洞察与趋势预测' : '6.1 Key insights & trend forecasts'}</h3>
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {trends.map((tr, i) => (
            <div key={i} className="gv-card">
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--brand)' }}>
                {lang === 'zh' ? '趋势' : 'Trend'} {i + 1}
              </div>
              <h4 className="text-lg font-bold gv-ink leading-snug">{tr.k}</h4>
              <p className="mt-2 text-sm gv-muted leading-relaxed">{tr.p}</p>
            </div>
          ))}
        </div>
        {sections.map((sec, si) => (
          <div key={si} className="mt-12">
            <h3 className="gv-h3">{pick(sec.t, lang)}</h3>
            <div className="mt-5 grid md:grid-cols-3 gap-4">
              {sec.rows.map((r, i) => (
                <div key={i} className="gv-card !p-5">
                  <div className="w-7 h-7 rounded-lg grid place-items-center text-xs font-black mb-3"
                    style={{ background: 'rgba(103,213,219,.12)', color: 'var(--brand)' }}>{i + 1}</div>
                  <h4 className="font-bold gv-ink text-[15px]">{r[0]}</h4>
                  <p className="mt-1.5 text-[13px] gv-muted leading-relaxed">{r[1]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="mt-12 rounded-xl border px-6 py-5 text-sm leading-8" style={{ borderColor: 'rgba(242,209,92,.3)', background: 'rgba(242,209,92,.06)', color: 'var(--ink)' }}>
          <span className="font-black mr-2" style={{ color: 'var(--gold-text)' }}>{lang === 'zh' ? '结语' : 'Closing'}</span>
          {pick(CH6.closing, lang)}
        </p>
      </div>
    </section>
  );
}

/* ---- 附录 A + DPG 框架 ---- */
const DPG = {
  title: { zh: '附录 B：开源 AI 数字公共产品（DPG）评估框架', en: 'Appendix B: Open Source AI as Digital Public Goods (DPG)' },
  sub: {
    zh: '一个开源 AI 系统须同时满足四个维度标准，方可认定为数字公共产品；评估矩阵按维度打分（满分 10 分）：≥8.5 分为金牌 DPG，7.0—8.5 分为银牌 DPG，<7.0 分为普通开源项目。',
    en: 'An open AI system must satisfy all four dimensions to qualify as a DPG. The assessment matrix scores each dimension (out of 10): ≥8.5 = Gold DPG; 7.0–8.5 = Silver DPG; <7.0 = general open source project.',
  },
  dims: {
    zh: [
      ['开放访问', '权重、训练/推理代码与数据集文档免费无歧视开放；提供多语言支持与量化等低门槛版本'],
      ['开放许可', '采用 OSI 认可许可证；权利保留最小化；针对偏见、幻觉等 AI 特有风险提供使用指南与免责声明'],
      ['互操作性与标准化', '使用开放模型格式而非私有格式；遵循行业标准 API（如 OpenAI Compatible API）'],
      ['社区驱动与可持续性', '多元社区参与而非单一实体黑盒；有路线图、资金机制或治理结构保障 3—5 年持续维护'],
    ],
    en: [
      ['Open access', 'Weights, training/inference code and dataset docs free and non-discriminatory; multilingual support and quantized low-barrier variants'],
      ['Open license', 'OSI-approved licenses; minimal rights reservation; usage guides and disclaimers for AI-specific risks like bias and hallucination'],
      ['Interoperability & standards', 'Open model formats instead of proprietary ones; industry-standard APIs (e.g. OpenAI-compatible)'],
      ['Community & sustainability', 'Plural community participation rather than a single-entity black box; roadmap, funding or governance ensuring 3–5 years of maintenance'],
    ],
  },
  phases: {
    zh: ['第一阶段 · 基础合规：审查许可证、清理训练数据、完善多语言文档与模型卡片', '第二阶段 · 增强可用性：多语言扩展、轻量化适配、建立公开反馈渠道', '第三阶段 · 生态共建：申请 DPG 联盟认证、移交中立机构托管、主动对接 SDGs'],
    en: ['Phase 1 · Basic compliance: license review, training-data cleanup, multilingual docs & model cards', 'Phase 2 · Enhanced accessibility: language expansion, lightweight variants, open feedback channels', 'Phase 3 · Ecosystem building: DPG Alliance certification, neutral stewardship, SDG alignment'],
  },
} as const;

export function Appendix() {
  const { lang, t } = useLang();
  return (
    <section id="appendix" className="surf">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="appendix-a" zh={t.appendix.heading.zh} en={t.appendix.heading.en} subZh={t.appendix.sub.zh} subEn={t.appendix.sub.en} />
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="gv-card !p-7">
            <h3 className="font-bold mb-4 gv-ink">{pick(t.appendix.behaviors, lang)}</h3>
            <table className="gv-table">
              <thead>
                <tr>
                  <th className="pb-2">OI</th><th className="pb-2">ID</th><th className="pb-2">OPR</th><th className="pb-2">PRR</th><th className="pb-2">MPR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2.5 pr-2">{lang === 'zh' ? '创建议题' : 'Open Issue'}</td>
                  <td className="py-2.5 pr-2">{lang === 'zh' ? '议题讨论' : 'Issue Discussion'}</td>
                  <td className="py-2.5 pr-2">{lang === 'zh' ? '提交代码请求' : 'Open PR'}</td>
                  <td className="py-2.5 pr-2">{lang === 'zh' ? '代码评审' : 'PR Review'}</td>
                  <td className="py-2.5">{lang === 'zh' ? '合并代码请求' : 'Merge PR'}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs gv-muted leading-relaxed">
              {lang === 'zh'
                ? '统计周期：2025-07-01 至 2026-06-30；Activity 行为权重：OI 2.2235 / ID 0.5252 / OPR 4.0679 / PRR 0.7427 / MPR 2.0339。完整口径见附录 A（指标体系与数据来源）。'
                : 'Period: 2025-07-01 to 2026-06-30; Activity weights: OI 2.2235 / ID 0.5252 / OPR 4.0679 / PRR 0.7427 / MPR 2.0339. Full definitions: Appendix A.'}
            </p>
          </div>
          <div className="gv-card !p-7">
            <h3 className="font-bold mb-4 gv-ink">{pick(t.appendix.sources, lang)}</h3>
            <ul className="space-y-3 text-sm gv-ink">
              {(lang === 'zh' ? t.appendix.srcList.zh : t.appendix.srcList.en).map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--brand)' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <SectionHead id="appendix-dpg" zh={DPG.title.zh} en={DPG.title.en} subZh={DPG.sub.zh} subEn={DPG.sub.en} />
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {DPG.dims[lang].map((d, i) => (
              <div key={i} className="gv-card !p-5" style={{ borderTop: '3px solid var(--gold)' }}>
                <h4 className="font-bold gv-ink">{i + 1}. {d[0]}</h4>
                <p className="mt-1.5 text-[13px] gv-muted leading-relaxed">{d[1]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {DPG.phases[lang].map((p, i) => (
              <div key={i} className="rounded-xl border px-5 py-4 text-[13px] leading-relaxed" style={{ borderColor: 'var(--line)', background: 'var(--surface)', color: 'var(--muted)' }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- 页脚 ---- */
export function Footer() {
  const { lang, t } = useLang();
  return (
    <footer className="surf-alt" style={{ background: '#072641' }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <img src={logo} alt="X-lab AI" className="h-10 w-auto" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            {[
              ['https://github.com/X-lab2017/2026-Global-Open-Source-Development-Report', `GitHub ↗ ${pick(t.footer.repo, lang)}`],
              ['https://github.com/X-lab2017/gosd-web', 'gosd-web ↗'],
              ['https://open-digger.cn', 'OpenDigger ↗'],
              ['https://github.com/X-lab2017/osdg-brand', 'OSDG Brand ↗'],
            ].map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f2d15c]" style={{ color: '#67d5db' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-sm leading-relaxed max-w-3xl" style={{ color: '#7fa3b5' }}>{pick(t.footer.ack, lang)}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: '#5d8296' }}>
          <span>{pick(t.footer.license, lang)}</span>
          <span>© 2026 CCOSI · X-lab · Global Open Source Development Report</span>
        </div>
      </div>
    </footer>
  );
}
