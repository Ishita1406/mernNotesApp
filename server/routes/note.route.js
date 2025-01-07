import express from 'express';
import { createNote, deleteNote, editNote, getNotes, searchNotes, updatePinned } from '../controllers/note.controller.js';
import { authenticateToken } from '../utils/authenticate.js';

const noteRouter = express.Router();

noteRouter.post('/add', authenticateToken, createNote);

noteRouter.put('/edit/:noteId', authenticateToken, editNote);

noteRouter.get('/get', authenticateToken, getNotes);

noteRouter.delete('/delete/:noteId', authenticateToken, deleteNote);

noteRouter.put('/pinned/:noteId', authenticateToken, updatePinned);

noteRouter.get('/search', authenticateToken, searchNotes);

export default noteRouter;