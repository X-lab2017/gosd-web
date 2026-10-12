# gosd-web — GOSD 2026 交互式报告网站

《2026 全球开源发展报告》（The 2026 Global Open Source Development Report）双语交互式网站。
报告正文与数据的维护基准为 [X-lab2017/2026-Global-Open-Source-Development-Report](https://github.com/X-lab2017/2026-Global-Open-Source-Development-Report)，
本仓库仅承载网站代码与从报告仓库 `data/processed/` 同步的图表数据快照。

## 功能概览

- **双语（中/EN）** 一键切换；**深色演示 / 浅色阅读** 双主题（导航栏切换，localStorage 记忆）
- **执行摘要 + 引言宣言**（《全球开源与人工智能国际合作宣言》核心原则）
- **第一章 OSDGs & OSDI**：Linux/开放模型两个故事、四支柱十维度、二十九项指标总表
- **第二章 GOSO**：活跃/贡献/影响力/人才/多样性/治理/资产七张地图（世界地图支持中国下钻省级）
- **第三章 GOSR**：R/C/F/P/E/M 六组榜单 + 年度/月度排名变化
- **第四章 GOSL**：Agentic AI / 大模型 / 云 / 数据库 / RISC-V / PyTorch 六大领域全景
- **第五章 GOSM**：大模型供给与贡献、复用网络与影响力、开放性四象限分级
- **第六章**：趋势预测与政府/企业/社区行动建议
- **附录**：行为权重口径 + 开源 AI DPG 评估框架（四维度 + 金银牌分级）

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + ECharts。
图表封装（`src/components/EChart.tsx` / `GeoMap.tsx`）与 [X-lab2017/osdg-brand](https://github.com/X-lab2017/osdg-brand) 的 `data-viz` 模块定稿对齐，规范见 [DATA_VIZ.md](./DATA_VIZ.md)。

## 开发

```bash
npm install
npm run dev      # 开发服务器（透传 --host/--port 参数）
npm run build    # 类型检查 + 生产构建
```

## 数据

`src/data/ch2|ch3|ch4|ch5/` 为报告仓库 `data/processed/` 的同步快照（CSV，Vite `?raw` 导入后经 `src/lib/csv.ts` 解析）。
更新数据时请从报告仓库复制对应 CSV 并保持一致命名（`fig-<章>-<节>-<序>_<描述>.csv`）。

## 许可

内容采用 CC BY 4.0 许可；代码遵循仓库 LICENSE。
