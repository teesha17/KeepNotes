const express = require('express');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes.js'); 

const router = express.Router();

// Route to create a note
router.post('/createnote', [
    body('email').isEmail(),
    body('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('body').isLength({ min: 1 }).withMessage('Body is required'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, title, body, deadline } = req.body;

    try {
        let userNotes = await Notes.findOne({ email });
        if (!userNotes) {
            // Create a new document if it doesn't exist
            userNotes = new Notes({
                email,
                notes_data: [{ title, body, deadline }]
            });
        } else {
            // Add the new note to the existing notes_data array
            userNotes.notes_data.push({ title, body, deadline });
        }
        await userNotes.save();
        res.json({ success: true, notes: userNotes.notes_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
