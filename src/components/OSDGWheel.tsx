import { useLang } from '@/i18n';

/**
 * OSDG 目标轮 —— 复刻历届报告设计：
 * 外环 11 个细分目标段，内环四大象限（生机/贡献/联结/演进），中心 OSDG。
 */

interface Seg { label: string; a0: number; a1: number }
interface Quad { key: string; zh: string; en: string; color: string; a0: number; a1: number; segs: string[] }

// 角度制：0° = 正上方，顺时针递增
const C = 200;
const pt = (r: number, a: number): [number, number] => [C + r * Math.sin(a * Math.PI / 180), C - r * Math.cos(a * Math.PI / 180)];

function segPath(a0: number, a1: number, r0: number, r1: number): string {
  const [x0, y0] = pt(r1, a0);
  const [x1, y1] = pt(r1, a1);
  const [x2, y2] = pt(r0, a1);
  const [x3, y3] = pt(r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r1} ${r1} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${r0} ${r0} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`;
}

function ArcText({ text, r, a0, a1, size, color, bold = true }: { text: string; r: number; a0: number; a1: number; size: number; color: string; bold?: boolean }) {
  const a = (a0 + a1) / 2;
  const [x, y] = pt(r, a);
  return (
    <text x={x} y={y} transform={`rotate(${a} ${x} ${y})`} textAnchor="middle" dominantBaseline="middle"
      fontSize={size} fontWeight={bold ? 800 : 600} fill={color} letterSpacing="2" style={{ textTransform: 'uppercase' }}>
      {text}
    </text>
  );
}

export default function OSDGWheel() {
  const { lang } = useLang();

  const quads: Quad[] = [
    { key: 'vitality', zh: '开源生机', en: 'Vitality', color: '#a5c93f', a0: 270, a1: 360, segs: ['1.1', '1.2', '1.3'] },
    { key: 'contribution', zh: '开源贡献', en: 'Contribution', color: '#2f9e96', a0: 0, a1: 90, segs: ['2.1', '2.2'] },
    { key: 'connection', zh: '开源联结', en: 'Connection', color: '#b04a8c', a0: 90, a1: 180, segs: ['3.1', '3.2', '3.3'] },
    { key: 'evolution', zh: '开源演进', en: 'Evolution', color: '#6fa84c', a0: 180, a1: 270, segs: ['4.1', '4.2', '4.3'] },
  ];

  const GAP = 2.5; // 段间隙
  const outer: Seg[] = [];
  quads.forEach(q => {
    const span = (q.a1 - q.a0) / q.segs.length;
    q.segs.forEach((label, i) => {
      const a0 = q.a0 + i * span + GAP / 2;
      const a1 = q.a0 + (i + 1) * span - GAP / 2;
      outer.push({ label, a0, a1 });
    });
  });

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[440px] mx-auto" role="img" aria-label="OSDG wheel">
      <defs>
        <radialGradient id="osdgGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 外圈装饰虚线 */}
      <circle cx={C} cy={C} r={196} fill="none" stroke="#9ad744" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 7" />
      <circle cx={C} cy={C} r={88} fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1 4" />

      {/* 外环：细分目标 */}
      {outer.map(s => {
        const quad = quads.find(q => s.a0 >= q.a0 - 0.01 && s.a1 <= q.a1 + 0.01)!;
        return (
          <g key={s.label}>
            <path d={segPath(s.a0, s.a1, 152, 186)} fill={quad.color} fillOpacity="0.88" stroke="#101719" strokeWidth="1.5" />
            <ArcText text={s.label} r={169} a0={s.a0} a1={s.a1} size={13} color="#101719" />
          </g>
        );
      })}

      {/* 内环：四象限 */}
      {quads.map(q => (
        <g key={q.key}>
          <path d={segPath(q.a0 + 1.5, q.a1 - 1.5, 104, 144)} fill={q.color} fillOpacity="0.32" stroke={q.color} strokeOpacity="0.7" strokeWidth="1" />
          <ArcText text={lang === 'zh' ? q.zh : q.en} r={124} a0={q.a0} a1={q.a1} size={15} color={q.color} />
        </g>
      ))}

      {/* 象限分隔白线 */}
      {[0, 90, 180, 270].map(a => {
        const [x0, y0] = pt(96, a);
        const [x1, y1] = pt(188, a);
        return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#f7f9fa" strokeOpacity="0.85" strokeWidth="2.5" />;
      })}

      {/* 中心圆 */}
      <circle cx={C} cy={C} r={82} fill="#171a1f" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx={C} cy={C} r={82} fill="url(#osdgGlow)" />
      <text x={C} y={C - 6} textAnchor="middle" fontSize={26} fontWeight={900} fill="#ffffff" letterSpacing="1">OSDG</text>
      <text x={C} y={C + 18} textAnchor="middle" fontSize={10.5} fill="#9fb2b8" letterSpacing="2">
        {lang === 'zh' ? '开源发展目标' : 'OPEN SOURCE DEV GOALS'}
      </text>
    </svg>
  );
}
