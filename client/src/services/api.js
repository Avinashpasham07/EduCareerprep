import axios from 'axios';
import { logout } from '../store/slices/authSlice';

let store;

export const injectStore = (_store) => {
    store = _store;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const userApi = {
    getProfile: () => api.get('/user/profile'),
    getProfileById: (id) => api.get(`/user/profile/${id}`),
    updateProfile: (data) => api.put('/user/profile', data),
    getColleges: () => api.get('/user/colleges'),
    getCollegeById: (id) => api.get(`/user/colleges/${id}`),
    toggleSaveCollege: (id) => api.post(`/user/colleges/save/${id}`),
    getDashboardStats: () => api.get('/user/dashboard-stats'),
    getJobs: (params) => api.get('/jobs', { params }),
    createJob: (data) => api.post('/jobs', data),
    getMyJobs: () => api.get('/jobs/my-jobs'),
    toggleSaveJob: (id) => api.post(`/jobs/${id}/save`),
    applyJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
    updateApplicationStatus: (jobId, userId, status) => api.put(`/jobs/${jobId}/applications/${userId}/status`, { status }),
    incrementJobView: (id) => api.post(`/jobs/${id}/view`),
    // Dashboard Stats & Challenges
    // getDashboardStats is already defined above
    markChallengeSolved: (challengeId) => api.post('/user/challenge/solve', { challengeId }),

    // Persistence
    saveAssessment: (data) => api.post('/user/assessments/save', data),
    saveRoadmap: (data) => api.post('/user/roadmaps/save', data),
    getRoadmaps: () => api.get('/user/roadmaps'),
    updateRoadmapStep: (data) => api.post('/user/roadmaps/step/update', data),

    // Kanban
    getApplications: () => api.get('/user/applications'),
    // updateApplicationStatus is already defined above

    // Gamification
    getLeaderboard: () => api.get('/user/leaderboard'),

    analyzeProfile: () => api.post('/user/analyze-profile'),
    getRecruiters: () => api.get('/user/recruiters'),
    togglePreferredRecruiter: (recruiterId) => api.post('/user/college/preferred-recruiters', { recruiterId }),
    addManagedCollege: (data) => api.post('/user/managed-colleges', data),
    updateManagedCollege: (id, data) => api.put(`/user/managed-colleges/${id}`, data),
    deleteManagedCollege: (id) => api.delete(`/user/managed-colleges/${id}`),
    // Notifications
    getNotifications: () => api.get('/notifications'),
    createNotification: (data) => api.post('/notifications', data),
    markNotifAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllNotifsAsRead: () => api.put('/notifications/read-all'),
};

export default api;
