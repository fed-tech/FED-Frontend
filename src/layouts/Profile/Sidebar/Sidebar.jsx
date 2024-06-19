import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { MdLogout } from 'react-icons/md';
import { TbUserEdit } from 'react-icons/tb';
import { SlCalender } from 'react-icons/sl';
import { SiReacthookform } from 'react-icons/si';
import AuthContext from '../../../store/AuthContext';
import styles from './styles/Sidebar.module.scss';
import defaultImg from '../../../assets/images/defaultImg.jpg';
import { useState } from 'react';
import { useEffect } from 'react';

const Sidebar = ({ activepage, handleChange }) => {
  const[designation,setDesignation]=useState("");
  
  const authCtx = useContext(AuthContext);

  useEffect(()=>{
    window.scrollTo(0,0);
    if (authCtx.user.access == 0) {
      setDesignation("Admin");
    } else if (authCtx.user.access == 1) {
      setDesignation("User");
    } else if (authCtx.user.access == 7) {
      setDesignation("Alumni");
    } else {
      setDesignation("Member");
    }
  },[]);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log(authCtx);
    navigate('/Login');
    authCtx.logout(); 
    console.log(authCtx); 

  
  };

  const handleName = () => {
    const maxLength = 15;
    let name = authCtx.user.name;
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <a href='/profile'>
        <img
          src={authCtx.user.pic || defaultImg}
          alt="Profile"
          className={styles.profilePhoto}
        />
        </a>
        <div className={styles.profileInfo}>
          <p className={styles.name}>{authCtx.user.name}</p>
          <p className={styles.role}>{designation}</p>
        </div>
      </div>
      <div className={styles.menu}>

      {designation === "Admin" ? (
        <>
        <div
          onClick={() => {
            handleChange('Event');
          }}
          style={{ color: activepage === 'Event' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <SlCalender size={17} />
          <span> Event </span>
        </div>
        <div
          onClick={() => {
            handleChange('Form');
          }}
          style={{ color: activepage === 'Form' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <SiReacthookform size={17} /> Form
        </div>
        <div
          onClick={() => {
            handleChange('Members');
          }}
          style={{ color: activepage === 'Members' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <TbUserEdit size={17} /> Members
        </div>
        </>
      ):(<></>)}
    {designation === "Member" ? (
        <>
        <div
          onClick={() => {
            handleChange('Event');
          }}
          style={{ color: activepage === 'Event' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <SlCalender size={17} />
          <span> Event </span>
        </div>
         </>
      ):(<></>)}
    {designation === "User" ? (
        <>
        <div
          onClick={() => {
            handleChange('Event');
          }}
          style={{ color: activepage === 'Event' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <SlCalender size={17} />
          <span> Event </span>
        </div>
         </>
      ):(<></>)}
    {designation === "Alumni" ? (
        <>
        <div
          onClick={() => {
            handleChange('Event');
          }}
          style={{ color: activepage === 'Event' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <SlCalender size={17} />
          <span> Event </span>
        </div>
         </>
      ):(<></>)}
        <div
          onClick={handleLogout}
          style={{ color: activepage === 'Logout' ? '#FF8A00' : 'white' }}
        >
          {' '}
          <MdLogout size={17} /> Logout
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export default Sidebar;
