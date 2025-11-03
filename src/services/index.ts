// Services exports
export { apiClient } from "./apiClient";
export { authService } from "./auth/authService";
export { petService } from "./pet/petService";
// export { bookingService } from '../services/Booking/bookingService';
// export { caregiverService } from '../services/Caregiver/caregiverService';
// export { reviewService } from '../services/Review/reviewService';
// export { messageService } from '../services/Message/messageService';
// Re-export mock profile services
export * from "./Profile/User/mockUserService";
export * from "./Profile/Freelancer/mockFreelancerService";
