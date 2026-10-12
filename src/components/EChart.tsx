import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { chartTokens, type ChartTokens } from '@/theme';

export type ChartTheme = 'light' | 'dark';

interface Props {
  option: Record<string, unknown>;
  /** @deprecated 主题由全局 data-theme 决定，此参数仅作兼容 */
  theme?: ChartTheme;
  height?: number;
  onReady?: (chart: echarts.ECharts) => void;
}

/** 监听 <html data-theme> 变化，驱动图表换肤 */
function useChartTokens(): ChartTokens {
  const [tokens, setTokens] = useState<ChartTokens>(() => chartTokens());
  useEffect(() => {
    const mo = new MutationObserver(() => setTokens(chartTokens()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  return tokens;
}

/** 用户开启“减少动态效果”时全局关闭图表动画（规范 §5） */
function reducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * GOSD ECharts 封装（与 osdg-brand data-viz 模块定稿一致）。
 *
 * 合并规则：先展开业务 option，再把 tooltip / legend / grid 按
 * “品牌默认 ← 业务覆盖”合并——业务只传部分键时保留品牌样式，
 * 显式传入的键（含 show:false 关闭组件）仍然生效。
 *
 * 已知陷阱：给 map 系列注入无 data 的 legend，ECharts 会把地图数据项
 * 渲染成散点；品牌 legend 样式只在业务 option 显式提供 legend 时合并。
 */
export default function EChart({ option, height = 320, onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const p = useChartTokens();

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    onReady?.(chart);
    return () => { ro.disconnect(); chart.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const merged: Record<string, unknown> = {
      color: p.series,
      textStyle: { color: p.text, fontFamily: 'inherit' },
      ...option,
      animation: reducedMotion() ? false : (option.animation ?? true),
      tooltip: {
        backgroundColor: p.tooltipBg,
        borderColor: p.tooltipBorder,
        textStyle: { color: p.text, fontSize: 12 },
        trigger: 'axis',
        ...(option.tooltip as object ?? {}),
      },
      // 仅当业务 option 自带 legend 时注入品牌样式（见文件头注释）
      ...(option.legend ? {
        legend: {
          textStyle: { color: p.subtext, fontSize: 11 },
          itemWidth: 14, itemHeight: 8, icon: 'roundRect',
          ...(option.legend as object),
        },
      } : {}),
      grid: { left: 8, right: 12, top: 36, bottom: 4, containLabel: true, ...(option.grid as object ?? {}) },
    };
    chart.setOption(merged as echarts.EChartsOption, true);
  }, [option, p]);

  return <div ref={ref} style={{ height, width: '100%' }} />;
}
