import mongoose from "mongoose";
export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to Mongodb: ${mongoose.connection.host}`);
        
    } catch (error) {
        console.log("Error connecting to mongodb", error.message);
        process.exit(1)
        
    }
}