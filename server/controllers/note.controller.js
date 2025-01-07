import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information is missing" });
    }

    try {
        const newNote = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await newNote.save();

        return res.json({
            error: false,
            message: "Note created successfully",
            note: newNote,
        });
    } catch (error) {
        return res.status(500).json({ 
            error: true,
            message: "Server error",
            details: error.message,
        });
    }
}

export const editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const  user  = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res
                .status(404)
                .json({ message: "Note not found" });
        }
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;
        await note.save();

        return res.json({
            error: false,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
}

export const getNotes = async (req, res) => {
    const user = req.user;    

    try {
        const notes = await Note.find({ userId: user._id })
            .sort({isPinned: -1});

        return res.json({
            error: false,
            notes,
            message: "Notes fetched successfully",
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
}

export const deleteNote = async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res
                .status(404)
                .json({ message: "Note not found" });
        }

        await note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
}

export const updatePinned = async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const user = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res
                .status(404)
                .json({ message: "Note not found" });
        }
        note.isPinned = isPinned || false;
        await note.save();

        return res.json({
            error: false,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error",
        });
    }
}

export const searchNotes = async (req, res) => {
    const user = req.user;
    const searchQuery = req.query.query;

    if (!searchQuery || typeof searchQuery !== "string") {
        return res.status(400).json({
            error: true,
            message: "Search query is required and must be a string",
        });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
                { tags: { $regex: new RegExp(searchQuery, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server error",
        });
    }
};
