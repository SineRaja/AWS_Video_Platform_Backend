import React, { useState } from 'react'
import './NavBar.css';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

// import { useDispatch } from 'react-redux';

import axios from 'axios';
import UploadVideo from './UploadVideo';
import { resetUser } from '../redux/userSlice';

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #ffffff;
`;


const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const NavBar = () => {

  const navigate = useNavigate();
  const dispatch  = useDispatch();
  // const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch(resetUser())
      navigate('/singin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='navbar-container'>
      <div className='navbar-content'>
        <div className='navbar-search'>
          <input className='input-style'
            type='search' placeholder='search'
            onChange={(e) => setQ(e.target.value)}
          /><SearchIcon onClick={() => navigate(`/search?q=${q}`)} />

        </div>

        {currentUser ? (
             <User>
             <div  style={{display:'flex', flexDirection:'row',alignItems:'center',justifyContent:'space-between', color:'#3ca0e7'}}>
             <VideoCallOutlinedIcon 
                onClick={() => setOpenModal(true)}
               style={{ height: '45px', marginRight: '20px', color:'#3ca0e7' }} />
               <Avatar src={currentUser.img}  style={{ marginLeft:'20px', marginRight:'10px', cursor:'pointer'}} onClick={toggleDropdown} />
               {currentUser.name}
             </div>
             {isDropdownOpen && (
               <div className="logout-dropdown">
                 <button className='logout-dropdown-button' onClick={handleLogout}>Logout</button>
               </div>
             )}
           </User>
          
        ) : 
        
        (
          
          <Link to="singin" style={{ textDecoration: "none" }}>
            <button className='button-style'>   <AccountCircleIcon />  Sign In</button>
          </Link>
        )}
        {openModal && <UploadVideo setOpenModal={setOpenModal} />}
      </div>
    </div>
  )
}

export default NavBar
