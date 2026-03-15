// Kiểm tra database PetConnect
use PetConnect;

print("=== DATABASE CHECK ===");
print("Current database:", db.getName());
print("");

print("Collections:");
const collections = db.getCollectionNames();
collections.forEach(function(collection) {
  const count = db[collection].countDocuments();
  print(`  - ${collection}: ${count} documents`);
});

print("");
print("Sample users:");
db.users.find({}, { email: 1, name: 1, role: 1 }).forEach(function(user) {
  print(`  - ${user.name} (${user.email}) - ${user.role}`);
});

print("");
print("Sample pets:");
db.pets.find({}, { name: 1, type: 1, breed: 1 }).forEach(function(pet) {
  print(`  - ${pet.name} (${pet.type} - ${pet.breed})`);
});

print("");
print("✅ Database check completed!");