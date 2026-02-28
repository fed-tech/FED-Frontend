import { Suspense, lazy, useContext, useEffect, useRef } from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

// layouts
import { Footer, Navbar, ProfileLayout } from "./layouts";

// microInteraction
import { Loading, Alert } from "./microInteraction";

// modals
import { EventModal } from "./features";

//blog
import FullBlog from "./pages/Blog/FullBlog";

// state
import AuthContext from "./context/AuthContext";
import EventStats from "./features/Modals/Event/EventStats/EventStats";

// Chatbot
import Chatbot from "./components/Chatbot/Chatbot";

// services
import { api } from "./services";

// Fox Mascot - DISABLED (react-three version incompatibility)
// import FoxMascot from "./components/FoxMascot";

import {
  EventsView,
  NewForm,
  ProfileView,
  BlogForm,
  ViewEvent,
  ViewMember,
  CertificatesView,
  CertificatesForm,
  CertificatesPreview,
  SendCertificate,
  VerifyCertificate,
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
const Blog = lazy(() => import("./pages/Blog/Blog"));
// const Omega = lazy(() => import("./pages/LiveEvents/Omega/Omega"));


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
const AttendancePage = lazy(() => import('./pages/AttendancePage/AttendancePage'));
const TeamManagement = lazy(() => import('./pages/TeamManagement/TeamManagement'));

const MainLayout = () => {
  const location = useLocation();
  const isomegaPage = location.pathname === "/omega";

  useEffect(() => {
    if (isomegaPage) {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "";
    }

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isomegaPage]);

  return (
    <div>
      <Navbar />
      <div className={`page ${isomegaPage ? 'omega-page' : ''}`}>
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

// [v2] Protected route wrapper — redirects to login with return URL
const ProtectedRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();

  if (!authCtx.isLoggedIn) {
    // Store full URL (path + search params) so login can redirect back
    sessionStorage.setItem("prevPage", location.pathname + location.search);
    Alert({
      type: "info",
      message: "Please log in first to access this page.",
      position: "bottom-right",
      duration: 3000,
    });
    return <Navigate to="/Login" replace />;
  }

  return children;
};

// [v2] Redirect after login — uses prevPage from sessionStorage if available
const LoginRedirect = () => {
  const redirectTo = sessionStorage.getItem("prevPage") || "/profile";
  sessionStorage.removeItem("prevPage");
  return <Navigate to={redirectTo} replace />;
};

function App() {
  const authCtx = useContext(AuthContext);
  console.log(authCtx.user.access);

  // [v2] Check for unseen join request updates globally on login
  const hasCheckedUpdates = useRef(false);
  useEffect(() => {
    if (!authCtx.isLoggedIn || hasCheckedUpdates.current) return;
    hasCheckedUpdates.current = true;

    const checkGlobalUpdates = async () => {
      try {
        const response = await api.get("/api/form/allJoinRequestUpdates");
        const updates = response.data?.data?.updates;
        if (!updates || updates.length === 0) return;

        // Small delay so the page renders first
        setTimeout(() => {
          for (const update of updates) {
            const teamLabel = update.teamName ? `"${update.teamName}"` : "a team";
            switch (update.status) {
              case "ACCEPTED":
                Alert({
                  type: "success",
                  message: `🎉 Your request to join ${teamLabel} was accepted!`,
                  position: "top-right",
                  duration: 5000,
                });
                break;
              case "REJECTED":
                Alert({
                  type: "error",
                  message: `Your request to join ${teamLabel} was declined by the team leader.`,
                  position: "top-right",
                  duration: 6000,
                });
                break;
              case "AUTO_EXPIRED":
              case "EXPIRED":
                Alert({
                  type: "info",
                  message: `Your request to join ${teamLabel} has expired.`,
                  position: "top-right",
                  duration: 4000,
                });
                break;
              default:
                break;
            }
          }
        }, 1500);
      } catch (err) {
        // Silent — don't break app startup
        console.error("Error checking global join request updates:", err);
      }
    };

    checkGlobalUpdates();
  }, [authCtx.isLoggedIn]);

  return (
    <div>
      {/* Global Chatbot Component */}
      <Chatbot />

      {/* Fox Mascot Animation - DISABLED */}
      {/* <FoxMascot /> */}

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Events" element={<Event />} />
            <Route path="/Events/pastEvents" element={<PastEvent />} />
            <Route path="/Social" element={<Social />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/Blog" element={<Blog />} />
            {/* Disabled full blog page - redirecting to Medium instead */}
            {/* <Route path="/Blog/:id" element={<FullBlog />} /> */}
            <Route path="/Alumni" element={<Alumni />} />
            <Route path="/verify/certificate" element={<VerifyCertificate />} />
            {/* <Route path="/Omega" element={<Omega />} /> */}
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

                {/* blog access to this mail*/}

                {(authCtx.user.access === "ADMIN" ||
                  authCtx.user.access === "SENIOR_EXECUTIVE_CREATIVE") && (
                    <Route path="BlogForm" element={<BlogForm />} />
                  )}
                {/* Certificates Route */}

                {authCtx.user.access === "ADMIN" && (
                  <Route path="certificates" element={<CertificatesView />} />
                )}

                {authCtx.user.access === "ADMIN" && (
                  <Route
                    path="events/SendCertificate/:eventId"
                    element={<SendCertificate />}
                  />
                )}

                {authCtx.user.access === "ADMIN" && (
                  <Route
                    path="events/createCertificates/:eventId"
                    element={<CertificatesForm />}
                  />
                )}

                {authCtx.user.access === "ADMIN" && (
                  <Route
                    path="events/viewCertificates/:eventId"
                    element={<CertificatesPreview />}
                  />
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
                  authCtx.user.email == "attendance@fedkiit.com" && (
                    <Route
                      path="events/Analytics/:eventId"
                      element={[<EventStats onClosePath="/profile/events" />]}
                    />
                  )}
                <Route path="/profile/attendance" element={<AttendancePage />} />
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
              path="/Events/:eventId/Form"
              element={
                <ProtectedRoute>
                  <Event />
                  <EventForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Events/:eventId/team"
              element={
                <ProtectedRoute>
                  <TeamManagement />
                </ProtectedRoute>
              }
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
                authCtx.isLoggedIn ? <LoginRedirect /> : <Login />
              }
            />
            <Route
              path="/SignUp"
              element={
                authCtx.isLoggedIn ? <LoginRedirect /> : <Signup />
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
