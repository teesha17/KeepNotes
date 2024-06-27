const mongoose = require('mongoose');

const mongodb = async () => {
    try {
        await mongoose.connect(MONGOURI);
        console.log('Connected to database');
        
        // After connecting, access the collection
        const db = mongoose.connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

module.exports = mongodb;