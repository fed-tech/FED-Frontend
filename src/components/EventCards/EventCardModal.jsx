import React,{useRef, useState,useEffect} from 'react'
import EventCardModal from './styles/EventCardModal.module.scss'
import { X } from 'lucide-react';




    const MyModal =({onClose})=>{

        const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from backend
    fetchData()
      .then((response) => setData(response))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const fetchData = async () => {
    // Replace this with actual fetch logic to your backend
    // For example:
    // const response = await fetch('your-backend-api-url');
    // const data = await response.json();
    // return data;
    return {
      // Sample data for demonstration
      eventName: "BIZZ-BATTLE",
      eventDescription:
        "BIZZ-BATTLE is an engaging business challenge event designed for aspiring business leaders. It consists of three rounds, each aimed at testing participant's knowledge, agility, and strategic acumen. The event begins with Round 1, a business quiz featuring questions to assess the depth of participant's knowledge. Teams that excel in this round move forward to Round 2, a thrilling treasure hunt where they must find answers to a set of riddles on campus. The most accurate teams then progress to the final round, Round 3, where they are presented with a real-world business scenario.",
      eventDate: "17th May",
      imageURL:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d12862ae94db7f4c1a27971143bd81d9a7fb60f50f4151f6f4b2ed8c1ee3eb23?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&width=800",
      eventType: "Paid"
      // Add more data fields as needed
    };
  };

        return(
            <div className={EventCardModal.card}>
            {data && (
            <>
            <div className={EventCardModal.backimg}>
                <img srcSet={data.imageURL} className={EventCardModal.img} />
                <div className={EventCardModal.date}>{data.eventDate}</div>
                <div className={EventCardModal.paid}>{data.eventType}</div>
            </div>
            <button className={EventCardModal.closeModal} onClick={onClose}><X/></button>
            <div className={EventCardModal.backbtn}>
                <div className={EventCardModal.eventname}>
                    <h3>{data.eventName}</h3>
                    <p>Team size: 2-4</p>
                </div>
                <div className={EventCardModal.registerbtn}>
                    <button className={EventCardModal.regbtn}>Register Now</button>
                </div>
            </div>
            <div className={EventCardModal.backtxt}>{data.eventDescription}
            </div>
            </>
            )}
        </div>
        )
    }


export default MyModal;
