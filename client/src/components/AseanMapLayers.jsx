import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { COUNTRY_COLORS, ASEAN_BOUNDS } from '../constants';

export function AseanBoundsLock() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(ASEAN_BOUNDS);
    map.options.maxBoundsViscosity = 0.85;
    map.setMinZoom(4);
    // Allow city-level zoom so nearby temples/markets can separate or spiderfy
    map.setMaxZoom(14);
  }, [map]);
  return null;
}

export function FitAseanView({ sites, padding = 0.12 }) {
  const map = useMap();
  useEffect(() => {
    if (sites?.length) {
      const bounds = L.latLngBounds(
        sites.map((s) => [s.location.coordinates[1], s.location.coordinates[0]])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(padding), { maxZoom: 7, animate: true });
        return;
      }
    }
    map.fitBounds(ASEAN_BOUNDS, { padding: [24, 24], maxZoom: 5 });
  }, [sites, map, padding]);
  return null;
}

export default function AseanCountriesLayer({ highlightCountry }) {
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    fetch('/asean-countries.geojson')
      .then((r) => r.json())
      .then(setGeo)
      .catch((err) => console.error('Failed to load ASEAN GeoJSON', err));
  }, []);

  if (!geo) return null;

  return (
    <GeoJSON
      key={highlightCountry || 'all'}
      data={geo}
      style={(feature) => {
        const name = feature.properties.name;
        const base = COUNTRY_COLORS[name] || '#888';
        const isHi = highlightCountry && highlightCountry === name;
        const isDim = highlightCountry && highlightCountry !== name;
        return {
          fillColor: base,
          fillOpacity: isDim ? 0.35 : 0.88,
          color: isHi ? '#ffffff' : 'rgba(10, 20, 40, 0.55)',
          weight: isHi ? 2.5 : 1,
          opacity: 1,
        };
      }}
      onEachFeature={(feature, layer) => {
        layer.bindTooltip(feature.properties.name, {
          sticky: true,
          className: 'asean-country-tooltip',
          direction: 'center',
        });
      }}
    />
  );
}
