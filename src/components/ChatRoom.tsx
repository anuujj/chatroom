import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/chat-styles.css';
import { useChat } from '../context/ChatContext';
import { SendMessageData } from '../types/chatType';
import { SocketMessageTypes } from 'teleparty-websocket-lib';

const ChatRoom: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    client, 
    roomId, 
    nickname, 
    userIcon, 
    messages, 
    anyoneTyping
  } = useChat();

  // Redirect to home if not in a room or client not ready (when the connnection is lost and user refreshes)
  useEffect(() => {
    if (!client || !roomId) {
      navigate('/');
    }
  }, [client, roomId, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const sendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;
    if(!client) {
      alert("connection lost! please reload the page"); 
      return;
    };

    const messageData: SendMessageData = {
      body: currentMessage
    };

    try {
      client.sendMessage(SocketMessageTypes.SEND_MESSAGE, messageData);
      setCurrentMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [client, currentMessage]);

  // Typing presence handler
  const handleTypingPresence = useCallback((typing: boolean) => {
    if (client) {
      client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE,{ typing });
    }
  }, [client]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    handleTypingPresence(e.target.value.length > 0);
  }

  if (!client || !roomId) {
    return <div className="loading">Connecting to chat room...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Chat Room: {roomId}</h2>
        <p>Welcome, {nickname}</p>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isSystemMessage ? 'system-message' : 'user-message'}`}
          >
            {msg.userIcon && <img src={`https://res.cloudinary.com/dtqq94h3t/image/upload/${msg.userIcon}`} alt="User Icon" className="user-icon" height={"16px"} width={"16px"} style={{backgroundSize: "contain"}}/>}
            <div className="message-content">
              <span className="nickname">{msg.userNickname}</span>
              <p>{msg.body}</p>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {anyoneTyping && <div className="typing-indicator">Someone is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input">
        {userIcon? <img src={`https://res.cloudinary.com/dtqq94h3t/image/upload/${userIcon}`} className='user-icon' alt={"icon"}/>: <div className='user-icon'>{`${nickname.slice(0,4)}${nickname.length>4?'...':''}`}</div>}
        <input 
          type="text"
          value={currentMessage}
          onChange={handleTyping}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
              handleTypingPresence(false);
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={() => {
          sendMessage();
          handleTypingPresence(false);
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;