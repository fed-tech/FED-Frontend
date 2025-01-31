import { Suspense, lazy, useContext, useEffect } from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

// layouts
import { Footer, Navbar, ProfileLayout } from "./layouts";

// microInteraction
import { Loading } from "./microInteraction";

// modals
import { EventModal } from "./features";

// state
import AuthContext from "./context/AuthContext";
import EventStats from "./features/Modals/Event/EventStats/EventStats";
import {
  EventsView,
  NewForm,
  ProfileView,
  ViewEvent,
  ViewMember,
  CertificatesView,
  CertificatesForm,
  CertificatesPreview,
  SendCertificates,
} from "./sections";


// Lazy loading pages
const Home = lazy(() => import("./pages/Home/Home"));
const Event = lazy(() => import("./pages/Event/Event"));
const PastEvent = lazy(() => import("./pages/Event/PastEvent"));
const EventForm = lazy(() => import("./pages/Event/EventForm"));
const Social = lazy(() => import("./pages/Social/Social"));
const Team = lazy(() => import("./pages/Team/Team"));
const Alumni = lazy(() => import("./pages/Alumni/Alumni"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
// const Omega = lazy(() => import("./pages/Omega/Omega"));
// const Gsoc = lazy(() => import("./pages/LiveEvents/Gsoc/Gsoc"));

const Signup = lazy(() => import("./pages/Authentication/Signup/Signup"));
const ForgotPassword = lazy(() =>
  import("./authentication/Login/ForgotPassword/SendOtp")
);
const CompleteProfile = lazy(() =>
  import("./authentication/SignUp/CompleteProfile")
);

const Error = lazy(() => import("./pages/Error/Error"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/T&C"));
const Login = lazy(() => import("./pages/Authentication/Login/Login"));

const OTPInput = lazy(() =>
  import("./authentication/Login/ForgotPassword/OTPInput")
);

const MainLayout = () => {
  const location = useLocation();
  // const isGsocPage = /\/gsoc|\/GSOC|\/GSoC|\/gsoc/i.test(location.pathname);

  // useEffect(() => {
  //   if (isGsocPage) {
  //     document.body.style.backgroundColor = "black";
  //   } else {
  //     document.body.style.backgroundColor = "";
  //   }

  //   return () => {
  //     document.body.style.backgroundColor = "";
  //   };
  // }, [isGsocPage]);

  return (
    <div>
      <Navbar />
      <div className="page">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const AuthLayout = () => (
  <div className="authpage">
    <Outlet />
  </div>
);

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Events" element={<Event />} />
            <Route path="/Events/pastEvents" element={<PastEvent />} />
            <Route path="/Social" element={<Social />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/Alumni" element={<Alumni />} />
            {/* <Route path="/Omega" element={<Omega />} /> */}
            {/* <Route path="/Gsoc" element={<Gsoc />} /> */}
            {/* Route After Login */}
            {authCtx.isLoggedIn && (
              <Route path="/profile" element={<Profile />}>
                <Route
                  path=""
                  element={<ProfileView editmodal="/profile/" />}
                />
                {authCtx.user.access === "ADMIN" ? (
                  <Route path="events" element={<ViewEvent />} />
                  
                ) : (
                  <>
                  <Route path="events" element={<EventsView />} />
                  <Route path="certificates" element={<CertificatesView />} />
                  </>
                )}
                <Route path="Form" element={<NewForm />} />
               
                {authCtx.user.access === "ADMIN" && (
                  <Route path="members" element={<ViewMember />} />
                )}
                {/* Certificates Route */}

                {authCtx.user.access === "ADMIN" && (
                  <Route path="certificates" element={<CertificatesView />} />
                )}

                {authCtx.user.access === "ADMIN" && (
                    <Route path="events/SendCertificates/:eventId" element={<SendCertificates />} />
                 )}

                {authCtx.user.access === "ADMIN" && (
                  <Route path="events/createCertificates/:eventId" element={<CertificatesForm />} />
                )}

                {authCtx.user.access === "ADMIN" && (
                  <Route path="events/viewCertificates/:eventId" element={<CertificatesPreview />} />
                )}
           
                <Route
                  path="events/:eventId"
                  element={[<EventModal onClosePath="/profile/events" />]}
                />
                {authCtx.user.access !== "USER" && (
                  <Route
                    path="events/Analytics/:eventId"
                    element={[<EventStats onClosePath="/profile/events" />]}
                  />
                )}
                {authCtx.user.access === "USER" &&
                  authCtx.user.email == "srex@fedkiit.com" && (
                    <Route
                      path="events/Analytics/:eventId"
                      element={[<EventStats onClosePath="/profile/events" />]}
                    />
                  )}

              </Route>
            )}
            <Route
              path="/Events/:eventId"
              element={[<Event />, <EventModal onClosePath="/Events" />]}
            />
            <Route
              path="/Events/pastEvents/:eventId"
              element={[<Event />, <EventModal onClosePath="/Events" />]}
            />
            <Route
              path="pastEvents/:eventId"
              element={[
                <PastEvent />,
                <EventModal onClosePath="/Events/pastEvents" />,
              ]}
            />


            <Route
              path="/Events/:eventId/"
              element={[<Event />, <EventForm />]}
            />

            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route
              path="/TermsAndConditions"
              element={<TermsAndConditions />}
            />
            <Route path="*" element={<Error />} />
          </Route>

          {/* Routes for Authentication witout Navbar and footer */}
          <Route element={<AuthLayout />}>
            {!authCtx.isLoggedIn && (
              <Route path="/profile/*" element={<Navigate to="/Login" />} />
            )}
            <Route
              path="/Login"
              element={
                authCtx.isLoggedIn ? <Navigate to="/profile" /> : <Login />
              }
            />
            <Route
              path="/SignUp"
              element={
                authCtx.isLoggedIn ? <Navigate to="/profile" /> : <Signup />
              }
            />
            <Route
              path="/completeProfile"
              element={
                authCtx.isLoggedIn ? (
                  <Navigate to="/profile" />
                ) : (
                  <CompleteProfile />
                )
              }
            />

            <Route
              path="/ForgotPassword"
              element={
                authCtx.isLoggedIn ? (
                  <Navigate to="/profile" />
                ) : (
                  <ForgotPassword />
                )
              }
            />
            <Route
              path="/otp"
              element={
                authCtx.isLoggedIn ? <Navigate to="/profile" /> : <OTPInput />
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
