//Server Config
import path from 'path';
import cors from 'cors';
import cookierparser from 'cookie-parser';
import session from 'express-session';
import express,{Application,Request,Response} from "express";
import httpServer from "http";
//Database
import { sequelize } from '../db';
//Routes
import { admin,auth, marketplace } from '../routes';

class AplicationServer {
  private app: Application;
  private http: httpServer.Server;
  private port: string = process.env.PORT || "8080";

  constructor() {
    this.app = express();
    this.http = httpServer.createServer(this.app);
    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB():Promise<void>{
    try {
      await sequelize.authenticate();
      console.log('database connected');
    } catch (error) {
      console.error(error)
    }
  }

  listen(): void {
    this.http.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  middlewares():void{
    this.app.use(cors({
      origin:['http://localhost:4200','http://localhost:8080',],
      credentials:true
    }));
    this.app.use(cookierparser());
    this.app.use(session({
      secret:'test',
      resave:false,
      saveUninitialized:false
    }))
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use('/uploads', express.static('uploads'));
  }

  routes():void{
    this.app.use('/api/admin',admin.default);
    this.app.use('/api/auth',auth.default);
    this.app.use('/api/marketplace',marketplace.default);
    //Angular Routes
    this.app.get('*',(req:Request,res:Response) => {
      res.sendFile(path.resolve(__dirname,'../public/index.html'))
  })
  }
}

export default AplicationServer;
