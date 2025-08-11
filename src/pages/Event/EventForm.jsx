import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormData from "../../data/FormData.json";
import PreviewForm from "../../features/Modals/Profile/Admin/PreviewForm";
import { api } from "../../services";
import { Alert } from "../../microInteraction";

const EventForm = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { eventId } = useParams();

  // Ensure eventId is correctly parsed
  const id = eventId;
  // console.log("event id in eventForm is :",id);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/api/form/getAllForms?id=${eventId}`);
        // console.log("registerForm",response.data)
        if (response.status === 200) {
          setEventData(response.data.events);
          
        } else {
          setAlert({
            type: "error",
            message: "There was an error fetching event form. Please try again.",
            position: "bottom-right",
            duration: 3000,
          });
          throw new Error(response.data.message || "Error fetching event");
        }
      } catch (error) {
        console.error("Error fetching event:", error);

        // const { events } = FormData;
        // const localEventData = events.find((event) => event.id === id);
        // setEventData(localEventData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);
  // console.log("eventData",eventData);

  // Add scroll lock effect when form opens
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreview]);

  return (
    <div>
      {!isLoading && showPreview && (
        <PreviewForm
          open={showPreview}
          handleClose={() => setShowPreview(false)}
          eventId = {eventData?.id}
          sections={eventData?.sections || []}
          eventData={eventData?.info || {}}
          form={eventData || {}}
          showCloseBtn={true}
        />
      )}
      <Alert />
    </div>
  );
};

export default EventForm;
