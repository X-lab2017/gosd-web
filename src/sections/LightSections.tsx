import { useLang, pick } from '@/i18n';
import OSDGWheel from '@/components/OSDGWheel';
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

/* ---- 开源向善宣言（固定深蓝金） ---- */
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

/* ---- 第一章 OSDGs（固定深蓝 + 目标轮） ---- */
export function OSDGs() {
  const { lang, t } = useLang();
  const pillars = lang === 'zh' ? t.ch1.pillars.zh : t.ch1.pillars.en;
  const quadColors = ['#68c8cc', '#77a9de', '#ad8acc', '#a0c86c'];
  return (
    <section className="surf-alt" style={{ background: 'var(--navy)' }}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="ch1" alt zh={t.ch1.heading.zh} en={t.ch1.heading.en} subZh={t.ch1.sub.zh} subEn={t.ch1.sub.en} />
        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          <OSDGWheel />
          <div className="grid gap-4">
            {pillars.map((p, i) => (
              <div key={i} className="rounded-2xl border p-5 flex items-start gap-4 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)' }}>
                <span className="mt-0.5 w-3 h-3 rounded-full shrink-0" style={{ background: quadColors[i % 4] }} />
                <div>
                  <h3 className="font-bold text-white">{p.k}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#9ebdcc]">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 rounded-xl border px-5 py-4 text-sm" style={{ borderColor: 'rgba(242,209,92,.3)', background: 'rgba(242,209,92,.06)', color: '#efe3b0' }}>
          ★ {pick(t.ch1.sdg, lang)}
        </p>
      </div>
    </section>
  );
}

/* ---- 第六章 ---- */
export function Conclusion() {
  const { lang, t } = useLang();
  const trends = lang === 'zh' ? t.conclusion.trends.zh : t.conclusion.trends.en;
  return (
    <section className="surf">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="conclusion" zh={t.conclusion.heading.zh} en={t.conclusion.heading.en} />
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {trends.map((tr, i) => (
            <div key={i} className="gv-card">
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--brand)' }}>
                {lang === 'zh' ? '趋势' : 'Trend'} {i + 1}
              </div>
              <h3 className="text-lg font-bold gv-ink">{tr.k}</h3>
              <p className="mt-2 text-sm gv-muted leading-relaxed">{tr.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- 附录 A ---- */
export function Appendix() {
  const { lang, t } = useLang();
  return (
    <section className="surf">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHead id="appendix" zh={t.appendix.heading.zh} en={t.appendix.heading.en} subZh={t.appendix.sub.zh} subEn={t.appendix.sub.en} />
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
