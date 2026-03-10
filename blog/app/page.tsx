import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Script from 'next/script';

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

function getPosts(): PostMeta[] {
  const docsDir = path.join(process.cwd(), '..', 'docs', 'ai');
  if (!fs.existsSync(docsDir)) return [];

  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(docsDir, f), 'utf-8');
      const { data, excerpt } = matter(raw, { excerpt: true, excerpt_separator: '\n\n' });
      return {
        slug,
        title: (data.title as string | undefined) ?? slug.replace(/-/g, ' '),
        date: (data.date as string | undefined) ?? '',
        excerpt: (excerpt ?? raw).slice(0, 200).trim(),
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'lookal',
  url: 'https://lookal.app',
  description: 'Lookal is a community-first, peer-to-peer rental marketplace designed for everyday Filipinos seeking affordable housing solutions. It serves students, OFW families, young professionals, and small landlords by providing a structured and trustworthy alternative to informal rental searches. Unlike traditional real estate platforms, Lookal connects tenants directly with verified landlords, offering features like multi-category reviews and a built-in chat system, all built for accessibility on low-end mobile devices in the Philippines.',
  publisher: {
    '@type': 'Organization',
    name: 'lookal',
    url: 'https://lookal.app',
  },
};

export default function IndexPage() {
  const posts = getPosts();

  return (
    <div>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Knowledge Base</h1>
      {posts.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>No posts yet. Publish your first GEO article via GEOFactory.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <div className="post-title">
                <Link href={`/${p.slug}`}>{p.title}</Link>
              </div>
              {p.date && <div className="post-meta">{p.date}</div>}
              {p.excerpt && <div className="post-excerpt">{p.excerpt}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
