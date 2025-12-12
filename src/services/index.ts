// Services exports
export { apiClient } from "./apiClient";
export { authService } from "./auth/authService";
export { petService } from "./pet/petService";
export { serviceService } from "./service/serviceService";
export * from "./freelancer/freelancerService";
export { bookingService } from "./booking/bookingService";
export { default as adminService } from "./admin/adminService";
export { default as cloudinaryService } from "./cloudinary/cloudinaryService";
// export { caregiverService } from '../services/Caregiver/caregiverService';
// export { reviewService } from '../services/Review/reviewService';
// export { messageService } from '../services/Message/messageService';
// Re-export mock profile services
export * from "./Profile/User/mockUserService";
export * from "./Profile/Freelancer/mockFreelancerService";

// Profile service for API updates
export { default as profileService } from "./Profile/profileService";
export * from "./Profile/profileService";
