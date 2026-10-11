import { el, palette, svg, text, textWidth } from './svg';

export interface BarChart {
  title: string;
  /** 縦軸の上に置く単位 */
  unit: string;
  /** 縦軸の上端。目盛りはこれを 5 等分する */
  max: number;
  formatTick: (value: number) => string;
  series: { name: string; color: string }[];
  /** values は series と同じ順 */
  groups: { label: string; sublabel: string; values: number[] }[];
}

const width = 680;
const height = 380;
const plot = { left: 56, right: 664, top: 64, bottom: 322 };
const barWidth = 29;
const barGap = 2;
const radius = 4;
const tickCount = 5;

/** 系列ごとに色分けした縦棒をグループ単位で並べる。 */
export function barChart(chart: BarChart) {
  const body: string[] = [];

  let legendX = plot.left;
  for (const { name, color } of chart.series) {
    body.push(el('rect', { x: legendX, y: 18, width: 12, height: 12, rx: 3, fill: color }));
    body.push(text(legendX + 18, 28, name, { size: 13 }));
    legendX += 18 + textWidth(name, 13) + 20;
  }

  body.push(text(8, 50, chart.unit, { fill: palette.muted }));

  const y = (value: number) => plot.bottom - (value / chart.max) * (plot.bottom - plot.top);
  for (let i = 0; i <= tickCount; i++) {
    const value = (chart.max / tickCount) * i;
    const lineY = y(value);
    body.push(
      i === 0
        ? el('line', { x1: plot.left, y1: lineY, x2: plot.right, y2: lineY, stroke: palette.axis, 'stroke-width': 1.5 })
        : el('line', { x1: plot.left, y1: lineY, x2: plot.right, y2: lineY, stroke: palette.grid, 'stroke-width': 1 })
    );
    body.push(
      text(plot.left - 8, lineY + 4, chart.formatTick(value), {
        fill: palette.muted,
        anchor: 'end',
        attrs: { 'font-variant-numeric': 'tabular-nums' },
      })
    );
  }

  const groupWidth = (plot.right - plot.left) / chart.groups.length;
  const clusterWidth = chart.series.length * barWidth + (chart.series.length - 1) * barGap;
  chart.groups.forEach((group, g) => {
    const center = plot.left + groupWidth * (g + 0.5);
    group.values.forEach((value, s) => {
      const left = center - clusterWidth / 2 + s * (barWidth + barGap);
      body.push(el('path', { d: roundedTop(left, y(value), barWidth, plot.bottom), fill: chart.series[s].color }));
    });
    body.push(text(center, plot.bottom + 22, group.label, { size: 13, fill: palette.ink, anchor: 'middle', bold: true }));
    body.push(text(center, plot.bottom + 40, group.sublabel, { fill: palette.muted, anchor: 'middle' }));
  });

  return svg({ width, height, title: chart.title, body });
}

/** 上の角だけを丸めた棒の輪郭 */
function roundedTop(left: number, top: number, w: number, bottom: number) {
  const r = Math.min(radius, (bottom - top) / 2);
  const right = left + w;
  const f = (value: number) => value.toFixed(1);
  return (
    `M${f(left)},${f(bottom)} V${f(top + r)} Q${f(left)},${f(top)} ${f(left + r)},${f(top)} ` +
    `H${f(right - r)} Q${f(right)},${f(top)} ${f(right)},${f(top + r)} V${f(bottom)} Z`
  );
}
