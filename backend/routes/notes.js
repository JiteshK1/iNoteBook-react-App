
import express from "express";
const router = express.Router();
import fetchuser from "../middleware/fetchuser.js";
import { Notes } from "../models/Notes.js";
import { body, validationResult } from 'express-validator';



router.get('/fetchNotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }


})
router.post('/addNote', fetchuser, [
    body('title', 'title should be more than 3 characters').isLength({ min: 3 }), //adding validations by express validators
    body('description', 'title should be more than 5 characters').isLength({ min: 5 }),],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { description, title, tag } = req.body
            const note = new Notes({ description, title, tag, user: req.user.id })
            const noteSave = await note.save();
            res.json(noteSave)

        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error");
        }


    })
router.put('/updateNote/:id', fetchuser, async (req, res) => {
    const { description, title, tag } = req.body;
    try {
        const newNote = {};

        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }




}
)
router.delete('/deleteNote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ 'success': 'Note Deleted', note: note })
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }



}
)
export default router;