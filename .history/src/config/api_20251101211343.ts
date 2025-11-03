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
    LOGIN: "/api/v1/login",
    REGISTER: "/api/v1/register",
    LOGOUT: "/api/v1/logout",
    RESET: "/api/v1/reset",
    VERIFIED_RESET: "/api/v1/verified/reset",
    DISABLE: "/api/v1/disable",
    VERIFIED_DISABLE: "/api/v1/verified/disable",
  },

  // Users
  USERS: {
    LIST: "/api/v1/users/getall",
    DETAIL: "/api/v1/user/:id",
    UPDATE: "/api/v1/user/:id",
    CREATE: "/api/v1/user/create",
    DELETE: "/api/v1/user/:id",
    PROFILE: "/api/v1/user/profile/me",
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
    LIST: "/api/v1/services",
    CATEGORIES: "/api/v1/services/categories",
    DETAIL: (id: string) => `/api/v1/services/${id}`,
    SEARCH: "/api/v1/services/search",
    NEARBY: "/api/v1/services/nearby",
  },

  // Bookings
  BOOKINGS: {
    LIST: "/bookings",
    CREATE: "/bookings",
    DETAIL: (id: string) => `/bookings/${id}`,
    UPDATE: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    HISTORY: "/bookings/history",
  },

  // Freelancers
  FREELANCERS: {
    LIST: "/freelancers",
    DETAIL: (id: string) => `/freelancers/${id}`,
    SEARCH: "/freelancers/search",
    REVIEWS: (id: string) => `/freelancers/${id}/reviews`,
    PORTFOLIO: (id: string) => `/freelancers/${id}/portfolio`,
  },

  // Events
  EVENTS: {
    LIST: "/events",
    CREATE: "/events",
    DETAIL: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    JOIN: (id: string) => `/events/${id}/join`,
    LEAVE: (id: string) => `/events/${id}/leave`,
    UPCOMING: "/events/upcoming",
  },

  // Community
  COMMUNITY: {
    POSTS: "/api/Post",
    CREATE_POST: "/api/Post",
    POST_DETAIL: (id: string) => `/api/Post/${id}`,
    UPDATE_POST: (id: string) => `/api/Post/${id}`,
    DELETE_POST: (id: string) => `/api/Post/${id}`,
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENT: (id: string) => `/community/posts/${id}/comments`,
    TRENDING: `/community/trending`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // File Upload
  UPLOAD: {
    SINGLE: "/upload/single",
    MULTIPLE: "/upload/multiple",
    AVATAR: "/upload/avatar",
    PET_PHOTO: "/upload/pet-photo",
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
