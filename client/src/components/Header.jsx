import React, { useState } from 'react'
import Profile from './Profile'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar';

const Header = ({ userInfo, onSearch, clearSearch }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearch(searchQuery);
    }
  }

  const onClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

        <SearchBar value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        <Profile userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Header