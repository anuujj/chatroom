import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TelepartyClient, SocketEventHandler, SocketMessageTypes } from 'teleparty-websocket-lib';
import { useChat } from '../context/ChatContext';
import { SessionChatMessage, TypingMessageData } from '../types/chatType';
import FileUpload from './FileUpload';


const JoinChatRoom: React.FC = () => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { 
    setClient, 
    setRoomId, 
    nickname, 
    setNickname, 
    userIcon, 
    setUserIcon,
    addMessage,
    setAnyoneTyping
  } = useChat();

  const handleJoin = useCallback(async () => {
    // Validate inputs
    if (!inputRoomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Create event handler with message processing
      const eventHandler: SocketEventHandler = {
        onConnectionReady: async () => {
          console.log("Connection has been established");
          
          // Join chat room once connection is ready
          try {
            await telepartyClient.joinChatRoom(nickname, inputRoomId, userIcon);
            setRoomId(inputRoomId);
            
            // Navigate to the chat room
            navigate('/room');
          } catch (err) {
            console.error("Error joining room:", err);
            setError("Failed to join room. Please check the Room ID and try again.");
            setIsJoining(false);
          }
        },
        onClose: () => {
          console.log("Socket has been closed");
          alert("Connection closed unexpectedly. Please reload the app.");
          setIsJoining(false);
        },
        onMessage: (message) => {
          console.log("Received message:", message);
          
          if (message.type === SocketMessageTypes.SEND_MESSAGE) {
            const chatMessage = message.data as SessionChatMessage;
            addMessage(chatMessage);
          } 
          
          // Handle typing presence
          if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
            const typingData = message.data as TypingMessageData;
            setAnyoneTyping(typingData.anyoneTyping);
          }
        }
      };

      // Create Teleparty client
      const telepartyClient = new TelepartyClient(eventHandler);
      setClient(telepartyClient);
      
      // Note: We don't need to wait here as the onConnectionReady callback will handle room joining
    } catch (err) {
      console.error("Error initializing client:", err);
      setError("Failed to connect to the server. Please try again.");
      setIsJoining(false);
    }
  }, [inputRoomId, nickname, userIcon, navigate, setClient, setRoomId, addMessage, setAnyoneTyping]);

  const handleFileChange=( fileUrl?: string | null)=>{
    if (fileUrl) {
      console.log("cloudinary url", fileUrl.split("/upload"));
      setUserIcon(fileUrl||'');
    }
  }

  return (
    <div className="join-chat-room">
      <h2>Join a Chat Room</h2>
      {error && <div className="error-message">{error}</div>}
      <input 
        type="text" 
        placeholder="Enter Room ID" 
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
        disabled={isJoining}
      />
      <input 
        type="text" 
        placeholder="Enter Nickname" 
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={isJoining}
      />
       <FileUpload 
        onFileChange={handleFileChange}
      />
      <div className="button-group">
        <button 
          onClick={handleJoin} 
          disabled={isJoining}
        >
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>
        <button 
          onClick={() => navigate('/')}
          disabled={isJoining}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default JoinChatRoom;