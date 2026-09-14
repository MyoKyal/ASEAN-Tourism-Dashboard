import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { api } from '../api';
import AseanCountriesLayer, {
  AseanBoundsLock,
  FitAseanView,
} from '../components/AseanMapLayers';
import { createCategoryIcon } from '../utils/markers';
import { ASEAN_CENTER, formatVisitors, latestVisitors } from '../constants';
import 'leaflet/dist/leaflet.css';

const MYANMAR_COLOR = '#ff6b35';
const PEER_COLOR = '#4cc9f0';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [myanmarSites, setMyanmarSites] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get('siteId') || null);
  const [result, setResult] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getSites({ country: 'Myanmar' })
      .then(setMyanmarSites)
      .catch(() => setMyanmarSites([]));
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get('siteId');
    if (fromUrl && fromUrl !== selectedId) setSelectedId(fromUrl);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      api
        .compareSearch(query.trim())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!selectedId) {
      setResult(null);
      setPeerId(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPeerId(null);
    api
      .compare(selectedId, 40)
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        if (data.source?.name) setQuery(data.source.name);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function selectMyanmar(site) {
    const id = site._id || site;
    setSelectedId(id);
    setSearchParams({ siteId: id });
    if (site.name) {
      setQuery(site.name);
      setSuggestions([]);
    }
  }

  const mapSites = useMemo(() => {
    if (!result?.source) {
      return myanmarSites.map((s) => ({ ...s, role: 'myanmar' }));
    }
    const source = { ...result.source, role: 'source' };
    const peers = (result.peers || []).map((p) => ({
      ...p,
      role: String(p._id) === String(peerId) ? 'activePeer' : 'peer',
    }));
    return [source, ...peers];
  }, [result, peerId, myanmarSites]);

  const activePeer = useMemo(() => {
    if (!peerId || !result?.peers) return null;
    return result.peers.find((p) => String(p._id) === String(peerId)) || null;
  }, [peerId, result]);

  const duoTrend = useMemo(() => {
    if (!result?.source || !activePeer) return [];
    const years = [
      ...new Set([
        ...(result.source.yearlyVisitors || []).map((y) => y.year),
        ...(activePeer.yearlyVisitors || []).map((y) => y.year),
      ]),
    ].sort((a, b) => a - b);
    return years.map((year) => ({
      year,
      [result.source.name]:
        result.source.yearlyVisitors?.find((y) => y.year === year)?.visitors ?? 0,
      [activePeer.name]:
        activePeer.yearlyVisitors?.find((y) => y.year === year)?.visitors ?? 0,
    }));
  }, [result, activePeer]);

  const barData = useMemo(() => {
    if (!result?.ranking?.length) return [];
    return result.ranking.map((s) => ({
      name: s.name.length > 20 ? `${s.name.slice(0, 18)}…` : s.name,
      fullName: s.name,
      visitors: s.latestVisitors ?? 0,
      isSource: s.isSource || String(s._id) === String(result.source?._id),
      isPeer: String(s._id) === String(peerId),
      id: s._id,
    }));
  }, [result, peerId]);

  const topPct = result
    ? Math.max(1, Math.round(100 - (result.percentile ?? 0)))
    : null;

  function onMarkerClick(site) {
    if (!result) {
      if (site.country === 'Myanmar') selectMyanmar(site);
      return;
    }
    if (String(site._id) === String(result.source._id)) return;
    if (site.role === 'peer' || site.role === 'activePeer' || site.country !== 'Myanmar') {
      setPeerId(site._id);
    }
  }

  function markerIcon(site) {
    if (site.role === 'source') {
      return createCategoryIcon(site.category, { size: 48, source: true });
    }
    if (site.role === 'activePeer') {
      return createCategoryIcon(site.category, { size: 48, peer: true, selected: true });
    }
    if (site.role === 'peer') {
      return createCategoryIcon(site.category, { size: 42, peer: true });
    }
    return createCategoryIcon(site.category, { size: 40 });
  }

  return (
    <div className="compare-layout">
      <aside className="compare-side">
        <p className="sidebar-kicker">Compare</p>
        <h1>Myanmar vs ASEAN</h1>
        <p className="compare-side__hint">
          Pick a Myanmar site (search or map), then click another marker of the
          same category to run a one-to-one comparison.
        </p>

        <div className="autocomplete">
          <label htmlFor="mm-search">Search Myanmar sites</label>
          <input
            id="mm-search"
            type="search"
            placeholder="e.g. Shwedagon, Bagan, Inle…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setSelectedId(null);
                setSearchParams({});
                setResult(null);
                setPeerId(null);
              }
            }}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete__list">
              {suggestions.map((s) => (
                <li key={s._id}>
                  <button type="button" onClick={() => selectMyanmar(s)}>
                    <strong>{s.name}</strong>
                    <span>
                      {s.category} · {s.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && <p className="muted">Loading comparison…</p>}
        {error && <p className="error-text">{error}</p>}

        {result && !loading && (
          <div className="compare-side__body">
            <div className="compare-pill source-pill">
              <span className="pill-label">Myanmar</span>
              <strong>{result.source?.name}</strong>
              <span>
                {result.type} · {formatVisitors(result.source?.latestVisitors)} visitors
              </span>
              {result.source?.description ? (
                <p className="compare-desc">{result.source.description}</p>
              ) : null}
            </div>

            {result.percentile != null && (
              <div className="percentile-badge">
                Top {topPct}% of {result.type} in ASEAN
                <span className="percentile-badge__num">
                  #{result.sourceRank}/{result.totalInCategoryType}
                </span>
              </div>
            )}

            {!result.peers?.length ? (
              <div className="empty-compare">
                No other ASEAN sites share this category and type. Try another
                Myanmar site (e.g. a temple complex or beach).
              </div>
            ) : (
              <>
                <p className="step-hint">
                  {activePeer
                    ? 'One-to-one comparison'
                    : `Click a blue peer marker on the map (${result.peers.length} available)`}
                </p>

                {activePeer && (
                  <div className="duo-panel">
                    <div className="duo-cards">
                      <div className="duo-card duo-card--mm">
                        <span className="pill-label">Myanmar</span>
                        <h3>{result.source.name}</h3>
                        {result.source.description ? (
                          <p className="compare-desc">{result.source.description}</p>
                        ) : null}
                        <dl>
                          <div>
                            <dt>Visitors</dt>
                            <dd>{formatVisitors(result.source.latestVisitors)}</dd>
                          </div>
                          <div>
                            <dt>Rating</dt>
                            <dd>{Number(result.source.rating).toFixed(1)}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="duo-vs">VS</div>
                      <div className="duo-card duo-card--peer">
                        <span className="pill-label">{activePeer.country}</span>
                        <h3>{activePeer.name}</h3>
                        {activePeer.description ? (
                          <p className="compare-desc">{activePeer.description}</p>
                        ) : null}
                        <dl>
                          <div>
                            <dt>Visitors</dt>
                            <dd>{formatVisitors(activePeer.latestVisitors)}</dd>
                          </div>
                          <div>
                            <dt>Rating</dt>
                            <dd>{Number(activePeer.rating).toFixed(1)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <h4>Visitor trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={duoTrend} margin={{ left: 0, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a50" />
                        <XAxis dataKey="year" stroke="#8aa0b5" tick={{ fontSize: 11 }} />
                        <YAxis
                          tickFormatter={formatVisitors}
                          width={44}
                          stroke="#8aa0b5"
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip formatter={(v) => formatVisitors(v)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={result.source.name}
                          stroke={MYANMAR_COLOR}
                          strokeWidth={3}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={activePeer.name}
                          stroke={PEER_COLOR}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setPeerId(null)}
                    >
                      Clear peer selection
                    </button>
                  </div>
                )}

                <div className="peer-list">
                  <h4>Same category peers</h4>
                  <ul>
                    {result.peers.map((p) => (
                      <li key={p._id}>
                        <button
                          type="button"
                          className={
                            String(p._id) === String(peerId) ? 'is-active' : ''
                          }
                          onClick={() => setPeerId(p._id)}
                        >
                          <strong>{p.name}</strong>
                          <span>
                            {p.country} · {formatVisitors(p.latestVisitors)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="chart-block chart-block--dark">
                  <h4>Ranking overview</h4>
                  <ResponsiveContainer
                    width="100%"
                    height={Math.min(360, Math.max(180, barData.length * 28))}
                  >
                    <BarChart
                      data={barData}
                      layout="vertical"
                      margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2a3a50" />
                      <XAxis type="number" tickFormatter={formatVisitors} stroke="#8aa0b5" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: '#c5d4e3' }} />
                      <Tooltip
                        formatter={(v, _n, props) => [
                          formatVisitors(v),
                          props.payload.fullName,
                        ]}
                      />
                      <Bar
                        dataKey="visitors"
                        radius={[0, 4, 4, 0]}
                        cursor="pointer"
                        onClick={(data) => {
                          if (data?.id && !data.isSource) setPeerId(data.id);
                        }}
                      >
                        {barData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              entry.isSource
                                ? MYANMAR_COLOR
                                : entry.isPeer
                                  ? PEER_COLOR
                                  : '#5a6f88'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}
      </aside>

      <div className="map-stage map-stage--dark compare-map">
        <div className="map-hero-title map-hero-title--compact">
          <h2>{result ? 'Click a peer site to compare' : 'Click a Myanmar site'}</h2>
          <p>
            {result
              ? `${result.category} · ${result.type}`
              : 'Only Myanmar markers are selectable until a source is chosen'}
          </p>
        </div>
        <MapContainer
          center={ASEAN_CENTER}
          zoom={5}
          className="map-canvas map-canvas--clean"
          scrollWheelZoom
          attributionControl={false}
        >
          <AseanBoundsLock />
          <AseanCountriesLayer
            highlightCountry={result ? undefined : 'Myanmar'}
          />
          <FitAseanView sites={mapSites} padding={0.2} />
          {mapSites.map((site) => {
            if (!site.location?.coordinates) return null;
            const [lng, lat] = site.location.coordinates;
            const latest = latestVisitors(site);
            return (
              <Marker
                key={`${site._id}-${site.role}`}
                position={[lat, lng]}
                icon={markerIcon(site)}
                zIndexOffset={
                  site.role === 'source' || site.role === 'activePeer' ? 1000 : 100
                }
                eventHandlers={{
                  click: () => onMarkerClick(site),
                }}
              >
                <MapTooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  className="site-marker-tooltip"
                >
                  {site.name}
                </MapTooltip>
                <Popup>
                  <strong>{site.name}</strong>
                  <br />
                  {site.country} · {site.type || result?.type}
                  <br />
                  {latest
                    ? `${latest.year}: ${formatVisitors(latest.visitors)}`
                    : site.latestVisitors != null
                      ? formatVisitors(site.latestVisitors)
                      : null}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        <div className="map-count">
          {result
            ? `1 Myanmar + ${result.peers?.length || 0} peers`
            : `${myanmarSites.length} Myanmar sites`}
        </div>
      </div>
    </div>
  );
}
