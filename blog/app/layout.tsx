import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'lookal | GEO Blog',
    template: `%s | lookal`,
  },
  description: 'AI-readable content from lookal. Optimised for citation by ChatGPT, Perplexity, Gemini, and Claude.',
  openGraph: {
    siteName: 'lookal',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://lookal.app" />
      </head>
      <body>
        <div className="container">
          <header>
            <a href="/">
              <div className="site-title">lookal</div>
              <div className="site-tagline">AI-readable knowledge base</div>
            </a>
          </header>
          <main>{children}</main>
          <footer>
            <p>© {new Date().getFullYear()} lookal. Published via GEOFactory.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
