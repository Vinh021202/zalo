import {app} from './app';
import connectDb from './utils/db'
import http from "http";
require("dotenv").config();
import {v2 as cloudinary} from "cloudinary"
import { initSocketServer } from './socketServer';

// Tạo HTTP server
const server = http.createServer(app);

// cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY
});

//socketio
initSocketServer(server);

// create server 
app.listen(process.env.PORT,()=>{
    connectDb();
})

