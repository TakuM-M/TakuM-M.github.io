import { arrow, el, palette, svg, text } from '../../lib/svg';

const box = (x: number, y: number, width: number, height: number, accent = false, fill: string = palette.surface) =>
  el('rect', {
    x,
    y,
    width,
    height,
    rx: 8,
    fill: accent ? palette.blueSurface : fill,
    stroke: accent ? palette.blue : palette.axis,
    'stroke-width': 1.5,
  });

/** (a) LLM が 1 回に 1 つずつ出すトークン */
const tokens = ['{"', 'label', '":"', 'pos', 'itive', '"}'];
const token = { left: 200, top: 50, width: 66, height: 60, step: 78 };

/** (b) 判定ヘッドが返す確率（値はイメージ） */
const choices = [
  { label: 'positive', p: 0.92 },
  { label: 'neutral', p: 0.06 },
  { label: 'negative', p: 0.02 },
];
const top = Math.max(...choices.map(({ p }) => p));
const bar = { left: 540, top: 308, height: 18, step: 28, maxWidth: 90, minWidth: 2 };

/** 図全体で使う例。(a)(b) どちらもこの質問に答える */
const scenario = [
  text(20, 30, '例：映画レビューの感情を判定する', { size: 14, fill: palette.ink, bold: true }),
  text(20, 52, 'レビュー：「最高の映画だった！」'),
  text(20, 72, '質問：このレビューは positive / neutral / negative のどれか？'),
];
const offset = 90;

const llm = [
  text(20, 30, '(a) LLM：答えを 1 トークンずつ書く', { size: 16, fill: palette.ink, bold: true }),
  box(20, 50, 150, 60),
  text(95, 75, 'プロンプト', { size: 14, fill: palette.ink, anchor: 'middle' }),
  text(95, 96, '指示文 + レビュー', { anchor: 'middle' }),
  ...tokens.flatMap((value, i) => {
    const x = token.left + token.step * i;
    const center = x + token.width / 2;
    return [
      box(x, token.top, token.width, token.height, false, palette.background),
      text(center, 74, `${i + 1} 回目`, { size: 11, fill: palette.muted, anchor: 'middle' }),
      text(center, 96, value, { size: 13, fill: palette.ink, anchor: 'middle', mono: true }),
      ...(i < tokens.length - 1 ? [arrow(x + token.width + 1, 80, x + token.step - 1, 80)] : []),
    ];
  }),
  arrow(170, 80, 198, 80),
  text(200, 138, '出したトークンを入力の末尾に足して、もう 1 回モデルを通す'),
  text(200, 158, '→ 出力が長いほど推論の回数が増える。確率もトークン単位でしか出ない'),
];

const decisionModel = [
  el('line', { x1: 20, y1: 205, x2: 660, y2: 205, stroke: palette.grid }),
  text(20, 235, '(b) Decision Model：1 回通して、全選択肢の確率を返す', { size: 16, fill: palette.ink, bold: true }),
  box(20, 255, 170, 70),
  text(105, 280, 'state', { size: 14, fill: palette.ink, anchor: 'middle', mono: true }),
  text(105, 302, '判定したいテキスト', { anchor: 'middle' }),
  box(20, 340, 170, 90),
  text(105, 365, 'questions', { size: 14, fill: palette.ink, anchor: 'middle', mono: true }),
  text(105, 387, '型（choice など）', { anchor: 'middle' }),
  text(105, 407, '選択肢とその説明', { anchor: 'middle' }),
  arrow(190, 290, 222, 335),
  arrow(190, 385, 222, 350),
  box(224, 300, 112, 90, true),
  text(280, 330, '本体', { size: 14, fill: palette.ink, anchor: 'middle', bold: true }),
  text(280, 350, 'エンコーダ等', { anchor: 'middle' }),
  text(280, 370, '1 回だけ通す', { fill: palette.blue, anchor: 'middle', bold: true }),
  arrow(336, 345, 362, 345),
  box(364, 310, 60, 70, true),
  text(394, 340, '判定', { size: 13, fill: palette.ink, anchor: 'middle', bold: true }),
  text(394, 358, 'ヘッド', { size: 13, fill: palette.ink, anchor: 'middle', bold: true }),
  arrow(424, 345, 446, 345),
  ...choices.flatMap(({ label, p }, i) => {
    const y = bar.top + bar.step * i;
    const isTop = p === top;
    const width = Math.max(bar.minWidth, (p / top) * bar.maxWidth);
    return [
      text(bar.left - 8, y + 14, label, { fill: isTop ? palette.ink : palette.text, anchor: 'end', bold: isTop, mono: true }),
      el('rect', { x: bar.left, y, width, height: bar.height, rx: 3, fill: isTop ? palette.blue : palette.blueLight }),
      text(bar.left + width + 6, y + 14, p.toFixed(2), { fill: isTop ? palette.ink : palette.muted, bold: isTop }),
    ];
  }),
  text(20, 480, '選択肢の外は構造上出ない。確率がそのまま「どれくらい自信があるか」になる'),
];

export default svg({
  width: 680,
  height: 500 + offset,
  title: 'LLM と Decision Model の推論の違い',
  body: [...scenario, el('g', { transform: `translate(0, ${offset})` }, [...llm, ...decisionModel].join('\n'))],
});
