import { useLang, pick } from '@/i18n';
import { useTheme } from '@/theme';
import logo from '@/assets/brand/xlabai-horizontal-dark.png';

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();
  const items: { id: string; label: string }[] = [
    { id: 'summary', label: pick(t.nav.summary, lang) },
    { id: 'declaration', label: pick(t.nav.declaration, lang) },
    { id: 'ch1', label: pick(t.nav.ch1, lang) },
    { id: 'ch2', label: pick(t.nav.ch2, lang) },
    { id: 'ch3', label: pick(t.nav.ch3, lang) },
    { id: 'ch4', label: pick(t.nav.ch4, lang) },
    { id: 'ch5', label: pick(t.nav.ch5, lang) },
    { id: 'conclusion', label: pick(t.nav.conclusion, lang) },
    { id: 'appendix', label: pick(t.nav.appendix, lang) },
  ];
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ background: 'color-mix(in srgb, var(--bg) 88%, transparent)', borderColor: 'var(--line)' }}>
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-4">
        <a href="#top" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="X-lab AI" className="h-9 w-auto" />
          <span className="h-5 w-px hidden sm:block" style={{ background: 'var(--line)' }} />
          <span className="font-bold tracking-wide text-sm hidden sm:block gv-ink">
            GOSD <span style={{ color: 'var(--gold-text)' }}>2026</span>
          </span>
        </a>
        <nav className="flex-1 overflow-x-auto whitespace-nowrap flex items-center gap-1 text-[13px] gv-muted">
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`} className="px-2.5 py-1.5 rounded-full hover:opacity-100 transition-colors"
              style={{ color: 'inherit' }}>{it.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggle} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 rounded-full border grid place-items-center text-sm transition-colors"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <div className="flex items-center rounded-full border text-xs font-semibold overflow-hidden"
            style={{ borderColor: 'var(--line)' }}>
            <button onClick={() => setLang('zh')}
              className="px-3 py-1.5 transition-colors"
              style={lang === 'zh' ? { background: 'var(--ink)', color: 'var(--bg)' } : { color: 'var(--muted)' }}>中</button>
            <button onClick={() => setLang('en')}
              className="px-3 py-1.5 transition-colors"
              style={lang === 'en' ? { background: 'var(--ink)', color: 'var(--bg)' } : { color: 'var(--muted)' }}>EN</button>
          </div>
        </div>
      </div>
    </header>
  );
}
