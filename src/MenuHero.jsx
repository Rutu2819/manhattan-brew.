import { Link } from "react-router-dom";
import "./MenuHero.css";

// Keys match your real routes: /menu/coffee, /menu/croissant, ...
export const COUNTERS = {
  coffee:     { title: "Coffee",              tag: "Pulled fresh, poured slow",     c1: "#c4602f", c2: "#5a2d16", icons: ["☕", "🫘"] },
  croissant:  { title: "Croissant",           tag: "Butter, layers, golden edges",  c1: "#d4a62a", c2: "#5c4212", icons: ["🥐", "✨"] },
  muffin:     { title: "Muffin",              tag: "Baked this morning",            c1: "#3f6f6a", c2: "#1f3b3a", icons: ["🫐", "🍫"] },
  cheesecake: { title: "Cheese Cake",         tag: "Creamy, rich, worth the wait",  c1: "#d98a92", c2: "#5a2a3a", icons: ["🍓", "🍰"] },
  mojito:     { title: "Mojito",              tag: "Muddled mint, crushed ice",     c1: "#3fa37a", c2: "#123f33", icons: ["🌿", "🍋"] },
  "ny-coke":  { title: "New York Style Coke", tag: "Fountain fizz, diner style",    c1: "#c23a2e", c2: "#4d1512", icons: ["🍒", "🫧"] },
  matcha:     { title: "Matcha",              tag: "Whisked green, gently sweet",   c1: "#7ea34a", c2: "#2b3f16", icons: ["🍃", "🍵"] },
  pasta:      { title: "Pasta",               tag: "Twirled hot, sauced right",     c1: "#d9772b", c2: "#4a2410", icons: ["🍅", "🌿"] },
};

const FALLBACK = { title: "", tag: "", c1: "#c4602f", c2: "#5a2d16", icons: ["☕", "🫘"] };

/** Drop this in place of your old <h1>COFFEE</h1> hero block. Pass items.length as count. */
export function MenuHero({ category, count = 0 }) {
  const t = COUNTERS[category] ?? { ...FALLBACK, title: category.replace(/-/g, " ") };
  return (
    <header className="mh" key={category} style={{ "--c1": t.c1, "--c2": t.c2 }}>
      <div className="mh-float" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            style={{
              "--x": `${(i * 37) % 100}%`,
              "--s": `${1.1 + ((i * 7) % 10) / 6}rem`,
              "--d": `${7 + ((i * 5) % 8)}s`,
              "--w": `${-((i * 3) % 12)}s`,
            }}
          >
            {t.icons[i % t.icons.length]}
          </span>
        ))}
      </div>

      <h1 aria-label={t.title}>
        {[...t.title].map((ch, i) => (
          <span key={i} aria-hidden="true" style={{ "--n": i }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </h1>
      <p className="mh-tag">{t.tag}</p>
      <p className="mh-count">{count} {count === 1 ? "item" : "items"}</p>
    </header>
  );
}

/** Optional: jump between counters. Place right under <MenuHero />. */
export function MenuRail({ active }) {
  return (
    <nav className="mr" aria-label="Menu counters">
      {Object.entries(COUNTERS).map(([slug, c]) => (
        <Link
          key={slug}
          to={`/menu/${slug}`}
          className={slug === active ? "on" : ""}
          style={{ "--dot": c.c1 }}
          aria-current={slug === active ? "page" : undefined}
        >
          <span aria-hidden="true">{c.icons[0]}</span>
          {c.title}
        </Link>
      ))}
    </nav>
  );
}