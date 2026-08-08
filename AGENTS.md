## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Blog images

Images for a post live in `src/assets/blog/<post-id>/`, where `<post-id>` is the
Markdown filename without its extension. Reference them with a relative path so
Astro optimizes them (WebP conversion, automatic `width`/`height`, lazy loading):

```markdown
![検出結果](../../assets/blog/2026-07-26-visuable-for-you/result.png)
```

Images that must be served untouched (GIF, SVG, already-compressed files) go in
`public/images/` and are referenced with an absolute path: `/images/foo.png`.
Only these can be used with a raw `<img>` tag — `src/assets` paths are resolved
by the image pipeline, which raw HTML does not go through.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
