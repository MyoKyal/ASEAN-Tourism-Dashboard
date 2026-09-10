import { useEffect, useState } from 'react';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  COUNTRIES,
  COUNTRY_COLORS,
} from '../constants';

const RATING_DEBOUNCE_MS = 300;

export default function FilterSidebar({
  categories,
  categoriesError = false,
  filters,
  onChange,
  open,
  onToggle,
  showCountryColors = false,
}) {
  const types = filters.category ? categories[filters.category] || [] : [];

  // The rating slider fires on every drag tick; keep that responsive locally
  // and only push the (debounced) value up to trigger a re-fetch.
  const [ratingDraft, setRatingDraft] = useState(filters.minRating);

  useEffect(() => {
    setRatingDraft(filters.minRating);
  }, [filters.minRating]);

  useEffect(() => {
    if (ratingDraft === filters.minRating) return;
    const t = setTimeout(() => {
      onChange({ ...filters, minRating: ratingDraft });
    }, RATING_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingDraft]);

  function toggleCountry(c) {
    const set = new Set(filters.countries);
    if (set.has(c)) set.delete(c);
    else set.add(c);
    onChange({ ...filters, countries: [...set] });
  }

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        {open ? 'Hide filters' : 'Filters'}
      </button>
      <aside className={`filter-sidebar ${open ? 'is-open' : ''}`}>
        <p className="sidebar-kicker">Explore</p>
        <h2>Filters</h2>
        {categoriesError && (
          <p className="muted small" style={{ margin: '-0.4rem 0 0.9rem' }}>
            Categories failed to load — showing all sites, category filter unavailable.
          </p>
        )}

        <label className="field">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(e) =>
              onChange({
                ...filters,
                category: e.target.value,
                type: '',
              })
            }
          >
            <option value="">All categories</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Type</span>
          <select
            value={filters.type}
            disabled={!filters.category}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Min rating: {ratingDraft.toFixed(1)}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={ratingDraft}
            onChange={(e) => setRatingDraft(Number(e.target.value))}
          />
        </label>

        <fieldset className="field">
          <legend>Countries</legend>
          <div className="country-list">
            {COUNTRIES.map((c) => (
              <label key={c} className="check">
                <input
                  type="checkbox"
                  checked={filters.countries.includes(c)}
                  onChange={() => toggleCountry(c)}
                />
                {showCountryColors && (
                  <span
                    className="country-dot"
                    style={{ background: COUNTRY_COLORS[c] }}
                  />
                )}
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="legend">
          <h3>Site categories</h3>
          {Object.keys(CATEGORY_COLORS).map((cat) => (
            <div key={cat} className="legend__row">
              <span
                className="legend__swatch"
                style={{ background: CATEGORY_COLORS[cat] }}
              >
                {CATEGORY_ICONS[cat]}
              </span>
              <span>{cat}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            onChange({
              countries: [],
              category: '',
              type: '',
              minRating: 0,
            })
          }
        >
          Reset filters
        </button>
      </aside>
    </>
  );
}
