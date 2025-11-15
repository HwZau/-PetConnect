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
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    RESET: "/reset",
    VERIFIED_RESET: "/verified/reset",
    DISABLE: "/disable",
    VERIFIED_DISABLE: "/verified/disable",
  },

  // Users
  USERS: {
    LIST: "/users/getall",
    DETAIL: "/user/:id",
    UPDATE: "/user/:id",
    CREATE: "/user/create",
    DELETE: "/user/:id",
    PROFILE: "/user/profile/me",
    FREELANCER_PROFILE: "/user/profile/freelancer/me",
  },

  // Pets
  PETS: {
    LIST: "/pet/getall",
    DETAIL: (id: string) => `/pet/${id}`,
    USER_PETS: (userId: string) => `/pet/user/${userId}/pets`,
    CREATE: "/pet/create",
    UPDATE: (id: string) => `/pet/update/${id}`,
    EDIT: (id: string) => `/pet/edit/${id}`, // New: Edit pet endpoint
    DELETE: (id: string) => `/pet/delete/${id}`,
    ADD_PET: (id: string) => `/pet/add/${id}`,
    CREATE_USER_PET: (userId: string) => `/pet/${userId}`,
  },

  // Services
  SERVICES: {
    LIST: "/services",
    CATEGORIES: "/services/categories",
    DETAIL: (id: string) => `/services/${id}`,
    SEARCH: "/services/search",
    NEARBY: "/services/nearby",
    CREATE: "/service/create",
    UPDATE: (id: string) => `/service/update/${id}`,
    DELETE: (id: string) => `/service/delete/${id}`,
  },

  // Bookings
  BOOKINGS: {
    LIST: "/booking/getall",
    CREATE: "/booking/create",
    DETAIL: (id: string) => `/booking/${id}`,
    UPDATE: (id: string) => `/booking/${id}`,
    CANCEL: (id: string) => `/booking/${id}/cancel`,
    HISTORY: "/booking/history",
    USER_BOOKINGS: "/booking/user/me",
  },

  // Payments
  PAYMENT: {
    CREATE: "/payment/create",
    VNPAY_CALLBACK: "/payment/vnpay-callback",
    MOMO_CALLBACK: "/payment/momo-callback",
    MOMO_RETURN: "/payment/momo-return",
    BY_BOOKING: (bookingId: string) => `/payment/booking/${bookingId}`,
    DETAIL: (paymentId: string) => `/payment/${paymentId}`,
    CANCEL: (paymentId: string) => `/payment/${paymentId}/cancel`,
  },

  // Freelancers
  FREELANCERS: {
    LIST: "/freelancer/getall",
    DETAIL: (id: string) => `/freelancer/${id}`,
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
    POSTS: "/community/posts",
    CREATE_POST: "/community/posts",
    POST_DETAIL: (id: string) => `/community/posts/${id}`,
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENT: (id: string) => `/community/posts/${id}/comments`,
    TRENDING: "/community/trending",
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
