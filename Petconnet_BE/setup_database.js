// MongoDB Shell Script để tạo database PetConnect
// Chạy lệnh: mongo < setup_database.js

// Sử dụng database PetConnect
use PetConnect;

// Tạo collections và indexes
db.createCollection("users");
db.createCollection("pets");
db.createCollection("services");
db.createCollection("bookings");
db.createCollection("payments");
db.createCollection("posts");
db.createCollection("events");
db.createCollection("notifications");

// Tạo indexes cho hiệu suất
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

db.pets.createIndex({ "owner": 1 });
db.pets.createIndex({ "status": 1 });

db.services.createIndex({ "freelancer": 1 });
db.services.createIndex({ "category": 1 });
db.services.createIndex({ "isActive": 1 });

db.bookings.createIndex({ "customerId": 1 });
db.bookings.createIndex({ "freelancerId": 1 });
db.bookings.createIndex({ "serviceId": 1 });
db.bookings.createIndex({ "status": 1 });
db.bookings.createIndex({ "scheduledDate": 1 });

db.payments.createIndex({ "bookingId": 1 });
db.payments.createIndex({ "userId": 1 });
db.payments.createIndex({ "status": 1 });

db.posts.createIndex({ "authorId": 1 });
db.posts.createIndex({ "isActive": 1 });
db.posts.createIndex({ "createdAt": -1 });

db.events.createIndex({ "organizer": 1 });
db.events.createIndex({ "startDate": 1 });
db.events.createIndex({ "isActive": 1 });

db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "createdAt": -1 });

// Thêm dữ liệu mẫu (Seed Data)

// 1. Tạo Admin user
db.users.insertOne({
  email: "admin@petconnect.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
  name: "Admin User",
  phoneNumber: "0123456789",
  role: "Admin",
  isVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 2. Tạo Customer user
db.users.insertOne({
  email: "customer@petconnect.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
  name: "John Customer",
  phoneNumber: "0987654321",
  address: {
    street: "123 Main St",
    city: "Ho Chi Minh City",
    zipCode: "70000",
    country: "Vietnam"
  },
  role: "Customer",
  isVerified: true,
  isActive: true,
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// 3. Tạo Freelancer user
db.users.insertOne({
  email: "freelancer@petconnect.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
  name: "Jane Freelancer",
  phoneNumber: "0123987654",
  address: {
    street: "456 Service Ave",
    city: "Ho Chi Minh City",
    zipCode: "70000",
    country: "Vietnam"
  },
  role: "Freelancer",
  isVerified: true,
  isActive: true,
  location: "Ho Chi Minh City",
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: true
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Lấy ID của các users đã tạo
const adminUser = db.users.findOne({ email: "admin@petconnect.com" });
const customerUser = db.users.findOne({ email: "customer@petconnect.com" });
const freelancerUser = db.users.findOne({ email: "freelancer@petconnect.com" });

// 4. Thêm thú cưng mẫu
db.pets.insertOne({
  owner: customerUser._id,
  name: "Max",
  type: "dog",
  breed: "Golden Retriever",
  age: 3,
  weight: 25,
  color: "Golden",
  specialNeeds: "None",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
});

const pet = db.pets.findOne({ name: "Max" });

// 5. Thêm dịch vụ mẫu
db.services.insertOne({
  name: "Basic Dog Grooming",
  description: "Complete grooming service for dogs including bath, haircut, and nail trimming",
  price: 150000,
  duration: 60,
  category: "grooming",
  requirements: ["Vaccination records", "No aggressive behavior"],
  freelancer: freelancerUser._id,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const service = db.services.findOne({ name: "Basic Dog Grooming" });

// 6. Thêm booking mẫu
db.bookings.insertOne({
  customerId: customerUser._id,
  freelancerId: freelancerUser._id,
  serviceId: service._id,
  petIds: [pet._id],
  scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày sau
  timeSlot: "Slot1",
  specialRequests: "Please be gentle with Max",
  totalAmount: 150000,
  status: "Pending",
  pickUpStatus: "NotPickedUp",
  paymentStatus: "pending",
  customerInfo: {
    name: customerUser.name,
    email: customerUser.email,
    phone: customerUser.phoneNumber,
    address: customerUser.address
  },
  statusHistory: [{
    status: "Pending",
    updatedAt: new Date(),
    updatedBy: "system"
  }],
  createdAt: new Date(),
  updatedAt: new Date()
});

const booking = db.bookings.findOne({ customerId: customerUser._id });

// 7. Thêm payment mẫu
db.payments.insertOne({
  bookingId: booking._id,
  userId: customerUser._id,
  amount: 150000,
  currency: "VND",
  status: "pending",
  paymentMethod: {
    type: "credit_card",
    name: "Visa ****1234"
  },
  description: "Payment for Basic Dog Grooming service",
  createdAt: new Date(),
  updatedAt: new Date()
});

// 8. Thêm post mẫu trong community
db.posts.insertOne({
  authorId: customerUser._id,
  authorName: customerUser.name,
  authorAvatar: null,
  content: "Just adopted Max! He's such a good boy 🐕",
  imageUrls: [],
  likes: 0,
  commentsCount: 0,
  likedBy: [],
  comments: [],
  tags: ["adoption", "dog"],
  category: "general",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 9. Thêm event mẫu
db.events.insertOne({
  title: "Pet Adoption Fair 2026",
  description: "Join us for our annual pet adoption fair! Meet adorable pets waiting for their forever homes.",
  organizer: adminUser._id,
  startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 ngày sau
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 tiếng sau
  location: {
    address: "123 Pet Center, District 1",
    city: "Ho Chi Minh City",
    coordinates: {
      lat: 10.762622,
      lng: 106.660172
    }
  },
  maxAttendees: 200,
  currentAttendees: 0,
  attendees: [],
  category: "social",
  imageUrl: null,
  isActive: true,
  price: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 10. Thêm notification mẫu
db.notifications.insertOne({
  userId: customerUser._id,
  title: "Booking Confirmed",
  message: "Your booking for Basic Dog Grooming has been confirmed",
  type: "booking",
  isRead: false,
  relatedId: booking._id,
  relatedModel: "Booking",
  data: {
    bookingId: booking._id
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print("✅ Database PetConnect đã được tạo thành công!");
print("📊 Collections đã tạo:");
db.getCollectionNames().forEach(function(collection) {
  print("  - " + collection);
});

print("\n👤 Users mẫu:");
db.users.find({}, { email: 1, name: 1, role: 1 }).forEach(function(user) {
  print("  - " + user.name + " (" + user.email + ") - " + user.role);
});

print("\n🐕 Pets mẫu:");
db.pets.find({}, { name: 1, type: 1, breed: 1 }).forEach(function(pet) {
  print("  - " + pet.name + " (" + pet.type + " - " + pet.breed + ")");
});

print("\n📋 Total documents:");
print("  - Users: " + db.users.countDocuments());
print("  - Pets: " + db.pets.countDocuments());
print("  - Services: " + db.services.countDocuments());
print("  - Bookings: " + db.bookings.countDocuments());
print("  - Payments: " + db.payments.countDocuments());
print("  - Posts: " + db.posts.countDocuments());
print("  - Events: " + db.events.countDocuments());
print("  - Notifications: " + db.notifications.countDocuments());