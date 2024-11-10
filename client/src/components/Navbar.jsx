
import React, { useState } from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar';
import axios from 'axios';

const Navbar = ({userInfo}) => {

  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();

  const onLogout = async () => {
    try {

      await axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true });
      navigate("/login");

    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleSearch = ()=>{

  }

  const onClearSearch = ()=>{
    setSearchQuery("")
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow ' >
      <h2 className='text-xl font-semibold text-black py-2 select-none' >Notes</h2>

      {userInfo? <SearchBar value={searchQuery}
      onChange={({target})=>{setSearchQuery(target.value)}}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      /> : <p></p>}

     {userInfo? <ProfileInfo userInfo={userInfo} onLogout={onLogout} />: <p></p>}
    </div>
  )
}

export default Navbar
