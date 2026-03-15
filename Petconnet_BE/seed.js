const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Pet = require('./models/Pet');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PetConnect')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'John Customer',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'Customer',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        isActive: true,
        profilePicture: '/uploads/images/default-avatar.jpg'
      },
      {
        name: 'Jane Customer',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'Customer',
        phone: '+1234567891',
        address: '456 Oak Ave, City, State',
        isActive: true,
        profilePicture: '/uploads/images/default-avatar.jpg'
      },
      {
        name: 'Mike Freelancer',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'Freelancer',
        phone: '+1234567892',
        address: '789 Pine St, City, State',
        isActive: true,
        profilePicture: '/uploads/images/default-avatar.jpg',
        bio: 'Professional pet sitter with 5 years experience',
        skills: ['Pet Sitting', 'Dog Walking', 'Pet Grooming'],
        rating: 4.8,
        reviewCount: 25
      },
      {
        name: 'Sarah Freelancer',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'Freelancer',
        phone: '+1234567893',
        address: '321 Elm St, City, State',
        isActive: true,
        profilePicture: '/uploads/images/default-avatar.jpg',
        bio: 'Veterinary assistant and pet care specialist',
        skills: ['Pet Care', 'Veterinary Services', 'Pet Training'],
        rating: 4.9,
        reviewCount: 42
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Admin',
        phone: '+1234567894',
        address: '999 Admin Blvd, City, State',
        isActive: true,
        profilePicture: '/uploads/images/default-avatar.jpg'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.length);

    // Create pets
    const pets = [
      {
        name: 'Buddy',
        type: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 30,
        color: 'Golden',
        gender: 'Male',
        description: 'Friendly and energetic golden retriever',
        medicalHistory: 'Vaccinated, no known allergies',
        owner: createdUsers[0]._id,
        status: 'active',
        images: ['/uploads/images/pet1.jpg']
      },
      {
        name: 'Whiskers',
        type: 'cat',
        breed: 'Persian',
        age: 2,
        weight: 8,
        color: 'White',
        gender: 'Female',
        description: 'Calm and affectionate Persian cat',
        medicalHistory: 'Indoor cat, regular vet checkups',
        owner: createdUsers[0]._id,
        status: 'active',
        images: ['/uploads/images/pet2.jpg']
      },
      {
        name: 'Max',
        type: 'dog',
        breed: 'Labrador',
        age: 4,
        weight: 35,
        color: 'Black',
        gender: 'Male',
        description: 'Loyal family dog',
        medicalHistory: 'Healthy, loves treats',
        owner: createdUsers[1]._id,
        status: 'active',
        images: ['/uploads/images/pet3.jpg']
      }
    ];

    const createdPets = await Pet.insertMany(pets);
    console.log('Created pets:', createdPets.length);

    // Create services
    const services = [
      {
        name: 'Dog Walking Service',
        description: 'Professional dog walking service with experienced handlers',
        category: 'walking',
        price: 25,
        duration: 60,
        freelancer: createdUsers[2]._id,
        isActive: true,
        imageUrl: '/uploads/images/service1.jpg'
      },
      {
        name: 'Pet Sitting - Overnight',
        description: 'Overnight pet sitting service in your home',
        category: 'boarding',
        price: 75,
        duration: 1440,
        freelancer: createdUsers[2]._id,
        isActive: true,
        imageUrl: '/uploads/images/service2.jpg'
      },
      {
        name: 'Pet Grooming',
        description: 'Complete pet grooming service including bath, nail trim, and styling',
        category: 'grooming',
        price: 50,
        duration: 90,
        freelancer: createdUsers[3]._id,
        isActive: true,
        imageUrl: '/uploads/images/service3.jpg'
      },
      {
        name: 'Veterinary Consultation',
        description: 'Basic veterinary consultation and health checkup',
        category: 'veterinary',
        price: 80,
        duration: 30,
        freelancer: createdUsers[3]._id,
        isActive: true,
        imageUrl: '/uploads/images/service4.jpg'
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log('Created services:', createdServices.length);

    // Create bookings
    const bookings = [
      {
        customerId: createdUsers[0]._id,
        freelancerId: createdUsers[2]._id,
        serviceId: createdServices[0]._id,
        petIds: [createdPets[0]._id],
        scheduledDate: new Date('2024-02-15T10:00:00Z'),
        timeSlot: 'Slot1',
        status: 'Confirmed',
        specialRequests: 'Please bring treats for Buddy',
        totalAmount: 25
      },
      {
        customerId: createdUsers[1]._id,
        freelancerId: createdUsers[3]._id,
        serviceId: createdServices[2]._id,
        petIds: [createdPets[2]._id],
        scheduledDate: new Date('2024-02-16T14:00:00Z'),
        timeSlot: 'Slot2',
        status: 'Completed',
        specialRequests: 'Max needs a full grooming session',
        totalAmount: 50
      },
      {
        customerId: createdUsers[0]._id,
        freelancerId: createdUsers[2]._id,
        serviceId: createdServices[1]._id,
        petIds: [createdPets[1]._id],
        scheduledDate: new Date('2024-02-20T20:00:00Z'),
        timeSlot: 'Slot3',
        status: 'Pending',
        specialRequests: 'Overnight sitting needed',
        totalAmount: 75
      }
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log('Created bookings:', createdBookings.length);

    // Create payments
    const payments = [
      {
        bookingId: createdBookings[0]._id,
        userId: createdUsers[0]._id,
        amount: 25,
        currency: 'USD',
        status: 'completed',
        paymentMethod: {
          type: 'credit_card',
          name: 'Visa ****1234'
        },
        transactionId: 'txn_1234567890',
        completedAt: new Date('2024-02-14T15:00:00Z')
      },
      {
        bookingId: createdBookings[1]._id,
        userId: createdUsers[1]._id,
        amount: 50,
        currency: 'USD',
        status: 'completed',
        paymentMethod: {
          type: 'paypal',
          name: 'PayPal Account'
        },
        transactionId: 'txn_0987654321',
        completedAt: new Date('2024-02-15T12:00:00Z')
      },
      {
        bookingId: createdBookings[2]._id,
        userId: createdUsers[0]._id,
        amount: 75,
        currency: 'USD',
        status: 'pending',
        paymentMethod: {
          type: 'credit_card',
          name: 'MasterCard ****5678'
        },
        transactionId: 'txn_pending_001'
      }
    ];

    const createdPayments = await Payment.insertMany(payments);
    console.log('Created payments:', createdPayments.length);

    console.log('Database seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Customer: john@example.com / password123');
    console.log('Customer: jane@example.com / password123');
    console.log('Freelancer: mike@example.com / password123');
    console.log('Freelancer: sarah@example.com / password123');
    console.log('Admin: admin@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seeding function
seedDatabase();