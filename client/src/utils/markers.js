import { DivIcon } from 'leaflet';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

export function createCategoryIcon(category, options = {}) {
  const {
    size = 40,
    selected = false,
    dimmed = false,
    peer = false,
    source = false,
  } = options;
  const color = source
    ? '#ff6b35'
    : peer
      ? '#4cc9f0'
      : CATEGORY_COLORS[category] || '#666';
  const icon = CATEGORY_ICONS[category] || '📍';
  const ring = selected || source || peer ? '2px solid #fff' : '2px solid rgba(255,255,255,0.85)';
  const scale = selected || source ? 1.15 : 1;
  const opacity = dimmed ? 0.35 : 1;

  return new DivIcon({
    className: 'asean-marker',
    html: `<div class="asean-marker__wrap" style="opacity:${opacity};transform:scale(${scale})">
      <div class="asean-marker__inner" style="--marker-color:${color};--marker-size:${size}px;border:${ring}">
        <span>${icon}</span>
      </div>
      ${source ? '<span class="asean-marker__tag">MM</span>' : ''}
      ${peer ? '<span class="asean-marker__tag peer">VS</span>' : ''}
    </div>`,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 4],
    popupAnchor: [0, -(size + 2)],
  });
}
