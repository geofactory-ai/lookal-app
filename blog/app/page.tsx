import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

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

export default function IndexPage() {
  const posts = getPosts();

  if (posts.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Knowledge Base</h1>
        <p style={{ color: 'var(--color-muted)' }}>No posts yet. Publish your first GEO article via GEOFactory.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Knowledge Base</h1>
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
    </div>
  );
}
