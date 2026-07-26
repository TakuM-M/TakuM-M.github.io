import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
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
    // 学会発表・論文。date は YYYY-MM 形式でクォートすること
    publications: z
      .array(
        z.object({
          venue: z.string(),
          date: z.string(),
          type: z.string(),
          // 連名は「山田太郎, 鈴木花子」のように1行で書く
          authors: z.string().optional(),
          href: z.string().optional(),
          // href のリンク文言。予稿PDF・DOI など用に上書きできる
          linkLabel: z.string().default('Paper'),
        }),
      )
      .default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, works };
