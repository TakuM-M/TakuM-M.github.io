import { el, palette, svg, text } from '../../lib/svg';

/** 外枠の台形。上辺 top から下辺 bottom へ広がる */
const center = 270;
const top = { y: 64, halfWidth: 96 };
const bottom = { y: 440, halfWidth: 226 };
const leftEdge = (y: number) =>
  center - top.halfWidth - ((y - top.y) / (bottom.y - top.y)) * (bottom.halfWidth - top.halfWidth);
const rightEdge = (y: number) => 2 * center - leftEdge(y);

/** 上から順に通る Decision Model の層。selected は入力が選ばれる選択肢の位置 */
const layers = [
  { label: '仕事の種類', choices: 3, selected: 0 },
  { label: '仕事の中身', choices: 4, selected: 2 },
  { label: '必要な道具', choices: 5, selected: 3 },
  { label: '難しさ → モデルの大きさ', choices: 6, selected: 2 },
];
const layerHeight = 58;
const llmTop = top.y + layerHeight * layers.length;
const input = { y: 30, label: '入力「バグを直して、テストも通して」' };
const output = { y: 346 };

/** 台形の縁から選択肢の端までの余白と、右の注釈への引き出し線の開始位置 */
const inset = 30;
const leaderGap = 8;
const labelX = 530;

/** 層の中心から右の注釈まで引き出し線を引く */
const annotate = (y: number, label: string) => [
  el('line', { x1: rightEdge(y) + leaderGap, y1: y, x2: labelX - 8, y2: y, stroke: palette.rule, 'stroke-width': 0.8 }),
  text(labelX, y + 4, label),
];

/** 左側の範囲を示す括弧と縦書きのラベル */
const bracket = (from: number, to: number, label: string) => [
  el('path', { d: `M 32,${from} H 26 V ${to} H 32`, fill: 'none', stroke: palette.text, 'stroke-width': 1 }),
  text(16, (from + to) / 2, label, {
    size: 11,
    anchor: 'middle',
    mono: true,
    attrs: { transform: `rotate(-90 16 ${(from + to) / 2})` },
  }),
];

const dots = layers.map((layer, i) => {
  const y = top.y + layerHeight * (i + 0.5);
  const left = leftEdge(y) + inset;
  const step = (rightEdge(y) - inset - left) / (layer.choices - 1);
  return { ...layer, y, xs: Array.from({ length: layer.choices }, (_, j) => left + step * j) };
});

const route = [
  [center, input.y],
  ...dots.map(({ xs, selected, y }) => [xs[selected], y]),
  [center, output.y],
];

const trapezoid = (from: number, to: number) => {
  const [a, b, c, d] = [leftEdge(from), rightEdge(from), rightEdge(to), leftEdge(to)].map((x) => x.toFixed(1));
  return `M ${a},${from} L ${b},${from} L ${c},${to} L ${d},${to} Z`;
};

export default svg({
  width: 680,
  height: 464,
  title: 'Decision Model の層で絞り込んでから LLM が生成する構成（予想）',
  body: [
    el('path', { d: trapezoid(llmTop, bottom.y), fill: palette.surface, stroke: 'none' }),
    el('path', { d: trapezoid(top.y, bottom.y), fill: 'none', stroke: palette.text, 'stroke-width': 1 }),
    el('path', {
      d: route.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
      fill: 'none',
      stroke: palette.ink,
      'stroke-width': 1,
    }),
    ...layers.map((_, i) => {
      const y = top.y + layerHeight * (i + 1);
      const isLast = i === layers.length - 1;
      return el('line', {
        x1: leftEdge(y),
        y1: y,
        x2: rightEdge(y),
        y2: y,
        stroke: isLast ? palette.text : palette.rule,
        'stroke-width': isLast ? 1 : 0.8,
      });
    }),
    ...dots.flatMap(({ xs, selected, y, label }) => [
      ...xs.map((x, j) =>
        el('circle', {
          cx: x,
          cy: y,
          r: 4.5,
          fill: j === selected ? palette.ink : palette.background,
          stroke: j === selected ? palette.ink : palette.muted,
          'stroke-width': 1,
        })
      ),
      ...annotate(y, label),
    ]),
    text(center, 370, 'LLM ＋ ハーネス', { size: 15, fill: palette.ink, anchor: 'middle' }),
    text(center, 392, 'ここで初めて生成する', { size: 11, anchor: 'middle' }),
    ...annotate(368, '生成'),
    el('rect', { x: center - 5, y: input.y - 5, width: 10, height: 10, fill: palette.ink }),
    text(center + 14, input.y + 4, input.label),
    ...bracket(top.y + 4, llmTop - 4, 'Decision Model'),
    ...bracket(llmTop + 4, bottom.y - 4, 'LLM'),
  ],
});
