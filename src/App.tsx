import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import JoinChatRoom from './components/JoinChatRoom';
import CreateChatRoom from './components/CreateChatRoom';
import ChatRoom from './components/ChatRoom';
import { ChatProvider } from './context/ChatContext';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="join" element={<JoinChatRoom />} />
          <Route path="create" element={<CreateChatRoom />} />
          <Route path="room" element={<ChatRoom />} />
      </Routes>
    </ChatProvider>
  );
};

export default App;