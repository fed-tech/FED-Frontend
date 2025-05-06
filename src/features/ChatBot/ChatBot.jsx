import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/ChatBot.module.scss";
import { BsSend, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoCloseOutline, IoCopyOutline } from "react-icons/io5";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { apiBot } from "../../services";
import { Alert } from "../../microInteraction";

export default function ChatBot() {
  const name = "FedRick";
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [initialMsg, setInitialMsg] = useState(
    `Hello! I am ${name}, your personal assistant for FED. How can I help you today?`
  );
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEventOngoing, setIsEventOngoing] = useState(true);
  const chatboxRef = useRef(null);
  const location = useLocation();
  const isGsoc = location.pathname.includes("/Gsoc");
  const [alert, setAlert] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());
  const speechRecognitionDelay = 2000;

  //Setting Alerts
  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  // Setting the chatbot Connection with server
  useEffect(() => {
    const fetchInitialMessage = async () => {
      setTimeout(async () => {
        try {
          const response = await apiBot.post("/chat", {
            input: "Connection Request",
          });

          if (response.status === 200 || response.status === 201) {
            // console.log(
            //   "Successfully connected to chatbot",
            //   response.data.message
            // );
          } else {
            // console.log("Error:", response.data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
        setIsThinking(false);
        scrollToBottom();
      }, 1500);
    };

    fetchInitialMessage();
  }, []);

  // Typing effect for bot messages
  const typeMessage = async (message) => {
    let typedMessage = "";
    setIsTyping(true); // Start typing
    for (let i = 0; i < message.length; i++) {
      typedMessage += message[i];
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { bot: typedMessage, isTyping: true },
      ]);
      scrollToBottom();
      await new Promise((resolve) => setTimeout(resolve, 20));
      setIsThinking(false);
    }
    setIsTyping(false); // Typing completed
    setMessages((prevMessages) => [
      ...prevMessages.slice(0, -1),
      { bot: typedMessage, isTyping: false }, // Mark the message as fully typed
    ]);
    scrollToBottom();

    if (isSpeaking) {
      speakMessage(typedMessage);
    }
  };

  // Sending user message to the server
  const sendMessage = async () => {
    if (!userInput) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMessage = { user: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");

    setTimeout(() => {
      setIsThinking(true);
    }, 600);

    setTimeout(async () => {
      try {
        const response = await apiBot.post("/chat", { input: userInput });

        if (response.status === 200 || response.status === 201) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { bot: "", isTyping: true },
          ]);
          await typeMessage(response.data.response);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { bot: "Error: Unable to connect to the server.", isTyping: false },
          ]);
          // console.log("Error:", response.data.message);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { bot: "Error: Unable to connect to the server.", isTyping: false },
        ]);
        console.error("Error:", error);
      }

      scrollToBottom();
    }, 4000); // Total delay considering thinking and typing phases
  };

  // Handle Enter key press
  const onHandleKey = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isEventOngoing) {
      if (isVisible) {
        document.body.classList.add(styles.lockScroll);
      } else {
        document.body.classList.remove(styles.lockScroll);
      }
    }

    return () => {
      document.body.classList.remove(styles.lockScroll);
    };
  }, [isVisible, isEventOngoing]);

  const closePopup = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClick = () => {
    setIsActive(!isActive);
    setIsVisible(!isVisible);
  };

  const botToggle = isActive ? styles.hidden : "";
  const chatBotOpen = isActive ? "" : styles.hidden;

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setAlert({
          type: "success",
          message: "Copied to clipboard!",
          position: "bottom-left",
          duration: 2000,
        });
      })
      .catch((err) => {
        setAlert({
          type: "error",
          message: "Failed to copy to clipboard!",
          position: "bottom-left",
          duration: 2000,
        });
      });
  };

  // Speak message
  const speakMessage = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop current speech
      setIsSpeaking(false); // Toggle to non-speaking state
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false); // Reset speaking state after speech ends
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true); // Set to speaking state
    }
  };

  // Speech recognition
  useEffect(() => {
    // console.log("Speech recognition effect");
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setLastSpeechTime(Date.now()); // Reset the timer when a result is received
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsRecording(false);
      };
      setSpeechRecognition(recognition);
    } else {
      console.warn("Speech recognition not supported");
    }
  }, [isRecording]);

  // Handle Mic Button Click
  const startRecording = () => {
    if (speechRecognition) {
      speechRecognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
      setIsRecording(false);
    }
  };

  // Auto Send msges after a delay
  useEffect(() => {
    const handleSendMessage = () => {
      if (Date.now() - lastSpeechTime >= speechRecognitionDelay) {
        sendMessage();
      }
    };

    const timer = setTimeout(handleSendMessage, speechRecognitionDelay);
    setIsRecording(false);
    return () => clearTimeout(timer);
  }, [lastSpeechTime]);

  return (
    <>
      <button
        className={`${styles.chatbottoggle} ${botToggle} ${
          isGsoc ? styles.gsocBackGround : ""
        }`}
        onClick={handleClick}
      >
        <span>
          <BiSolidMessageSquareDetail size={42} />
        </span>
      </button>

      <div className={`${styles.popup} ${isVisible ? styles.fadeIn : ""}`}>
        <div className={`${styles.chatcontainer} ${chatBotOpen}`}>
          <header>
            <div className={styles.logo}>
              <img
                src="https://uploads-ssl.webflow.com/629d87f593841156e4e0d9a4/62eeaa9927e6aea4ff13590e_FedLogo.png"
                alt="logo"
              />
              <h2 className={styles.fed}>{name}</h2>
            </div>
            <span
              className={`${styles.close} ${styles.chatBotClose} ${
                isGsoc ? styles.gsocBackGround : ""
              }`}
              onClick={handleClick}
            >
              <IoCloseOutline />
            </span>
          </header>
          <hr />
          <div className={styles.chatbox} ref={chatboxRef}>
            <div className={styles.messageBox}>
              <div
                className={`${styles.botmessage}`}
              >
                {initialMsg}
              </div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.user
                      ? styles.usermessage
                      : `${styles.botmessage}`
                  }
                >
                  {message.user || message.bot}
                  {!message.user &&
                    !message.isTyping && ( // Show icons only for fully typed bot messages
                      <div className={styles.messageActions}>
                        <button onClick={() => copyToClipboard(message.bot)}>
                          <IoCopyOutline size={18} style={{ color: "white" }} />
                        </button>
                        <button onClick={() => speakMessage(message.bot)}>
                          {isSpeaking ? (
                            <FaVolumeMute
                              size={18}
                              style={{ color: "white" }}
                            />
                          ) : (
                            <FaVolumeUp size={18} style={{ color: "white" }} />
                          )}
                        </button>
                      </div>
                    )}
                </div>
              ))}

              <div className={styles.thinking}>
                {isRecording && (
                  <div className={styles.thinkingIndicator}>
                    {name} is listening...
                  </div>
                )}
                {isThinking && (
                  <div className={styles.thinkingIndicator}>
                    {name} is thinking...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={onHandleKey}
            />
            <button
              className={styles.micButton}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <BsFillMicMuteFill
                  className={`${styles.sendIcon}`}
                  size={24}
                />
              ) : (
                <BsFillMicFill
                  className={`${styles.sendIcon}`}
                  size={24}
                />
              )}
            </button>
            <button className={styles.sendMessage} onClick={sendMessage}>
              <BsSend
                size={20}
                className={`${styles.sendIcon}`}
              />
            </button>
          </div>
        </div>
      </div>
      <Alert />
    </>
  );
}
