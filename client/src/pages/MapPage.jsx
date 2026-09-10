import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { api } from '../api';
import FilterSidebar from '../components/FilterSidebar';
import SitePanel from '../components/SitePanel';
import AseanCountriesLayer, {
  AseanBoundsLock,
  FitAseanView,
} from '../components/AseanMapLayers';
import { createCategoryIcon } from '../utils/markers';
import {
  ASEAN_CENTER,
  CATEGORY_COLORS,
  formatVisitors,
  latestVisitors,
} from '../constants';
import 'leaflet/dist/leaflet.css';

export default function MapPage() {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [filters, setFilters] = useState({
    countries: [],
    category: '',
    type: '',
    minRating: 0,
  });

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => setCategoriesError(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = {};
    if (filters.countries.length) params.country = filters.countries.join(',');
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    if (filters.minRating > 0) params.minRating = filters.minRating;

    api
      .getSites(params)
      .then((data) => {
        if (!cancelled) setSites(data);
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
  }, [filters]);

  const icons = useMemo(() => {
    const map = {};
    Object.keys(CATEGORY_COLORS).forEach((cat) => {
      map[cat] = createCategoryIcon(cat, { size: 42 });
    });
    return map;
  }, []);

  const selectedIcon = useMemo(() => {
    if (!selected) return null;
    return createCategoryIcon(selected.category, { size: 48, selected: true });
  }, [selected]);

  return (
    <div className="map-layout map-layout--home">
      <FilterSidebar
        categories={categories}
        categoriesError={categoriesError}
        filters={filters}
        onChange={setFilters}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        showCountryColors
      />
      <div className="map-stage map-stage--dark">
        <div className="map-hero-title">
          <h1>ASEAN Map</h1>
          <p>Tourism sites across Southeast Asia — click a marker for details.</p>
        </div>
        {loading && (
          <div className="map-skeleton" aria-busy="true">
            <div className="skeleton-pulse" />
            <p>Loading sites…</p>
          </div>
        )}
        {error && (
          <div className="map-error">
            <p>Could not load sites: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <MapContainer
            center={ASEAN_CENTER}
            zoom={5}
            className="map-canvas map-canvas--clean"
            scrollWheelZoom
            zoomControl
            attributionControl={false}
          >
            <AseanBoundsLock />
            <AseanCountriesLayer />
            <FitAseanView sites={sites} />
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={40}
              disableClusteringAtZoom={5}
              spiderfyOnMaxZoom
              showCoverageOnHover={false}
              zoomToBoundsOnClick
              animate
            >
              {sites.map((site) => {
                if (!site.location?.coordinates) return null;
                const [lng, lat] = site.location.coordinates;
                const latest = latestVisitors(site);
                const isSelected = selected && selected._id === site._id;
                return (
                  <Marker
                    key={site._id}
                    position={[lat, lng]}
                    icon={
                      isSelected
                        ? selectedIcon
                        : icons[site.category] || icons.Beaches
                    }
                    zIndexOffset={isSelected ? 1000 : 0}
                    eventHandlers={{
                      click: () => setSelected(site),
                    }}
                  >
                    <Popup>
                      <strong>{site.name}</strong>
                      <br />
                      {site.country} · {site.type}
                      <br />
                      {latest
                        ? `${latest.year}: ${formatVisitors(latest.visitors)} visitors`
                        : null}
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        )}
        <div className="map-count">{loading ? '…' : `${sites.length} sites`}</div>
      </div>
      {selected && (
        <SitePanel
          site={selected}
          onClose={() => setSelected(null)}
          footer={
            selected.country === 'Myanmar' ? (
              <Link
                className="btn btn--compare"
                to={`/compare?siteId=${selected._id}`}
              >
                Compare with ASEAN →
              </Link>
            ) : null
          }
        />
      )}
    </div>
  );
}
