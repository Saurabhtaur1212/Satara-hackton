import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

// Crop Detection Service
export const cropDetectionService = {
  detectDisease: (formData) => {
    return api.post('/crop-detection/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getCommonDiseases: (cropType, region, language = 'en') =>
    api.get(`/crop-detection/diseases/common?crop_type=${cropType}&region=${region}&language=${language}`),
  analyzeBatch: (formData) => {
    return api.post('/crop-detection/analyze-batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// KisanGPT Service
export const kisanGPTService = {
  sendMessage: (data) => api.post('/kisan-gpt/chat', data),
  sendVoiceMessage: (data) => api.post('/kisan-gpt/voice-chat', data),
  getTopics: (category, language = 'en') =>
    api.get(`/kisan-gpt/topics?category=${category}&language=${language}`),
  getQuickAnswers: (queryType, language = 'en', location) =>
    api.get(`/kisan-gpt/quick-answers?query_type=${queryType}&language=${language}&location=${location}`),
  submitFeedback: (data) => api.post('/kisan-gpt/feedback', data),
};

// Weather Service
export const weatherService = {
  getCurrentWeather: (lat, lng, language = 'en') =>
    api.get(`/weather/current?latitude=${lat}&longitude=${lng}&language=${language}`),
  getForecast: (lat, lng, days = 7, language = 'en') =>
    api.get(`/weather/forecast?latitude=${lat}&longitude=${lng}&days=${days}&language=${language}`),
  getAlerts: (lat, lng, language = 'en') =>
    api.get(`/weather/alerts?latitude=${lat}&longitude=${lng}&language=${language}`),
  getFarmingRecommendations: (data) => api.post('/weather/farming-recommendations', data),
  subscribeToAlerts: (data) => api.post('/weather/subscribe-alerts', data),
  getHistoricalWeather: (lat, lng, startDate, endDate) =>
    api.get(`/weather/historical?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}`),
  getSoilConditions: (lat, lng, language = 'en') =>
    api.get(`/weather/soil-conditions?latitude=${lat}&longitude=${lng}&language=${language}`),
};

// Marketplace Service
export const marketplaceService = {
  getProducts: (params) => api.get('/marketplace/products', { params }),
  createProduct: (data) => api.post('/marketplace/products', data),
  updateProduct: (id, data) => api.put(`/marketplace/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/marketplace/products/${id}`),
  getOrders: () => api.get('/marketplace/orders'),
  createOrder: (data) => api.post('/marketplace/orders', data),
  updateOrderStatus: (id, status) => api.patch(`/marketplace/orders/${id}/status`, { status }),
  getMarketPrices: (location, language = 'en') =>
    api.get(`/marketplace/prices?location=${location}&language=${language}`),
};

// Labor Hiring Service
export const laborService = {
  getWorkers: (params) => api.get('/labor/workers', { params }),
  getEquipment: (params) => api.get('/labor/equipment', { params }),
  createBooking: (data) => api.post('/labor/bookings', data),
  getBookings: () => api.get('/labor/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/labor/bookings/${id}/status`, { status }),
  rateService: (bookingId, rating, review) =>
    api.post(`/labor/bookings/${bookingId}/rate`, { rating, review }),
};

// Government Schemes Service
export const schemesService = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getSchemeDetails: (id, language = 'en') => api.get(`/schemes/${id}?language=${language}`),
  checkEligibility: (schemeId, farmerData) =>
    api.post(`/schemes/${schemeId}/eligibility`, farmerData),
  applyForScheme: (schemeId, applicationData) =>
    api.post(`/schemes/${schemeId}/apply`, applicationData),
  getApplications: () => api.get('/schemes/applications'),
  getApplicationStatus: (id) => api.get(`/schemes/applications/${id}/status`),
};

// Dashboard Service
export const dashboardService = {
  getDashboardData: () => api.get('/dashboard'),
  getCropHealth: () => api.get('/dashboard/crop-health'),
  getProfitEstimation: () => api.get('/dashboard/profit-estimation'),
  getMarketTrends: () => api.get('/dashboard/market-trends'),
  getTasks: () => api.get('/dashboard/tasks'),
  createTask: (data) => api.post('/dashboard/tasks', data),
  updateTask: (id, data) => api.put(`/dashboard/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/dashboard/tasks/${id}`),
};

export default api;