const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  getSites: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v);
    });
    const qs = q.toString();
    return request(`/api/sites${qs ? `?${qs}` : ''}`);
  },
  getSite: (id) => request(`/api/sites/${encodeURIComponent(id)}`),
  getCategories: () => request('/api/meta/categories'),
  getOverview: () => request('/api/stats/overview'),
  compare: (siteId, limit = 15) =>
    request(`/api/compare?siteId=${encodeURIComponent(siteId)}&limit=${encodeURIComponent(limit)}`),
  compareSearch: (q) =>
    request(`/api/compare/search?q=${encodeURIComponent(q)}`),
};
