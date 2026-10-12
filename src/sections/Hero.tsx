import { useLang, pick } from '@/i18n';
import { cssVar } from '@/theme';
import avatar from '@/assets/brand/xlabai-avatar.png';

export default function Hero() {
  const { lang, t } = useLang();
  const deco = ['#67d5db', '#76d5e4', '#f2d15c', '#a0c86c'];
  return (
    <section id="top" className="relative overflow-hidden surf">
      <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx="930" cy="240" r="260" fill="none" stroke={cssVar('--cyan')} strokeOpacity=".25" strokeWidth="1.2" strokeDasharray="3 7" />
        <circle cx="930" cy="240" r="195" fill="none" stroke={cssVar('--brand')} strokeOpacity=".2" strokeWidth="1" />
        <circle cx="930" cy="240" r="130" fill="none" stroke={cssVar('--gold')} strokeOpacity=".25" strokeWidth="1" strokeDasharray="1 6" />
        <circle cx="180" cy="140" r="70" fill="none" stroke={cssVar('--p1')} strokeOpacity=".3" strokeWidth="1" strokeDasharray="2 5" />
        <path d="M60 640 Q 300 560 520 630 T 1160 600" stroke={cssVar('--cyan')} strokeOpacity=".25" fill="none" strokeWidth="1.2" />
        <path d="M0 672 Q 340 600 640 660 T 1200 640" stroke={cssVar('--brand')} strokeOpacity=".22" fill="none" strokeWidth="1" />
        {[...Array(26)].map((_, i) => (
          <circle key={i} cx={(i * 173) % 1200} cy={(i * 271) % 700} r={1.2 + (i % 3) * 0.7}
            fill={deco[i % 4]} fillOpacity={0.3 + (i % 4) * 0.1} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-28">
        <div className="flex items-center gap-4 mb-8">
          <img src={avatar} alt="" className="h-12 w-12 rounded-xl border" style={{ borderColor: 'var(--line)' }} />
          <p className="gv-kicker">{pick(t.hero.kicker, lang)}</p>
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-[1.06] tracking-tight gv-ink">
          {pick(t.hero.titleA, lang)}
          {pick(t.hero.titleB, lang) && <><br />{pick(t.hero.titleB, lang)}</>}
        </h1>
        <p className="mt-7 text-2xl md:text-3xl font-bold">
          <span style={{ color: 'var(--gold-text)' }}>{lang === 'zh' ? '开源向善' : 'OPEN SOURCE'}</span>
          <span className="gv-ink opacity-90"> {lang === 'zh' ? '' : 'FOR GOOD · '}</span>
          <span style={{ color: 'var(--cyan)' }}>{pick(t.hero.tagline, lang)}</span>
        </p>
        <p className="mt-4 text-sm tracking-[0.25em] uppercase gv-muted">{pick(t.hero.logic, lang)}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg"
            style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
            {pick(t.hero.edition, lang)} · 2026
          </span>
          <a href="#summary" className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all border hover:opacity-80"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>
            {pick(t.hero.cta, lang)} ↓
          </a>
        </div>
        <p className="mt-14 text-xs gv-muted">{pick(t.hero.dataNote, lang)}</p>
      </div>
    </section>
  );
}
