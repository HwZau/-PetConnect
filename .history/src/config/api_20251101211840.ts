// API Configuration and Constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  MAX_FILE_SIZE: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(",") || [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ],
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/v1/login",
    REGISTER: "/v1/register",
    LOGOUT: "/v1/logout",
    RESET: "/v1/reset",
    VERIFIED_RESET: "/v1/verified/reset",
    DISABLE: "/v1/disable",
    VERIFIED_DISABLE: "/v1/verified/disable",
  },

  // Users
  USERS: {
    LIST: "/v1/users/getall",
    DETAIL: "/v1/user/:id",
    UPDATE: "/v1/user/:id",
    CREATE: "/v1/user/create",
    DELETE: "/v1/user/:id",
    PROFILE: "/v1/user/profile/me",
  },

  // Pets
  PETS: {
    LIST: "/api/v1/pet/getall",
    DETAIL: (id: string) => `/api/v1/pet/${id}`,
    USER_PETS: (userId: string) => `/api/v1/pet/user/${userId}/pets`,
    CREATE: "/api/v1/pet/create",
    UPDATE: (id: string) => `/api/v1/pet/update/${id}`,
    DELETE: (id: string) => `/api/v1/pet/delete/${id}`,
    ADD_PET: (id: string) => `/api/v1/pet/add/${id}`,
    CREATE_USER_PET: (userId: string) => `/api/v1/pet/${userId}`,
  },

  // Services
  SERVICES: {
    LIST: "/v1/services",
    CATEGORIES: "/v1/services/categories",
    DETAIL: (id: string) => `/v1/services/${id}`,
    SEARCH: "/v1/services/search",
    NEARBY: "/v1/services/nearby",
  },

  // Bookings
  BOOKINGS: {
    LIST: "/v1/bookings",
    CREATE: "/v1/bookings",
    DETAIL: (id: string) => `/v1/bookings/${id}`,
    UPDATE: (id: string) => `/v1/bookings/${id}`,
    CANCEL: (id: string) => `/v1/bookings/${id}/cancel`,
    HISTORY: "/v1/bookings/history",
  },

  // Freelancers
  FREELANCERS: {
    LIST: "/api/v1/freelancers",
    DETAIL: (id: string) => `/api/v1/freelancers/${id}`,
    SEARCH: "/api/v1/freelancers/search",
    REVIEWS: (id: string) => `/api/v1/freelancers/${id}/reviews`,
    PORTFOLIO: (id: string) => `/api/v1/freelancers/${id}/portfolio`,
  },

  // Events
  EVENTS: {
    LIST: "/api/v1/events",
    CREATE: "/api/v1/events",
    DETAIL: (id: string) => `/api/v1/events/${id}`,
    UPDATE: (id: string) => `/api/v1/events/${id}`,
    DELETE: (id: string) => `/api/v1/events/${id}`,
    JOIN: (id: string) => `/api/v1/events/${id}/join`,
    LEAVE: (id: string) => `/api/v1/events/${id}/leave`,
    UPCOMING: "/api/v1/events/upcoming",
  },

  // Community
  COMMUNITY: {
    POSTS: "/Post",
    CREATE_POST: "/Post",
    POST_DETAIL: (id: string) => `/api/Post/${id}`,
    UPDATE_POST: (id: string) => `/api/Post/${id}`,
    DELETE_POST: (id: string) => `/api/Post/${id}`,
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENT: (id: string) => `/community/posts/${id}/comments`,
    TRENDING: `/community/trending`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/api/v1/notifications",
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: "/api/v1/notifications/mark-all-read",
    DELETE: (id: string) => `/api/v1/notifications/${id}`,
  },

  // File Upload
  UPLOAD: {
    SINGLE: "/api/v1/upload/single",
    MULTIPLE: "/api/v1/upload/multiple",
    AVATAR: "/api/v1/upload/avatar",
    PET_PHOTO: "/api/v1/upload/pet-photo",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request Headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE_JSON: "application/json",
  CONTENT_TYPE_FORM: "multipart/form-data",
  AUTHORIZATION: "Authorization",
} as const;
