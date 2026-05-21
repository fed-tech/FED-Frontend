/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services";
import { Alert, ComponentLoading } from "../../microInteraction";
import PreviewForm from "../../features/Modals/Profile/Admin/PreviewForm";
import { MdArrowBackIos } from "react-icons/md";
import style from "./styles/EventRegisterPage.module.scss";

const EventRegisterPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { eventId } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (alert) {
            const { type, message, position, duration } = alert;
            Alert({ type, message, position, duration });
            setAlert(null);
        }
    }, [alert]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/api/form/getAllForms?id=${eventId}`);
                if (response.status === 200) {
                    setEventData(response.data.events);
                } else {
                    setAlert({
                        type: "error",
                        message: "There was an error fetching event form. Please try again.",
                        position: "bottom-right",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error("Error fetching event form:", error);
                setAlert({
                    type: "error",
                    message: "There was an error fetching event form. Please try again.",
                    position: "bottom-right",
                    duration: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleClose = () => {
        navigate(`/Events/${eventId}/details`);
    };

    return (
        <div className={style.page}>
            {/* Back Button */}
            <button className={style.backBtn} onClick={handleClose}>
                <MdArrowBackIos size={16} />
                Back to Event
            </button>

            {isLoading ? (
                <ComponentLoading
                    customStyles={{
                        width: "100%",
                        height: "60vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                />
            ) : eventData ? (
                <div className={style.formWrapper}>
                    <PreviewForm
                        open={true}
                        inline={true}
                        handleClose={handleClose}
                        eventId={eventData?.id}
                        sections={eventData?.sections || []}
                        eventData={eventData?.info || {}}
                        form={eventData || {}}
                        showCloseBtn={false}
                    />
                </div>
            ) : (
                <div className={style.error}>Event form not found.</div>
            )}

            <Alert />
        </div>
    );
};

export default EventRegisterPage;


