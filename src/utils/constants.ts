export const CONSTANTS = {
  // Vietnamese phone prefixes
  VN_PHONE_PREFIXES: ["03", "05", "07", "08", "09"],

  // File types for pet images
  IMAGE_TYPES: ["jpg", "jpeg", "png", "gif", "webp"],

  // Common regex patterns
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    VN_PHONE: /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/,
    URL: /^https?:\/\/.+/,
    SLUG: /^[a-z0-9-]+$/,
    PASSWORD_STRONG:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    VIETNAMESE_NAME:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/,
  },

  // HTTP status codes
  HTTP_STATUS: {
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  } as const,

  // File size limits for pet images
  FILE_SIZE_LIMITS: {
    PET_IMAGE_MB: 5,
    AVATAR_MB: 2,
  },

  // Timeouts for PawNest
  TIMEOUTS: {
    DEBOUNCE_SEARCH: 300,
    API_REQUEST: 30000,
    TOAST_DURATION: 3000,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Pet related constants
  PET: {
    TYPES: ["dog", "cat", "bird", "fish", "rabbit", "hamster", "other"],
    SIZES: ["small", "medium", "large"],
    AGES: ["puppy", "young", "adult", "senior"],
    GENDERS: ["male", "female"],
  },

  // User roles
  USER_ROLES: {
    USER: "user",
    FREELANCER: "freelancer",
    ADMIN: "admin",
  } as const,

  // Service categories
  SERVICE_CATEGORIES: {
    PET_SITTING: "pet_sitting",
    DOG_WALKING: "dog_walking",
    PET_GROOMING: "pet_grooming",
    VETERINARY: "veterinary",
    PET_TRAINING: "pet_training",
    PET_TRANSPORTATION: "pet_transportation",
  } as const,
};
