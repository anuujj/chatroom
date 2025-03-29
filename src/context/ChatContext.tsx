import { createContext, useState, useContext, ReactNode } from 'react';
import { TelepartyClient } from 'teleparty-websocket-lib';
import { SessionChatMessage } from '../types/chatType';

interface ChatContextType {
  client: TelepartyClient | null;
  setClient: (client: TelepartyClient | null) => void;
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  nickname: string;
  setNickname: (name: string) => void;
  userIcon: string;
  setUserIcon: (icon: string) => void;
  messages: SessionChatMessage[];
  addMessage: (message: SessionChatMessage) => void;
  anyoneTyping: boolean;
  setAnyoneTyping: (isTyping: boolean) => void;
}

const defaultContext: ChatContextType = {
  client: null,
  setClient: () => {},
  roomId: null,
  setRoomId: () => {},
  nickname: "",
  setNickname: () => {},
  userIcon: "",
  setUserIcon: () => {},
  messages: [],
  addMessage: () => {},
  anyoneTyping: false,
  setAnyoneTyping: () => {}
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [userIcon, setUserIcon] = useState<string>("");
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [anyoneTyping, setAnyoneTyping] = useState<boolean>(false);

  const addMessage = (message: SessionChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ChatContext.Provider
      value={{
        client,
        setClient,
        roomId,
        setRoomId,
        nickname,
        setNickname,
        userIcon,
        setUserIcon,
        messages,
        addMessage,
        anyoneTyping,
        setAnyoneTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};