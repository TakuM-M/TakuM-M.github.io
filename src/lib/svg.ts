/**
 * ブログの図を SVG 文字列として組み立てる小さな部品。
 * 図そのものは src/figures/<post-id>/<name>.ts に書き、
 * src/pages/images/[post]/[name].svg.ts がビルド時に /images/<post-id>/<name>.svg として出力する。
 */

export const palette = {
  ink: '#0b0b0b',
  text: '#52514e',
  muted: '#898781',
  axis: '#c3c2b7',
  grid: '#e1e0d9',
  rule: '#d6d5cf',
  surface: '#f4f3ef',
  background: '#ffffff',
  blue: '#2a78d6',
  blueLight: '#b7d3f6',
  blueSurface: '#eaf2fc',
  orange: '#eb6834',
  green: '#1baf7a',
  yellow: '#eda100',
};

const sans = "system-ui, -apple-system, 'Hiragino Sans', 'Yu Gothic', 'IPAGothic', sans-serif";
const mono = "ui-monospace, 'SF Mono', Menlo, monospace";

type Attrs = Record<string, string | number | undefined>;

/** 座標の浮動小数点誤差（346.20000000000005 など）を出力に持ち込まない。 */
const num = (value: number) => String(Math.round(value * 10) / 10);

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function el(tag: string, attrs: Attrs, children?: string) {
  const attributes = Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${typeof value === 'number' ? num(value) : escape(value)}"`)
    .join('');
  return children === undefined ? `<${tag}${attributes}/>` : `<${tag}${attributes}>${children}</${tag}>`;
}

export interface TextOptions {
  size?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  bold?: boolean;
  mono?: boolean;
  attrs?: Attrs;
}

export function text(x: number, y: number, content: string, options: TextOptions = {}) {
  const { size = 12, fill = palette.text, anchor = 'start', bold = false, attrs = {} } = options;
  return el(
    'text',
    {
      x,
      y,
      'font-size': size,
      fill,
      'text-anchor': anchor,
      'font-weight': bold ? 'bold' : undefined,
      'font-family': options.mono ? mono : undefined,
      ...attrs,
    },
    escape(content)
  );
}

/**
 * 文字列の描画幅の目安。凡例を並べるときの送り幅にだけ使う。
 * 全角は 1em、半角は 0.62em、空白や i・l のような細い字は 0.5em で見積もる。
 */
export function textWidth(content: string, size: number) {
  const em = (char: string) => (char.charCodeAt(0) > 0xff ? 1 : /[\sijlI.,:;!'|]/.test(char) ? 0.5 : 0.62);
  return [...content].reduce((width, char) => width + em(char) * size, 0);
}

/** 終点に矢じりが付く線。矢じりは svg() が defs に入れる #arrow を参照する。 */
export function arrow(x1: number, y1: number, x2: number, y2: number) {
  return el('line', { x1, y1, x2, y2, stroke: palette.text, 'stroke-width': 1.5, 'marker-end': 'url(#arrow)' });
}

const arrowMarker = el(
  'marker',
  {
    id: 'arrow',
    viewBox: '0 0 10 10',
    refX: 9,
    refY: 5,
    markerWidth: 7,
    markerHeight: 7,
    orient: 'auto-start-reverse',
  },
  el('path', { d: 'M0,0 L10,5 L0,10 z', fill: palette.text })
);

export function svg({ width, height, title, body }: { width: number; height: number; title: string; body: string[] }) {
  const content = body.join('\n');
  const defs = content.includes('url(#arrow)') ? [el('defs', {}, arrowMarker)] : [];
  return el(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      role: 'img',
      'aria-label': title,
      'font-family': sans,
    },
    [
      '',
      el('title', {}, escape(title)),
      el('rect', { width, height, fill: palette.background }),
      ...defs,
      content,
      '',
    ].join('\n')
  );
}
