import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import FormData from "../../data/FormData.json"
import PreviewEvent from '../../features/Modals/Profile/Admin/PreviewEvent/PreviewEvent'
import { useState } from 'react';


const EventForm = () => {
  console.log(FormData);
  const[showPreview,setshowPreview]=useState(true)

  const { eventId } = useParams();
  const {events}=FormData;
  const data = events.find((event) => event.id === eventId);
  console.log(eventId);
  return (
    <div>

{showPreview &&
      
        <PreviewEvent
          open={showPreview}
          handleClose={() => setshowPreview(false)}
          sections={data.sections}
          data={data.info}
          showCloseBtn={true}
        />
}
    </div>
  )
}

export default EventForm