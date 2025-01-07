import React from 'react'
import { getInitials } from '../utils/errorHandler'

const Profile = ({ userInfo, onLogout }) => {  

  if (!userInfo) {
    return (
      <div></div> // Or some other loading state or fallback UI
    );
  }

  return (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
            {getInitials(userInfo?.name)}
        </div>
        <div className="">
            <p className='text-sm font-medium'>{userInfo.name}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default Profile