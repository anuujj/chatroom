import { TelepartyClient } from 'teleparty-websocket-lib';

export interface SendMessageData {
  body: string;
}

export interface SessionChatMessage {
  isSystemMessage: boolean;
  userIcon?: string;
  userNickname?: string;
  body: string;
  permId: string;
  timestamp: number;
}

export interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}

export interface ChatRoomProps {
  roomId: string;
  nickname: string;
  userIcon?: string;
  client: TelepartyClient;
}