const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth API
export const auth = {
  setupNeeded: () => fetchAPI('/auth/setup-needed'),
  registerFirstAdmin: (username, password) =>
    fetchAPI('/auth/register-first-admin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (username, password) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  check: () => fetchAPI('/auth/check'),
};

// User API
export const users = {
  getAll: () => fetchAPI('/users'),
  create: (username, password, isAdmin) =>
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, isAdmin }),
    }),
};

// Pie API
export const pies = {
  getAll: () => fetchAPI('/pies'),
  getOne: (id) => fetchAPI(`/pies/${id}`),
  create: (name, imageUrl, price) =>
    fetchAPI('/pies', {
      method: 'POST',
      body: JSON.stringify({ name, imageUrl, price }),
    }),
  update: (id, name, imageUrl, price) =>
    fetchAPI(`/pies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, imageUrl, price }),
    }),
  delete: (id) =>
    fetchAPI(`/pies/${id}`, {
      method: 'DELETE',
    }),
  canReview: (id) => fetchAPI(`/pies/${id}/can-review`),
};

// Review API
export const reviews = {
  create: (pieId, fillingScore, pastryScore, appearanceScore, overallScore, valueForMoneyScore) =>
    fetchAPI('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        pieId,
        fillingScore,
        pastryScore,
        appearanceScore,
        overallScore,
        valueForMoneyScore,
      }),
    }),
  getMyReviews: () => fetchAPI('/reviews/my-reviews'),
  getLeaderboard: () => fetchAPI('/reviews/leaderboard'),
};
