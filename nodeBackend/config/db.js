import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Add connection timeout and retry logic
    const cnn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${cnn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);

    // Try alternative connection string format
    if (
      error.message.includes("EREFUSED") ||
      error.message.includes("querySrv")
    ) {
      console.log("Trying alternative connection method...");
      try {
        // Remove the srv and use direct connection
        const fallbackUri = process.env.MONGODB_URI.replace(
          "mongodb+srv://",
          "mongodb://"
        ).replace("/?", "/chatboot?");
        const cnn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB Connected (fallback): ${cnn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(
          "Fallback connection also failed:",
          fallbackError.message
        );
      }
    }

    console.log("Please check:");
    console.log("1. MongoDB Atlas cluster is running");
    console.log("2. Your IP is whitelisted in Network Access");
    console.log("3. Internet connection is stable");
    process.exit(1);
  }
};

export default connectDB;
