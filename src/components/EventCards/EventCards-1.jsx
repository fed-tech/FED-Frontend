import React,{useState,useEffect} from 'react'
import EventCard from './styles/EventCards-1.module.scss'
import Modal from './EventCardModal2'
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function EventCardspast(props){
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
        "BIZZ-BATTLE is an engaging business challenge event designed for aspiring business leaders.",
      eventDate: "17th May",
      imageURL:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d12862ae94db7f4c1a27971143bd81d9a7fb60f50f4151f6f4b2ed8c1ee3eb23?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&width=800",
      eventType: "Paid",
      // Add more data fields as needed
    };
  };
    const [showModal, setShowModal] = useState(false)

    useEffect(()=>{
        AOS.init({duration:2000});
    },[]);


    return(
        <div className={EventCard.card} data-aos="fade-up">
        {data && (
            <>
            
                <div className={EventCard.backimg}>
                    <img srcSet={data.imageURL} className={EventCard.img} />
                    <div className={EventCard.date}>{data.eventDate}</div>
                    <div className={EventCard.paid}>{data.eventType}</div>
                </div>
                <div className={EventCard.backtxt}>{data.eventDescription} <span onClick={()=> setShowModal(true)}>See More...</span></div>
                {showModal && <Modal onClose={()=> setShowModal(false)}/>}
        
            </>
        )}
        </div>

    )
}
