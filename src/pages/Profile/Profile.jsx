import { useState, useContext, useEffect } from "react";
import { ProfileLayout, ProfileTopbar, Sidebar } from "../../layouts";
import AuthContext from "../../context/AuthContext";
import { api } from "../../services";
import style from "./styles/Profile.module.scss";
import { Loading } from "../../microInteraction";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const [activePage, setActivePage] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (authCtx.isLoggedIn && window.localStorage.getItem("token")) {
      fetchData();
    }
  }, [authCtx.isLoggedIn]);

  const fetchData = async () => {
    try {
      const data = {
        email: authCtx.user.email,
      };

      const token = window.localStorage.getItem("token");
      if (token) {
        const response = await api.post("/api/user/fetchProfile", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          authCtx.update(
            response.data.user.name,
            response.data.user.email,
            response.data.user.img,
            response.data.user.rollNumber,
            response.data.user.school,
            response.data.user.college,
            response.data.user.contactNo,
            response.data.user.year,
            response.data.user.extra?.github,
            response.data.user.extra?.linkedin,
            response.data.user.extra?.designation,
            response.data.user.access,
            response.data.user.editProfileCount,
            response.data.user.regForm
          );
        }
        else if(response.status === 404) {
          // log out the user
        }
        else {
          // console.log(response.status);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileLayout>
      <div className={style.profileShell}>
        <ProfileTopbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          showSidebarToggle
        />
        <div className={style.profile}>
          <Sidebar
            activepage={activePage}
            isMobileOpen={isSidebarOpen}
            closeMobileSidebar={() => setIsSidebarOpen(false)}
            handleChange={(page) => {
              setActivePage(page);
              authCtx.eventData = null;
            }}
          />
          {isSidebarOpen && (
            <button
              type="button"
              className={style.sidebarBackdrop}
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            />
          )}
          {isLoading ? (
            <Loading />
          ) : (
            <div className={style.profile__content}>
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
