
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import {MdAdd} from 'react-icons/md'
import AddEditNotes from '../components/AddEditNotes'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toast from '../components/Toast'
import { GiNotebook } from "react-icons/gi";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({ isShown:true, type:"edit", data:noteDetails})
  }

  const showToastMessage = (message, type)=>{
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }

  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown: false,
      message: "",
    })
  }

  // get user info 
  const getUserInfo = async () =>{
    try {
      const res = await axios.get("http://localhost:4000/user/get-user",{ withCredentials: true })

      if(res.data && res.data.user){
        setUserInfo(res.data.user)
      }
    } catch (error) {
      if(error.response.status === 401 || error.response.status === 404 ){
        navigate("/login")
      }
    }
  }

  // Get all notes
  const getAllNotes = async ()=>{
    try {
      const response = await axios.get("http://localhost:4000/notes/get-all-notes",{ 
        withCredentials: true})

      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Delete Note
  const deleteNote = async (data)=>{
    const noteId = data._id
    try {
      const response = await axios.delete("http://localhost:4000/notes/delete-note/"+noteId,
        {withCredentials:true}
      )
 

      if(response.data && response.data.message){
        showToastMessage(response.data.message, 'delete')
        getAllNotes()
      } 

    } catch (error) {
      if(error.response &&
        error.response.data &&
        error.response.data.message
      ){
        console.log(error.response.data.message)
      }
    }
  }

  useEffect(()=>{
    getUserInfo();
    getAllNotes();
    return ()=>{}
  }, []);

  return (
    <>
    <Navbar userInfo={userInfo} />

    <div className='container mx-auto' >
    
      {allNotes?.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>
      {allNotes.map((note) => (
      <NoteCard
        key={note._id}
        title={note.title}
        date={note.createdOn}
        content={note.content}
        tags={note.tags}
        isPinned={note.ispinned}
        onEdit={() => handleEdit(note)}
        onDelete={() => deleteNote(note)}
        onPinNote={() => {}}
      />
      ))}
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center ">
            <GiNotebook size={200} className="m-4 opacity-10" />
            <p className="text-lg text-gray-700 font-medium select-none">Start creating your first note!</p>
          </div>
      )}
    </div>

    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{
      setOpenAddEditModal({isShown:true, type:"add", data:null})
    }} >
      <MdAdd className='text-[32px] text-white' />
    </button>

    <Modal
        isOpen={openAddEditModal.isShown}
        appElement={document.getElementById('root')}
        onRequestClose={()=>{}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white mx-auto rounded-md mt-14 p-5"
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{setOpenAddEditModal({
          isShown: false,
          type: "add",
          data: null
         })}}
         getAllNotes={getAllNotes}
         showToastMessage={showToastMessage}
         />

    </Modal>

    <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
    />

    </>
  )
}

export default Home
