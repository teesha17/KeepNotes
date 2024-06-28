const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://teeshu2179:2B0LoEkxsmNgTdcD@cluster0.iaaonvx.mongodb.net/handicart";

const mongodb = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to database');
        
        // After connecting, access the collection
        const db = mongoose.connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

module.exports = mongodb;