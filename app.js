import 'dotenv/config';

import express from "express"

import db from "./database/connectionMongoDB.js";
import { ObjectId } from "mongodb";

const app = express()

app.use(express.json())
app.use(express.static('public'))


//MongoDB
import { connectDB } from "./database/connectionMongoDB.js"
await connectDB()

 
//limiter for login
import { rateLimit } from 'express-rate-limit'
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    limit: 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});
app.use('/auth', authLimiter)

//helmet
import helmet from 'helmet'
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"], // allow external images
      },
    },
  })
)

//session
import session from 'express-session';

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
});

app.use(sessionMiddleware);

//sockets (messages)
import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on("connection", async (socket) => {

    socket.on("joinGroup", (groupId) => {
      if (socket.currentGroup) {
        socket.leave(socket.currentGroup);
      }
      socket.join(groupId);

      socket.currentGroup = groupId;
    });

    socket.on("client-sends-message", async (data) => {
      //get current time and date
      const currentDate = new Date();
      const dateString = `${AddZero(currentDate.getDate())}-${AddZero(currentDate.getMonth() - 1)}-${currentDate.getFullYear()} ${AddZero(currentDate.getHours())}:${AddZero(currentDate.getMinutes())}`



      const message = db.groups.updateOne({_id: new ObjectId(data._id)}, { $push: {messages: {message: data.message, user: socket.request.session.userId, date: dateString}} })

      
      const user = await db.users.findOne({_id: new ObjectId(socket.request.session.userId)})
      io.to(data._id).emit("server-sends-message", {message: data.message, username: user.username, date:dateString});

    }); 
});

function AddZero(number){
  if(number < 10)
    return "0" + number
  else
    return number
}


//pages router
import pagesRouter from './routers/pagesRouter.js';

app.use(pagesRouter)

//api routers
import loginRouter from './routers/loginRouter.js';

app.use(loginRouter)

import groupRouter from './routers/groupRouter.js'

app.use(groupRouter)

// Setup on port
const PORT = 8080

server.listen(PORT, () => console.log("Server is running on port", PORT));