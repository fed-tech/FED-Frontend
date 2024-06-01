
import Carousel from "../../components/Carousel/styles/Carousel"
import { CarouselImg } from "../../data/carouselImages";
import Sponsered from "../../components/Sponser/Sponsered";
import HeroSection from "../../components/Hero/HeroSection";
import Feedback from "../../components/Feedback/Feedback" ;
import Contact from "../../components/Contact/Contact";
import EventPopup from "../../components/EventPopup/EventPopup"
export default function Home() {
  return (
    <div>

     {/* <Carousel images={CarouselImg} />
     <Sponsered /> */}
     <EventPopup/>
      <HeroSection />
      <Sponsered />
      <Contact/>
      <Feedback/>
      

    </div>
  )
}
