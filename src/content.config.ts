import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 記事のタグ。書いたままの文字列を一覧・記事ページに表示する（絞り込みはなし）
    tags: z.array(z.string()).default([]),
  }),
});

/**
 * publications / developments に共通のメタ情報1件分。
 * publication は学会発表・論文の1件、project は開発フェーズの1件を表す。
 * defaultLinkLabel は href のリンク文言の既定値（欄ごとに変える）。
 */
const record = (defaultLinkLabel: string) =>
  z.object({
    // publication: 学会・掲載誌名 / project: 開発の場（省略可）
    venue: z.string().optional(),
    // publication: 発表年月 '2026-06' / project: 開発期間 '2025-04 – 2026-01'
    // YYYY-MM 形式はクォートすること
    date: z.string(),
    // publication: ポスター発表 など / project: 開発体系（個人開発, チーム開発（3人） など）
    type: z.string(),
    // 連名・開発メンバー。「山田太郎, 鈴木花子」のように1行で書く
    authors: z.string().optional(),
    href: z.string().optional(),
    // href のリンク文言。予稿PDF・DOI など用に上書きできる
    linkLabel: z.string().default(defaultLinkLabel),
  });

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/works' }),
  schema: z.object({
    title: z.string(),
    // works ページのどの欄に出すか
    category: z.enum(['publication', 'project']),
    // 小さいほど上に並ぶ（欄をまたいで共通）
    order: z.number().default(0),
    // トップページの Selected Works に載せるか
    featured: z.boolean().default(false),
    // blog コレクションの記事 id（例: 2026-07-26-visuable-for-you）
    article: reference('blog').optional(),
    // 学会発表・論文（主に publication 欄）
    publications: z.array(record('Paper')).default([]),
    // 開発期間・開発体系（主に project 欄）
    developments: z.array(record('Repository')).default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, works };
