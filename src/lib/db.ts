import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

export const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL!);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectToDB;

let catched: MongooseConnection = (global as any).mongoose;

if(!catched){
    catched = (global as any).mongoose = {
    conn: null,
    promise: null
    };
}

export const dbConnect = async () => {
    if(catched.conn){
        return catched.conn;
    }

    catched.promise = catched.promise || mongoose.connect(MONGODB_URL!,
        {
            dbName: 'Alexandria',
            bufferCommands: false,
            connectTimeoutMS: 10000,
        });

    catched.conn = await catched.promise;
    return catched.conn;
}
