import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../api';
import { CATEGORY_COLORS, formatVisitors } from '../constants';

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getOverview()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="overview error-panel">
        <h1>Dashboard unavailable</h1>
        <p>{error}</p>
        <p className="muted">
          Make sure the API is running on port 5000 and MongoDB is seeded.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="overview">
        <div className="skeleton-cards">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-pulse card-skel" />
          ))}
        </div>
      </div>
    );
  }

  const countryData = stats.sitesPerCountry.map((r) => ({
    name: r.country,
    count: r.count,
  }));
  const categoryData = stats.sitesPerCategory.map((r) => ({
    name: r.category,
    value: r.count,
    color: CATEGORY_COLORS[r.category] || '#888',
  }));

  return (
    <div className="overview">
      <header className="overview__hero">
        <p className="eyebrow">ASEAN Tourism Dashboard</p>
        <h1>Southeast Asia at a glance</h1>
        <p>
          Summary stats for the ASEAN tourism dataset. Open the map to explore
          sites, or use Compare to match a Myanmar location one-to-one with
          peers in the same category.
        </p>
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="label">Total sites</span>
          <strong>{stats.totalSites}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Countries</span>
          <strong>{stats.totalCountries}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Categories</span>
          <strong>{stats.totalCategories}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Est. latest-year visitors</span>
          <strong>{formatVisitors(stats.totalEstimatedVisitorsLatestYear)}</strong>
        </div>
      </div>

      <div className="overview-charts">
        <section className="chart-block">
          <h2>Sites per country</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={countryData} margin={{ bottom: 48, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1a5f4a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="chart-block">
          <h2>Sites per category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="overview-teasers">
        <Link to="/" className="teaser-card">
          <div>
            <p className="eyebrow">Explore</p>
            <h2>Open the ASEAN map</h2>
            <p>Color-coded countries and category markers — no road clutter.</p>
          </div>
          <span className="teaser-card__cta">View map →</span>
        </Link>
        <Link to="/compare" className="teaser-card">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Compare Myanmar with ASEAN</h2>
            <p>
              Pick a Myanmar site, then click a peer marker for one-to-one
              visitor comparison.
            </p>
          </div>
          <span className="teaser-card__cta">Open comparison →</span>
        </Link>
      </div>

      <p className="disclaimer">
        Visitor figures are synthetic or AI-approximated for coursework and are
        not official tourism-board statistics. Invented regional sites are marked
        in the seed data for report provenance.
      </p>
    </div>
  );
}
