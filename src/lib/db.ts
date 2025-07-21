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
    if (MONGODB_URL === undefined) {
        throw new Error('MONGODB_URL is not defined in environment variables');
    }

    if (catched.conn) return catched.conn;

    try {
        console.log('Connecting to MongoDB...');
        const mongooseOpts = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };
        const conn = await mongoose.connect(MONGODB_URL, mongooseOpts);
        console.log('Successfully connected to MongoDB');
        catched.conn = conn;
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
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
