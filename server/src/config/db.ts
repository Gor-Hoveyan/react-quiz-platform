import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://gorhoveyangor:niMjzYf20K34qZ8t@ptest.xgpovf7.mongodb.net/');
        console.log('MongoDB is successfully connected');
    } catch(err) {
        console.log(err);
    }
}