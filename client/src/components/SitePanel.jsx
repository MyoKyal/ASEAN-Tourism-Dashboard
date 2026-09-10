import VisitorsChart from './VisitorsChart';
import { CATEGORY_COLORS, formatVisitors, latestVisitors } from '../constants';

export default function SitePanel({ site, onClose, footer }) {
  if (!site) return null;
  const latest = latestVisitors(site);
  const color = CATEGORY_COLORS[site.category] || '#666';

  return (
    <aside className="site-panel">
      <div className="site-panel__header">
        <button type="button" className="site-panel__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{site.name}</h2>
        <p className="site-panel__country">{site.country}</p>
        <div className="badges">
          <span className="badge" style={{ background: color }}>
            {site.category}
          </span>
          <span className="badge badge--muted">{site.type}</span>
        </div>
      </div>
      <p className="site-panel__desc">{site.description}</p>
      <dl className="site-panel__meta">
        <div>
          <dt>Rating</dt>
          <dd>{Number(site.rating).toFixed(1)} / 5</dd>
        </div>
        <div>
          <dt>Entrance</dt>
          <dd className="capitalize">{site.entranceFee}</dd>
        </div>
        <div>
          <dt>{latest?.year ?? 'Latest'} visitors</dt>
          <dd>{formatVisitors(latest?.visitors)}</dd>
        </div>
        {site.establishedYear ? (
          <div>
            <dt>Established</dt>
            <dd>{site.establishedYear}</dd>
          </div>
        ) : null}
      </dl>
      <h3 className="site-panel__chart-title">Yearly visitors (2019–2023)</h3>
      <VisitorsChart data={site.yearlyVisitors} />
      {footer ? <div className="site-panel__footer">{footer}</div> : null}
    </aside>
  );
}
