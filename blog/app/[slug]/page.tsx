import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Metadata } from 'next';
import Script from 'next/script';

type Params = { slug: string };

const DOCS_DIR = path.join(process.cwd(), '..', 'docs', 'ai');

export function generateStaticParams(): Params[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, '') }));
}

async function getPost(slug: string) {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return {
    title: (data.title as string | undefined) ?? slug.replace(/-/g, ' '),
    date: (data.date as string | undefined) ?? '',
    description: (data.description as string | undefined) ?? content.slice(0, 160),
    contentHtml: processed.toString(),
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPost(params.slug);
  if (!post) return <div><h1>Not found</h1></div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'lookal',
      url: 'https://lookal.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'lookal',
      url: 'https://lookal.app',
    },
    url: `https://lookal.app/blog/${params.slug}`,
    description: post.description,
  };

  return (
    <article>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{post.title}</h1>
      {post.date && <div className="meta">Published {post.date}</div>}
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
