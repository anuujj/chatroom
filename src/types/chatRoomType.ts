import { SessionChatMessage, TelepartyClient } from "teleparty-websocket-lib";

export interface ChatRoomProps {
    roomId: string;
    nickname: string;
    userIcon?: string;
    client: TelepartyClient;
    messages: SessionChatMessage[]; 
}