// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { defineMdastPlugin, defineHastPlugin } from 'satteri';
import katex from 'katex';

/**
 * Sätteri は `$...$` / `$$...$$` を math / inlineMath ノードとして読むところまでで、
 * 組版はしない（rehype-katex は unified 用なので Sätteri には差せない）。
 * ここで KaTeX に通す。スタイルは Layout.astro が読み込む katex.min.css
 * （フォントごと Vite がバンドルされるので CDN は要らない）。
 *
 * 別行立てと行内で差し込む段階が違うのは、それぞれ別の理由による:
 *
 * - 別行立ては mdast 段階。hast まで残すと `<pre><code>` になり、Shiki が
 *   （言語未指定なので plaintext として）ハイライトしてしまう。Astro の
 *   syntaxHighlight 除外言語 "math" は code の data.lang を見るが、
 *   数式ブロックにはそれが付かないので効かない。
 * - 行内は hast 段階。mdast の rawHtml / html ノードはブロック扱いになり、
 *   数式のところで段落が切れる。hast の raw ノードなら行内位置が保たれる。
 */
const katexMdastPlugin = defineMdastPlugin({
  name: 'katex-display',
  math: (node, ctx) => ({ rawHtml: render(node.value, true, node, ctx) }),
});

const katexHastPlugin = defineHastPlugin({
  name: 'katex-inline',
  element: {
    filter: ['code'],
    visit: (node, ctx) => {
      const className = node.properties?.className;
      if (!Array.isArray(className) || !className.includes('math-inline')) return;
      return { type: 'raw', value: render(ctx.textContent(node), false, node, ctx) };
    },
  },
});

/**
 * 式が壊れていてもビルドは通し、崩れた箇所を赤字で残して警告を出す。
 * strict: 'ignore' は `\text{}` 内の日本語などで警告が飛ぶのを抑えるため。
 *
 * @param {string} tex
 * @param {boolean} displayMode
 * @param {any} node
 * @param {{ report: (opts: { message: string; node?: any; severity?: 'error' | 'warning' | 'info' }) => void }} ctx
 * @returns {string}
 */
function render(tex, displayMode, node, ctx) {
  const options = { displayMode, strict: /** @type {const} */ ('ignore') };
  try {
    return katex.renderToString(tex, { ...options, throwOnError: true });
  } catch (error) {
    ctx.report({
      message: `KaTeX: ${error instanceof Error ? error.message : String(error)}`,
      node,
      severity: 'warning',
    });
    return katex.renderToString(tex, { ...options, throwOnError: false });
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://takum-m.github.io',
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [katexMdastPlugin],
      hastPlugins: [katexHastPlugin],
    }),
  },
});
