
const express = require('express')
const postController = require('../controllers/noteController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router()

// // CREATE || POST
router.post('/create-note', verifyToken,  postController.createNote)

// // EDIT || PUT
router.put('/edit-note/:noteId', verifyToken,  postController.editNote)

//  GET ALL NOTES || GET
router.get('/get-all-notes', verifyToken, postController.getAllNotes)

// DELETE NOTE || DELETE
router.delete('/delete-note/:noteId', verifyToken, postController.deleteNote)

// UPDATE ISPINNED NOTE || PUT
router.delete('/update-note-pinned/:noteId', verifyToken, postController.deleteNote)

// SEARCH NOTE || PUT
router.put("/search-notes", verifyToken, postController)

module.exports = router