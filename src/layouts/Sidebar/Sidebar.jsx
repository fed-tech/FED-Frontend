import React, { useState } from 'react'; 
import styles from './styles/Sidebar.module.scss'
import { MdLogout } from "react-icons/md";
import { TbUserEdit } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { SiReacthookform } from "react-icons/si";

const Sidebar = () => {
  const [activepage, setactivepage] = useState("Event")
  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.profile}>
          <img src="https://uploads-ssl.webflow.com/66096a30ae498a9206aee6a0/66096ad2342643f874b4aad4_photo_2024-03-31_19-22-54.jpg" alt="Profile" className={styles.profilePhoto} />
          <div className={styles.profileInfo}>
            <p className={styles.name}>Name</p>
            <p className={styles.role}>Member</p>
          </div>
        </div>
        <div className={styles.menu}>
          <div onClick={()=>{setactivepage("Event")}} style={{color: activepage === "Event"?"#FF8A00" : "white"}}> <SlCalender size={17} /><span> Event </span></div>
          <div onClick={()=>{setactivepage("Form")}} style={{color: activepage === "Form"?"#FF8A00" : "white"}}> <SiReacthookform size={17} /> Form</div>
          <div onClick={()=>{setactivepage("Members")}} style={{color: activepage === "Members"?"#FF8A00" : "white"}}> <TbUserEdit size={17} /> Members</div>
          <div onClick={()=>{setactivepage("Logout")}} style={{color: activepage === "Logout"?"#FF8A00" : "white"}}> <MdLogout size={17} /> Logout</div>
        </div>
      </div>
      {/* <div className={styles.buttonContainer}>
        <button onClick={()=>{setactivepage("View Events")}} style={{color: activepage === "View Events"?"#FF8A00" : "white"}} className={`${styles.button} ${styles.viewEvents}`}>View Events</button>
        <button className={`${styles.button} ${styles.addEvent}`}>Add Event</button>
      </div> */}
      {/* <form className={styles.form}>
            <label>
                Event Name
                <input type="text" placeholder="Event Name" />
            </label>
            <label>
                Registration Type
                <select placeholder="Select Type">
                    <option value="Hello">Hello</option>
                </select>
            </label>
            <label>
                Event Poster
                <input type="url" placeholder="Poster Link" />
            </label>
            <label>
                Event Description
                <input type="textarea" placeholder="Event Name" />
            </label>
        </form> */}
    </>
  );
};

export default Sidebar;
