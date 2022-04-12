//Server Config
import cors from 'cors';
import express from "express";
import httpServer from "http";
import * as Socket from "socket.io";
//Routes
import {room, auth} from '../routes';
//Sockets
import SocketEvents from './sockets/socket';
import {ClientToServerEvents,SocketData,ServerToClientEvents, InterServerEvents} from './sockets/events';

class AplicationServer {
  private app: express.Application;
  private http: httpServer.Server;
  public io: Socket.Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>;
  private port: string = process.env.PORT || "8080";

  constructor() {
    this.app = express();
    this.http = httpServer.createServer(this.app);
    this.io = new Socket.Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>(
      this.http,
      {cors:{
        origin:['http://localhost:4200', 'https://chat-app-19d4a.firebaseapp.com']
      }}
      );
    this.middlewares();
    this.routes();
    this.sockets();
  }

  listen(): void {
    this.http.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  middlewares():void{
    this.app.use(cors({
      origin:['http://localhost:4200', 'https://chat-app-19d4a.firebaseapp.com'],
    
    }));
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes():void{
    this.app.use('/rooms',room);
    this.app.use('/auth',auth);
  }
  sockets(): void {
    SocketEvents(this.io);
  }

}

export default AplicationServer;
