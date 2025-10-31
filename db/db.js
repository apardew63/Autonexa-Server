import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URL exists:', !!process.env.MONGODB_URL);

        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log("✅ MongoDB Connected Successfully!");
        console.log("Database name:", mongoose.connection.name);
        console.log("Database host:", mongoose.connection.host);

    } catch(error) {
        console.error("❌ MongoDB Connection Failed!");
        console.error("Error details:", error.message);
        console.error("Full error:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
}

export default connectToDatabase