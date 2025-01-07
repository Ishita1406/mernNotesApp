import React, { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance.js'
import Header from '../components/Header.jsx'
import Toast from '../components/Toast.jsx'
import moment from 'moment'
import EmptyCard from '../components/EmptyCard.jsx'
import addNotesImg from '../assets/add-notes.svg'
import noNotesImg from '../assets/no-notes.svg'

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null
  });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const accessToken = localStorage.getItem('access_token');
    
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      return;
    }

    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.get('server/auth/get');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('server/note/get');
      
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
      
    } catch (error) { 
      console.log("An error occurred while fetching notes");
    }
  }

  const hanldeEditNote = (noteDetails) => {
    setOpenAddEditModal({
      isShow: true,
      type: "edit",
      data: noteDetails
    });
  };

  const deleteNote = async (noteDetails) => {
    const noteId = noteDetails._id;
    try {
      const response = await axiosInstance.delete(`server/note/delete/${noteId}`);

      if (response.data && !response.data.error) {
          showToastMessage("Note Deleted Successfully", 'delete');
          getAllNotes();
      }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("An error occurred while deleting note");
        }
    }
  }

  const onSearch = async (query) => {
    try {
      const response = await axiosInstance.get('server/note/search', {
        params: { query }
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  }

  const updatePinnedNote = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(`server/note/pinned/${noteId}`, {
        "isPinned": !noteData.isPinned
       });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {}
  }, []);

  

  return (
    <>

      <Header userInfo={userInfo} onSearch={onSearch} clearSearch={handleClearSearch} />

      <div className="container mx-auto">
        {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          
          {allNotes.map((note, idx) => (
            <NoteCard key={note._id} 
              title={note.title}
              date={moment(note.createdAt).format('DD MMM YYYY')}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => hanldeEditNote(note)}
              onDelete={() => deleteNote(note)}
              onPinNote={() => updatePinnedNote(note)}
            />
          ))}

          </div> : <EmptyCard imgSrc={isSearch ? noNotesImg : addNotesImg} message={isSearch ? `Oops! Np notes found matching your search :(` : `Start creating your first note! 
              Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!`}/>}
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
              onClick={() => {
                setOpenAddEditModal({
                  isShow: true,
                  type: "add",
                  data: null
                });
              }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=""
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll'
        appElement={document.getElementById('root')}
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({
              isShow: false,
              type: "add",
              data: null
            });
          }}
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