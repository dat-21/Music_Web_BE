// Script để update tất cả user isVerified = true
const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  isVerified: Boolean,
});

const User = mongoose.model("User", userSchema);

async function updateAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Update tất cả user isVerified = true
    const result = await User.updateMany(
      { isVerified: { $ne: true } }, // Tìm user chưa verify
      { $set: { isVerified: true } } // Set isVerified = true
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);

    // Hiển thị danh sách user
    const users = await User.find({}).select("username email isVerified");
    console.log("\n📋 All users:");
    users.forEach((user) => {
      console.log(
        `  - ${user.username} (${user.email}) - Verified: ${user.isVerified}`
      );
    });

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateAllUsers();
