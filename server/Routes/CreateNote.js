const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Notes = require('../models/Notes.js');
const router = express.Router();

// Create note route
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
            userNotes = new Notes({
                email,
                notes_data: [{ title, body, deadline }]
            });
        } else {
            userNotes.notes_data.push({ title, body, deadline });
        }
        await userNotes.save();
        res.json({ success: true, notes: userNotes.notes_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Delete note route
router.delete('/deletenote/:email/:title', [
    param('email').isEmail().withMessage('Email must be valid'),
    param('title').isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, title } = req.params;

    try {
        let userNotes = await Notes.findOne({ email });
        if (!userNotes) {
            return res.status(404).json({ success: false, error: 'Notes not found for this email' });
        }

        const initialLength = userNotes.notes_data.length;
        userNotes.notes_data = userNotes.notes_data.filter(note => note.title !== title);

        if (initialLength === userNotes.notes_data.length) {
            return res.status(404).json({ success: false, error: 'Note not found' });
        }

        await userNotes.save();
        res.json({ success: true, notes: userNotes.notes_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});


// Update note route
router.put('/updatenote/:email/:title', [
    param('email').isEmail().withMessage('Email must be valid'),
    param('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('newTitle').optional().isLength({ min: 1 }).withMessage('New title must be provided'),
    body('newBody').optional().isLength({ min: 1 }).withMessage('New body must be provided'),
    body('newDeadline').optional().isISO8601().withMessage('New deadline must be a valid date')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, title } = req.params;
    const { newTitle, newBody, newDeadline } = req.body;

    try {
        let userNotes = await Notes.findOne({ email });
        if (!userNotes) {
            return res.status(404).json({ success: false, error: 'Notes not found for this email' });
        }

        const note = userNotes.notes_data.find(note => note.title === title);
        if (!note) {
            return res.status(404).json({ success: false, error: 'Note not found' });
        }

        if (newTitle) note.title = newTitle;
        if (newBody) note.body = newBody;
        if (newDeadline) note.deadline = newDeadline;

        await userNotes.save();
        res.json({ success: true, notes: userNotes.notes_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
