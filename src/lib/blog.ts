import { getCollection } from 'astro:content';

/** 日付を 2026-07-26 形式で返す。ビルド環境のタイムゾーンに依存させないため UTC 基準。 */
export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** blog を公開日の新しい順で返す。 */
export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
