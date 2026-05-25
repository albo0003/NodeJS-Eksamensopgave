import { MongoClient } from 'mongodb';

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

const dbName = "StudyHubDB"; 

export const db = client.db(dbName);


export default {
    users: db.collection('users'),
    groups: db.collection('groups')
};
export async function connectDB() {
    try {
        await client.connect();
        db.dropDatabase();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }  
}  