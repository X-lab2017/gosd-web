import { useMemo } from 'react';
import { useLang, pick } from '@/i18n';
import EChart from '@/components/EChart';
import derivatives from '@/data/fig-16_derivatives-per-base-model.json';
import elo from '@/data/fig-14_community-elo-rankings-lmarena.json';
import players from '@/data/fig-05_new-open-model-players.json';

function Panel({ title, sub, children, wide }: { title: string; sub: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`gv-panel !bg-transparent p-5 ${wide ? 'lg:col-span-2' : ''}`} style={{ borderColor: '#3a657d' }}>
      <h4 className="text-sm font-bold" style={{ color: '#f6fbff' }}>{title}</h4>
      <p className="text-xs mt-0.5 mb-2" style={{ color: '#7fa3b5' }}>{sub}</p>
      {children}
    </div>
  );
}

export default function GOSM() {
  const { lang, t } = useLang();

  const derivOpt = useMemo(() => {
    const rows = derivatives as Record<string, number | string>[];
    const keys = ['qwen', 'llama', 'deepseek', 'mistral', 'openai'];
    return {
      xAxis: { type: 'category', data: rows.map(r => String(r.period).trim()), axisLabel: { fontSize: 10, interval: 2 } },
      yAxis: { type: 'value' },
      series: keys.map(k => ({
        name: k, type: 'line', smooth: true, showSymbol: false, stack: 's',
        areaStyle: { opacity: 0.22 }, emphasis: { focus: 'series' as const },
        data: rows.map(r => r[k]),
      })),
      legend: { top: 0 },
    };
  }, []);

  const eloOpt = useMemo(() => {
    const rows = elo as Record<string, number | string>[];
    const names = {
      usScore: { zh: '美国', en: 'US' },
      chinaScore: { zh: '中国', en: 'China' },
      otherScore: { zh: '其他地区', en: 'Others' },
    } as const;
    return {
      xAxis: { type: 'category', data: rows.map(r => String(r.month)), axisLabel: { fontSize: 10, interval: 3 } },
      yAxis: { type: 'value', min: 1150 },
      series: (Object.keys(names) as (keyof typeof names)[]).map(k => ({
        name: names[k][lang], type: 'line' as const, smooth: true, showSymbol: false,
        lineStyle: { width: 2.5 }, data: rows.map(r => r[k]),
      })),
      legend: { top: 0 },
    };
  }, [lang]);

  const playersOpt = useMemo(() => {
    const rows = players as Record<string, number | string>[];
    const names: Record<string, { zh: string; en: string }> = {
      deepseek: { zh: 'DeepSeek', en: 'DeepSeek' },
      huggingface: { zh: 'Hugging Face', en: 'Hugging Face' },
      openai: { zh: 'OpenAI', en: 'OpenAI' },
      nvidia: { zh: 'NVIDIA', en: 'NVIDIA' },
      moonshotai: { zh: 'Moonshot AI', en: 'Moonshot AI' },
      minimax: { zh: 'MiniMax', en: 'MiniMax' },
      zaiOrg: { zh: '智谱 Z.ai', en: 'Z.ai' },
    };
    return {
      xAxis: { type: 'category', data: rows.map(r => String(r.period)), axisLabel: { fontSize: 10, interval: 4 } },
      yAxis: { type: 'value' },
      series: Object.keys(names).map(k => ({
        name: names[k][lang], type: 'line' as const, smooth: true, showSymbol: false,
        lineStyle: { width: 2.2 },
        data: rows.map(r => r[k]),
      })),
      legend: { top: 0 },
    };
  }, [lang]);

  return (
    <section id="ch5" className="surf-alt py-20 md:py-28 scroll-mt-16" style={{ background: 'var(--navy)' }}>
      <div className="mx-auto max-w-6xl px-5">
        <p className="gv-kicker">{lang === 'zh' ? '全球开源大模型洞察 · GOSM' : 'Global Open Source Model Insight'}</p>
        <h2 className="text-3xl md:text-4xl font-black mt-3" style={{ color: '#f6fbff' }}>{pick(t.ch5.heading, lang)}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-[15px]" style={{ color: '#bad2de' }}>{pick(t.ch5.sub, lang)}</p>

        <div className="mt-10 grid gap-6">
          <Panel title={pick(t.ch5.c1t, lang)} sub={pick(t.ch5.c1s, lang)} wide>
            <EChart option={derivOpt} height={360} />
          </Panel>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title={pick(t.ch5.c2t, lang)} sub={pick(t.ch5.c2s, lang)}>
              <EChart option={eloOpt} height={320} />
            </Panel>
            <Panel title={pick(t.ch5.c3t, lang)} sub={pick(t.ch5.c2s, lang)}>
              <EChart option={playersOpt} height={320} />
            </Panel>
          </div>
        </div>
        <p className="mt-6 text-xs" style={{ color: '#7fa3b5' }}>
          {pick({ zh: '数据快照：ATOM Project（atomproject.ai），2025 年 12 月。正式版将以 OpenDigger / ATOM 实时数据管线自动更新。', en: 'Data snapshot: ATOM Project (atomproject.ai), Dec 2025. The final release will auto-update via the OpenDigger / ATOM pipeline.' }, lang)}
        </p>
      </div>
    </section>
  );
}
