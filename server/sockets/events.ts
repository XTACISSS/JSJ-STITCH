import { Message,Room } from "../../models/room";
import { User } from '../../models/user';


export interface ServerToClientEvents {
  newMessage: ( message: Message) => Message;
  userJoined: (user:User) => void;
  userLeft: ( user: User) => void;
}
export interface ClientToServerEvents {
  searchRoom: (name:string,response:Room) => void;
  createRoom: (name:string,response:Room) => void;
  joinRoom: ( user:any,name: string,response:Room) => void;
  leaveRoom: ( user:any,name: string) => void;
  newRoom : (room:Room) => Room;
  newMessage: (message: Message) => void;
  newWhisper :(message: Message) => Message[];
}

export interface InterServerEvents{
  ping: () => void
}

export interface SocketData {
  payload:any;
}
