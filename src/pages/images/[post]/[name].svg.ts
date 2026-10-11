import type { APIRoute, GetStaticPaths } from 'astro';

/**
 * src/figures/<post-id>/<name>.ts の default export（SVG 文字列）を
 * /images/<post-id>/<name>.svg として出力する。`_` で始まるファイルは図どうしで共有する部品。
 */
const figures = import.meta.glob<string>(['/src/figures/*/*.ts', '!/src/figures/*/_*.ts'], {
  eager: true,
  import: 'default',
});

export const getStaticPaths = (() =>
  Object.entries(figures).map(([path, svg]) => {
    const [, post, name] = path.match(/^\/src\/figures\/([^/]+)\/([^/]+)\.ts$/)!;
    return { params: { post, name }, props: { svg } };
  })) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.svg, { headers: { 'Content-Type': 'image/svg+xml' } });
