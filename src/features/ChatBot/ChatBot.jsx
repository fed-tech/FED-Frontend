import { useRef, useState, useEffect } from 'react';
import styles from './styles/ChatBot.module.scss';
import { BsSend } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { GiFox } from 'react-icons/gi';

export default function ChatBot() {
  const name = "Fedrick";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialMsg, setInitialMsg] = useState(`Hello! I am ${name}, your personal assistant. Ask any queries related to FED?`);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEventOngoing, setIsEventOngoing] = useState(true);
  const chatboxRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { user: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    setTimeout(() => {
      setIsTyping(true);
    }, 600);

    setTimeout(async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { bot: data.response }]);
      } catch (error) {
        setMessages(prevMessages => [...prevMessages, { bot: 'Error: Unable to connect to the server.' }]);
        console.error('Error:', error);
      }
      setIsTyping(false);
      scrollToBottom();
    }, 1500);
  };

  const onHandleKey = (e) => {
    if (e.key === 'Enter') {
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

  const botToggle = isActive ? styles.hidden : '';
  const chatBotOpen = isActive ? '' : styles.hidden;

  return (
    <>
      <button className={`${styles.chatbottoggle} ${botToggle}`} onClick={handleClick}>
        <span><GiFox /></span>
      </button>

      <div className={`${styles.popup} ${isVisible ? styles.fadeIn : ''}`}>
        <div className={`${styles.chatcontainer} ${chatBotOpen}`}>
          <header>
            <div className={styles.logo}>
              <img src="https://uploads-ssl.webflow.com/629d87f593841156e4e0d9a4/62eeaa9927e6aea4ff13590e_FedLogo.png" alt="logo" />
              <h2 className={styles.fed}>{name}</h2>
            </div>
            <span className={`${styles.close} ${styles.chatBotClose}`} onClick={handleClick}><IoCloseOutline /></span>
          </header>
          <hr />
          <div className={styles.chatbox} ref={chatboxRef}>
            <div className={styles.messageBox}>
              <div className={styles.botmessage}>{initialMsg}</div>
              {messages.map((message, index) => (
                <div key={index} className={message.user ? styles.usermessage : styles.botmessage}>
                  {message.user || message.bot}
                </div>
              ))}
              <div className={styles.typing}>
              {isTyping && <div className={styles.typingIndicator}>{name} is typing...</div>}
              </div>
            </div>
            
          </div>

          <div className={styles.inputArea}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={onHandleKey}
              />
              <button className={styles.sendMessage} onClick={sendMessage}><BsSend className={styles.sendIcon} /></button>
            </div>

            
        </div>
      </div>
    </>
  );
}
