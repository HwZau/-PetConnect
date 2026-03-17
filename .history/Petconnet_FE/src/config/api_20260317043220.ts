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
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    RESET: "/auth/reset",
    VERIFIED_RESET: "/auth/verified/reset",
    DISABLE: "/auth/disable",
    VERIFIED_DISABLE: "/auth/verified/disable",
  },

  // Users
  USERS: {
    LIST: "/users/getall",
    DETAIL: "/users/:id",
    UPDATE: "/users/:id",
    CREATE: "/users/create",
    DELETE: "/users/:id",
    PROFILE: "/auth/profile/me",
    FREELANCER_PROFILE: "/auth/profile/freelancer/me",
  },

  // Profile
  PROFILE: {
    UPDATE_CUSTOMER: "/auth/profile/customer",
    UPDATE_FREELANCER: "/auth/profile/freelancer",
  },

  // Pets
  PETS: {
    LIST: "/pets/getall",
    DETAIL: (id: string) => `/pets/${id}`,
    USER_PETS: (userId: string) => `/pets/user/${userId}/pets`,
    CREATE: "/pets/create",
    UPDATE: (id: string) => `/pets/update/${id}`,
    EDIT: (id: string) => `/pets/edit/${id}`, // New: Edit pet endpoint
    DELETE: (id: string) => `/pets/remove/${id}`,
    ADD_PET: (id: string) => `/pets/add/${id}`,
    CREATE_USER_PET: (userId: string) => `/pets/${userId}`,
  },

  // Services
  SERVICES: {
    LIST: "/services",
    CATEGORIES: "/services/categories",
    DETAIL: (id: string) => `/services/${id}`,
    SEARCH: "/services/search",
    NEARBY: "/services/nearby",
    CREATE: "/services/create",
    UPDATE: (id: string) => `/services/update/${id}`,
    DELETE: (id: string) => `/services/delete/${id}`,
  },

  // Bookings
  BOOKINGS: {
    LIST: "/bookings/getall",
    CREATE: "/bookings/create",
    DETAIL: (id: string) => `/bookings/${id}`,
    DETAIL_FULL: (id: string) => `/bookings/${id}/details`, // With payment, services, pets
    UPDATE: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/cancel/${id}`,
    HISTORY: "/bookings/history",
    MY_HISTORY: "/bookings/my-history", // Current user's bookings
    CUSTOMER_HISTORY: (customerId: string) =>
      `/bookings/customer/${customerId}/history`,
    FREELANCER_HISTORY: (freelancerId: string) =>
      `/bookings/freelancer/${freelancerId}/history`,
    UPDATE_STATUS: (id: string) => `/bookings/status/${id}`,
    UPDATE_PICKUP_STATUS: (id: string) => `/bookings/pickup-status/${id}`,
    USER_BOOKINGS: "/bookings/history", // Legacy endpoint for compatibility
    CUSTOMER_BOOKINGS: (customerId: string, page: number, limit: number) =>
      `/bookings/customer/${customerId}/history?page=${page}&limit=${limit}`,
    FREELANCER_BOOKINGS: (freelancerId: string, page: number, limit: number) =>
      `/bookings/freelancer/${freelancerId}/history?page=${page}&limit=${limit}`,
  },

  // Payments
  PAYMENT: {
    CREATE: "/payments/create",
    PAYOS_CALLBACK: "/payments/payos-callback",
    // VNPAY_CALLBACK: "/payments/vnpay-callback", // Commented - using PayOS
    // MOMO_CALLBACK: "/payments/momo-callback",
    // MOMO_RETURN: "/payments/momo-return",
    BY_BOOKING: (bookingId: string) => `/payments/booking/${bookingId}`,
    DETAIL: (paymentId: string) => `/payments/${paymentId}`,
    CANCEL: (paymentId: string) => `/payments/${paymentId}/cancel`,
    STATUS: (bookingId: string) => `/payments/${bookingId}/status`,
    CONFIRM: (paymentId: string) => `/payments/${paymentId}/confirm`,
  },

  // Freelancers
  FREELANCERS: {
    LIST: "/freelancers/getall",
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
    POSTS: "/community/posts",
    CREATE_POST: "/community/posts",
    POST_DETAIL: (id: string) => `/community/posts/${id}`,
    DELETE_POST: (id: string) => `/community/posts/${id}`,
    UPDATE_POST: (id: string) => `/community/posts/${id}`,
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

  // Cloudinary
  CLOUDINARY: {
    UPLOAD: "/cloudinary/upload",
    UPLOAD_BASE64: "/cloudinary/upload-base64",
    UPLOAD_VIDEO: "/cloudinary/upload-video",
    UPLOAD_VIDEO_BASE64: "/cloudinary/upload-base64-video",
    DELETE: (publicId: string) => `/cloudinary/${publicId}`,
    DELETE_VIDEO: (id: string) => `/cloudinary/video/${id}`,
    DELETE_VIDEO_BY_PUBLIC: (publicId: string) =>
      `/cloudinary/video/public/${publicId}`,
    GET_BY_ID: (id: string) => `/cloudinary/${id}`,
    GET_BY_PUBLIC_ID: (publicId: string) => `/cloudinary/public/${publicId}`,
    GET_ALL: "/cloudinary",
    GET_TRANSFORMED_URL: (publicId: string) => `/cloudinary/url/${publicId}`,
    GET_VIDEO_BY_ID: (id: string) => `/cloudinary/video/${id}`,
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
