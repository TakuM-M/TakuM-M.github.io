import { getCollection } from 'astro:content';

/** works を表示順（order 昇順）で返す。featuredOnly でトップ掲載分に絞る。 */
export async function getWorks({ featuredOnly = false } = {}) {
  const works = await getCollection(
    'works',
    ({ data }) => !featuredOnly || data.featured,
  );
  return works.sort((a, b) => a.data.order - b.data.order);
}
