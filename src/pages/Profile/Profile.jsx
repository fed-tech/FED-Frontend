import { useState, useContext, useEffect } from "react";

import { ProfileLayout, Sidebar } from "../../layouts";
import {
  ProfileView,
  EventsView,
  NewForm,
  ViewMember,
  ViewEvent,
} from "../../sections";

import AuthContext from "../../context/AuthContext";

import style from "./styles/Profile.module.scss";

const Profile = () => {
  const [activePage, setActivePage] = useState("Profile");
  const authCtx = useContext(AuthContext);
  const [designation, setDesignation] = useState("Admin");

  useEffect(() => {
    const access = authCtx.user.access;
    if (access === "ADMIN") {
      setDesignation("Admin");
    } else if (access === "ALUMNI") {
      setDesignation("Alumni");
    } else if (access === "USER") {
      setDesignation("User");
    } else {
      setDesignation("Member");
    }
  }, [authCtx.user.access]);

  const getActivePage = () => {
    if (designation === "Admin") {
      console.log(activePage);
      switch (activePage) {
        
        case "Event":
          return <ViewEvent handleChangePage={(page) => setActivePage(page)} />;
        case "Form":
          return <NewForm />;
        case "Members":
          return <ViewMember />;
        default:
          return <ProfileView editmodal="/profile/" />;
      }
    } else {
      switch (activePage) {
        case "Event":
          return <EventsView />;
        default:
          return <ProfileView editmodal="/profile/" />;
      }
    }
  };

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <Sidebar activepage={activePage} handleChange={setActivePage} />
        <div className={style.profile__content}>{getActivePage()}</div>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
