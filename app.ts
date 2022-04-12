//GET .env variables
import dotenv from 'dotenv';
//Server app
import Server from './server/server';

dotenv.config();

const server = new Server();
//add listener to HTTP server
server.listen();