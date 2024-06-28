const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    }
});

const NotesSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    notes_data: {
        type: [NoteSchema],  
        required: true
    }
});

module.exports = mongoose.model('notes', NotesSchema);
