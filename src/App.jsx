
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// layouts
import Navbar from "./layouts/Navbar/Navbar";
import MobileNavbar from "./layouts/MobileNavbar/MobileNavbar";
import Footer from "./layouts/Footer/Footer";

// pages
const Home = lazy(() => import("./pages/Home/Home"));
const Event = lazy(() => import("./pages/Event/Event"));
const Social = lazy(() => import("./pages/Social/Social"));
const Team = lazy(() => import("./pages/Team/Team"));
const Login = lazy(() => import("./pages/Authentication/Login/Login"));
const SignUp = lazy(() => import("./pages/Authentication/SignUp/SignUp"));
const Error = lazy(() => import("./pages/Error/Error"));

// microInteraction
import Loading from "./microInteraction/Load/Load";


// import { Alert } from "./MicroInteraction/Alert";

// // state
// import AuthContext from "./context/auth-context";

// // axios
// import axios from "axios";


function App() {
  return (
    <>
      
      <Navbar />
      <MobileNavbar />
      <div className="page">
       
          <Suspense fallback={<Loading />}>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Event" element={<Event />} />
              <Route path="/Social" element={<Social />} />
              <Route path="/Team" element={<Team />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="*" element={<Error />} />
            </Routes>

          </Suspense>
          
      </div>
      <Footer />

     
    </>
  );
}

export default App;
