import React, { useState, useEffect } from 'react';
import { Hero, About, Sponser, Feedback, Contact } from "../../components";
import LiveEventPopup from "../../features/Modals/Event/LiveEventPopup/LiveEventPopup";

function Home() {
  

  return (
    <>
      <LiveEventPopup />
      <Hero />
      <About />
      <Sponser />
      <Contact />
      <Feedback />
    </>
  );
}

export default Home;
