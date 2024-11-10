
const Note = require('../models/note.model')


const createNote = async (req, res) =>{
    const {title, content, tags} = req.body   
    const {user} = req.user;

    try {
        const note = new Note({
            title,
            content,
            tags,
            userId: user._id
        })

        await note.save()
        res.status(200).json({
            note,
            message: "Note Added Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server Error")
    }

}


const editNote = async (req,res)=>{
    const noteId = req.params.noteId
    const {title, content, tags, isPinned } = req.body
    const {user} = req.user

        if(!title && !content && !tags){
            return res.status(400).json({
                message: "No changes provided"
            })
        }

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id})
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }

        if(title) note.title = title
        if(content) note.content = content
        if(tags) note.tags = tags
        if(isPinned) note.isPinned = isPinned

        await note.save()

        return res.status(200).json({
            note,
            message: "Note Updated Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server Error"
        })
    }

}

// Get All NOtes
const getAllNotes = async (req,res)=>{
    const {user} = req.user

    try {
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1})

        return res.json({
            notes,
            message: "All notes retrieved successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server Error at getAllNotes API"})
    }
}

// Delete note
const deleteNote = async (req,res)=>{
    const noteId = req.params.noteId
    const {user} = req.user

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id})


        if(!note){
            return res.statu(401).json({
                message: "Note not found"
            })
        }
        await Note.deleteOne({_id: noteId, userId: user._id})

        return res.json({
            message: "Note Deleted Successfully"
        })

    } catch (error) {
        return res.json({
            message: "internal server error"
        })
    }
}

// Update isPinned value
const updateNotePinned = async (req,res)=>{
    const noteId = req.params.noteId
    const {isPinned } = req.body
    const {user} = req.user

        // if(!isPinned){
        //     return res.status(400).json({
        //         message: "No changes provided"
        //     })
        // }

//     try {
//         const note = await Note.findOne({_id: noteId, userId: user._id})
//         if(!note){
//             return res.status(404).json({error: true, message: "Note not found"})
//         }

//         if(isPinned) note.isPinned = isPinned

//         await note.save()

//         return res.json({
//             error: false,
//             note,
//             message: "Note isPinned updated successfully"
//         })

//     } catch (error) {
//         return res.status(500).json({
//             error: true,
//             message: "Internal server Error"
//         })
//     }

}

// Search Notes
const searchNot = async (req,res) =>{
    const {user} = req.user
    const {query} = req.query

    if(!query){
        return res.status(400).json({message: "Search query is required"})
    }

    try {
        const matchingNote = await Note.find({
            userId: user._id,
            $or:[
                {title: { $regex: new RegExp(query, "i")}},
                {content: {$regex: new RegExp(query, "i")}}
            ]
        })

        return Note.estimatedDocumentCount.json({
            notes: matchingNote,
            message: "Notes matching the search query retrieved successfully"
        })

    } catch (error) {
        return res.status(500).json({
                error: true,
                message: "Internal server Error"
            })
    }
}

module.exports = {createNote, editNote, getAllNotes, deleteNote, updateNotePinned }

