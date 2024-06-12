import { useState, useEffect } from "react";
import styles from "./styles/EventCards.module.scss";

function EventCards() {
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
      eventDate: "17th Mar",
      imageURL:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d12862ae94db7f4c1a27971143bd81d9a7fb60f50f4151f6f4b2ed8c1ee3eb23?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&width=800",
      // Add more data fields as needed
    };
  };

  const handleButtonClick = () => {
    // Button click functionality
    // For example:
    console.log("Button clicked!");
  };

  return (
    <div className={styles.box}>
      {data && (
        <>
          <div className={styles.div}>
            <div className={styles.divWithImage}>
              <img loading="lazy" srcSet={data.imageURL} className={styles.img} />
              <div className={styles.divContent}>
                <div className={styles.eventDate}>{data.eventDate}</div>
                <div className={styles.eventShare}>
                  <div className={styles.shareText}>Share</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a18cf7ff6e78a19a541ec23bf304120817a37160b9af49d3e675489fe181da8?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&"
                    className={styles.shareIcon}
                  />
                </div>
              </div>
              <div className={styles.eventType}>Free</div>
              </ div>
          </div>
          <div className={styles.eventDetails}>
            <div className={styles.eventName}>{data.eventName}</div>
            <div className={styles.eventDescription}>{data.eventDescription}</div>
            <button className={styles.registerButton} onClick={handleButtonClick}>
              Register Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EventCards;
