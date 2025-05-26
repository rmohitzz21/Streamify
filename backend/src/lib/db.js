import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in Connecting M0ngoDb", error);
            process.exit(1);
    }
}