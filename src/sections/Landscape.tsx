import { useLang, pick } from '@/i18n';

export default function Landscape() {
  const { lang, t } = useLang();
  const fields = t.ch4.fields[lang];
  const accents = ['#68c8cc', '#77a9de', '#f2d15c', '#ad8acc', '#a0c86c', '#e8a06a'];
  return (
    <section id="ch4" className="surf py-20 md:py-28 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5">
        <p className="gv-kicker">{lang === 'zh' ? '全球开源技术全景 · GOSL' : 'Global Open Source Technology Landscape'}</p>
        <h2 className="gv-h2 mt-3">{pick(t.ch4.heading, lang)}</h2>
        <p className="mt-4 max-w-3xl gv-sub">{pick(t.ch4.sub, lang)}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f, i) => (
            <div key={i} className="gv-card" style={{ borderTop: `3px solid ${accents[i % 6]}` }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black" style={{ color: 'var(--ink)', opacity: 0.18 }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="gv-chip">{pick(t.ch4.status, lang)}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold gv-ink">{f.k}</h3>
              <p className="mt-2 text-sm gv-muted leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
