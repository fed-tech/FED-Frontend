import { useState } from "react";

import Layout from "../../../layouts/Profile/ProfileLayout/ProfileLayout";
import Sidebar from "../../../layouts/Profile/Sidebar/Sidebar";

import NewForm from "../../../components/Profile/Admin/Form/NewForm/NewForm";
import ViewMember from "../../../components/Profile/Admin/View/ViewMember/ViewMember";
import ViewEvent from "../../../components/Profile/Admin/View/ViewEvent/VIewEvent";

import style from "./styles/Admin.module.scss";

const Profile = () => {
  
  const [activePage, setactivePage] = useState("Event");

  const getActivePage = () => {
    switch (activePage) {
      case "Event":
        return (
          <>
            <ViewEvent />
          </>
        );

      case "Form":
        return (
          <>
            <NewForm />
          </>
        );

      case "Members":
        return (
          <>
            <ViewMember />
          </>
        );

      default:
        break;
    }
  };

  return (
    <Layout>
      <div className={style.profile}>
        <Sidebar
          activepage={activePage}
          handleChange={(page) => setactivePage(page)}
        />
        <div className={style.profile__content}>{getActivePage()}</div>
      </div>
    </Layout>
  );
};

export default Profile;
