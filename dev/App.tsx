import React, { useMemo, useState, useEffect } from 'react';
import { items, ShowcaseItem } from './componentsData';

function useFilteredItems(all: ShowcaseItem[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((it) => it.title.toLowerCase().includes(q) || it.id.includes(q));
  }, [all, query]);
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const filtered = useFilteredItems(items, query);
  const [selectedId, setSelectedId] = useState(filtered[0]?.id ?? 'button');
  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? items[0];
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('vitrio-docs-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vitrio-docs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const onCopy = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.code);
  };

  return (
    <div className="doc-root">
      <aside className="doc-aside">
        <div className="doc-brand">Vitrio UI</div>
        <input
          className="doc-search"
          placeholder="Search components..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <nav className="doc-nav">
          {filtered.map((it) => (
            <button
              key={it.id}
              className={`doc-nav-item ${selected?.id === it.id ? 'active' : ''}`}
              onClick={() => setSelectedId(it.id)}
            >
              {it.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="doc-main">
        <header className="doc-header">
          <h1>{selected?.title ?? 'Components'}</h1>
          <div className="doc-actions">
            <button className="doc-btn doc-theme-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="doc-btn" onClick={onCopy}>Copy Code</button>
          </div>
        </header>

        <section className="doc-preview">
          {selected?.render()}
        </section>

        <section className="doc-code">
          <pre>
            <code>{selected?.code}</code>
          </pre>
        </section>
      </main>
    </div>
  );
};

export default App; 