import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TelepartyClient, SocketEventHandler, SocketMessageTypes } from 'teleparty-websocket-lib';

import { SessionChatMessage, TypingMessageData } from '../types/chatType';
import { useChat } from '../context/ChatContext';
import FileUpload from './FileUpload';

const CreateChatRoom: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreate = useCallback(async () => {
    // Validate inputs
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create event handler with message processing
      const eventHandler: SocketEventHandler = {
        onConnectionReady: async () => {
          console.log("Connection has been established");
          
          // Create chat room once connection is ready
          try {
            const newRoomId = await telepartyClient.createChatRoom(nickname, userIcon);
            setRoomId(newRoomId);
            
            // Navigate to the chat room
            navigate('/room');
          } catch (err) {
            console.error("Error creating room:", err);
            setError("Failed to create room. Please try again.");
            setIsCreating(false);
          }
        },
        onClose: () => {
          console.log("Socket has been closed");
          alert("Connection closed unexpectedly. Please reload the app.");
          setIsCreating(false);
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

    } catch (err) {
      console.error("Error initializing client:", err);
      setError("Failed to connect to the server. Please try again.");
      setIsCreating(false);
    }
  }, [nickname, userIcon, navigate, setClient, setRoomId, addMessage, setAnyoneTyping]);

  const handleFileChange=( fileUrl?: string | null)=>{
    if (fileUrl) {
      console.log("cloudinary url", fileUrl.split("/upload"));
      setUserIcon(fileUrl||'');
    }
  }

  return (
    <div className="create-chat-room">
      <h2>Create a Chat Room</h2>
      {error && <div className="error-message">{error}</div>}
      <input 
        type="text" 
        placeholder="Enter Nickname" 
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={isCreating}
      />
      <FileUpload 
        onFileChange={handleFileChange}
      />
      <div className="button-group">
        <button 
          onClick={handleCreate} 
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>
        <button 
          onClick={() => navigate('/')}
          disabled={isCreating}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CreateChatRoom;