import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StartupCard from "../../components/MSCard/MSCard";
import data from "../../data/MSCarddata.json";
import './Style/MicroStartup.module.scss'
import style from "./Style/Header.module.scss";
import { ComponentLoading } from "../../microInteraction";



export default function StartupPage() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    setStartups(data);
  }, []);

   return (
   

      <div className="name">
                      <div className={style.name}>
                        <span className={style.w2}>Introducing FED - </span>
                        <span className={style.w1}>MicroStartups</span>
       </div>
        <div className="fed-main-container">
    <section className="fed-card-grid"> <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "1200px", margin: "0 auto"}}>
      {data.map(card => (
        <StartupCard key={card.id} {...card} />
      ))}
    </div>
        {startups.map((startup) => (
          <StartupCard
          
            key={startup.id}
            brandName={startup.brandName}
            description={startup.description}
            logo={startup.logo}
          />
        ))}
      </section>
      </div>
    </div>
  );
}

