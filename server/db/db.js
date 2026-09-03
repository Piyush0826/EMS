import mongoose from "mongoose";

const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URL)
}

export default connectToDatabase