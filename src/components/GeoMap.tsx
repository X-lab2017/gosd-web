import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import EChart from '@/components/EChart';
import { chartTokens, cssVar } from '@/theme';

export interface MapDatum { name: string; value: number; nameZh?: string }

/** 缓存键为完整资源地址；同一地图名在不同路径下互不串用 */
const geoCache = new Map<string, Promise<{ regName: string; names: string[] }>>();

function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * 加载并注册 GeoJSON（与 osdg-brand data-viz 定稿一致）。
 * 注册名带 URL 哈希后缀，避免 ECharts 全局 registerMap 同名冲突；
 * 失败时从缓存驱逐，组件重试可重新发起请求。
 */
function loadGeo(map: 'world' | 'CN', geoBasePath: string): Promise<{ regName: string; names: string[] }> {
  const url = `${geoBasePath.replace(/\/$/, '')}/${map}.json`;
  let p = geoCache.get(url);
  if (!p) {
    const regName = `${map}@${hashUrl(url)}`;
    const propName = map === 'CN' ? 'fullname' : 'name';
    p = fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`geo load failed: ${r.status}`);
        return r.json();
      })
      .then((geo: unknown) => {
        echarts.registerMap(regName, geo as never);
        const feats = (geo as { features?: { properties?: Record<string, string | undefined> }[] }).features ?? [];
        return { regName, names: feats.map(f => f.properties?.[propName]).filter((n): n is string => !!n) };
      })
      .catch((e) => { geoCache.delete(url); throw e; });
    geoCache.set(url, p);
  }
  return p;
}

interface Props {
  map: 'world' | 'CN';
  /** 地图名匹配 GeoJSON：world → properties.name（英文国名）；CN → properties.fullname（如"北京市"） */
  data: MapDatum[];
  height?: number;
  unit?: string;
  /** 点击国家/省份回调（世界地图用于中国下钻）。事件只在初始化时绑定一次，回调经 ref 始终读取最新值 */
  onPick?: (name: string) => void;
  /** 视觉映射上限；默认取 P95 避免头部国家压扁色阶 */
  max?: number;
  /** GeoJSON 目录路径（默认 /maps，目录下需有 world.json / CN.json） */
  geoBasePath?: string;
  /**
   * 无障碍：地图下方附带可键盘操作的数据列表（<details> 折叠）。
   * 提供 onPick 时地区为原生按钮，键盘用户可 Enter/Space 触发同一回调（如中国下钻）。
   */
  a11yList?: boolean;
}

export default function GeoMap({ map, data, height = 420, unit = '', onPick, max, geoBasePath = '/maps', a11yList = true }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [geo, setGeo] = useState<{ regName: string; names: string[] } | null>(null);
  const [, setPicked] = useState<string | null>(null);

  // 事件只在 EChart 初始化时绑定一次（onReady 空依赖），
  // 点击回调必须经 ref 读取最新的 onPick，否则 prop 变化后仍调用旧闭包
  const onPickRef = useRef(onPick);
  useEffect(() => { onPickRef.current = onPick; });

  useEffect(() => {
    let live = true;
    setReady(false);
    setError(false);
    loadGeo(map, geoBasePath)
      .then((g) => { if (live) { setGeo(g); setReady(true); } })
      .catch((e) => { console.error('[GeoMap] load failed:', e); if (live) setError(true); });
    return () => { live = false; };
  }, [map, geoBasePath]);

  const option = useMemo(() => {
    if (!ready || !geo) return null;
    const t = chartTokens();
    const values = data.map(d => d.value).filter(v => v > 0).sort((a, b) => a - b);
    const p95 = values[Math.floor(values.length * 0.95)] ?? values[values.length - 1] ?? 1;
    const vMax = max ?? Math.ceil(p95);
    // 系列级 areaColor 会覆盖 visualMap 的数值配色，因此只对“无数据”区域显式给底色，
    // 让有效数据区域完全交给 visualMap 着色。
    const known = new Set(data.map(d => d.name));
    const filled: unknown[] = [...data];
    for (const n of geo.names) {
      if (!known.has(n)) filled.push({ name: n, value: NaN, itemStyle: { areaColor: t.mapEmpty } });
    }
    return {
      tooltip: {
        trigger: 'item',
        formatter: (ps: { name: string; value: number | undefined; dataIndex: number }) => {
          const d = data.find(d => d.name === ps.name);
          const v = d?.value;
          const label = d?.nameZh ?? ps.name;
          return `${label}<br/>${unit ? unit + ': ' : ''}${v == null ? '—' : v.toLocaleString()}`;
        },
      },
      visualMap: {
        min: 0, max: vMax, left: 8, bottom: 0, itemHeight: 90, itemWidth: 12,
        text: [`${(vMax / (map === 'world' ? 1e4 : 1)).toLocaleString()}${map === 'world' ? '万' : ''}`, '0'],
        textStyle: { color: t.subtext, fontSize: 10 },
        inRange: { color: t.inRange },
        outOfRange: { color: t.inRange[t.inRange.length - 1] },
        calculable: false,
      },
      series: [{
        type: 'map', map: geo.regName, roam: false,
        nameProperty: map === 'CN' ? 'fullname' : 'name',
        data: filled,
        zoom: map === 'CN' ? 1.05 : 1.0,
        label: { show: false },
        itemStyle: {
          borderColor: cssVar('--line'),
          borderWidth: 0.6,
        },
        emphasis: {
          label: { show: true, fontSize: 11, color: cssVar('--ink') },
          itemStyle: { areaColor: cssVar('--gold') }, // 装饰金（选中/hover）
        },
        select: {
          label: { show: true, fontSize: 11, color: cssVar('--ink') },
          itemStyle: { areaColor: cssVar('--gold'), borderColor: cssVar('--ink'), borderWidth: 1 },
        },
        selectedMode: 'single',
      }],
    } as Record<string, unknown>;
  }, [ready, map, data, unit, max, geo]);

  if (error) {
    return <div style={{ height }} className="grid place-items-center text-sm" role="alert">
      <span className="gv-muted">地图数据加载失败，请刷新重试</span>
    </div>;
  }

  if (!ready || !option) {
    return <div style={{ height }} className="grid place-items-center text-sm" aria-busy="true">
      <span className="gv-muted">Loading map…</span>
    </div>;
  }

  return (
    <div>
      <EChart
        option={option}
        height={height}
        onReady={chart => {
          chart.off('click');
          chart.on('click', (params: { name?: string }) => {
            const name = params.name;
            if (!name) return;
            setPicked(prev => (name === prev ? null : name));
            onPickRef.current?.(name);
          });
        }}
      />
      {a11yList && (
        <details className="gosd-a11y-list mt-2 text-xs">
          <summary className="cursor-pointer gv-muted">
            {map === 'CN' ? '查看省级数据（键盘可达）' : 'View data by region (keyboard accessible)'}
          </summary>
          <ol className="max-h-44 overflow-y-auto mt-1.5 pl-6 leading-7">
            {data.map(d => (
              <li key={d.name}>
                {onPick ? (
                  <button type="button" onClick={() => onPick(d.name)}
                    className="bg-transparent border-0 p-0 cursor-pointer underline text-inherit"
                    style={{ font: 'inherit' }}>
                    {d.nameZh ?? d.name}
                  </button>
                ) : (
                  <span>{d.nameZh ?? d.name}</span>
                )}
                {unit ? ` · ${unit}` : ''}: {d.value.toLocaleString()}
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
