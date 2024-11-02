const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require('dotenv').config();


const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:"http://localhost:5173",
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket)=>{
    console.log(`A user is connected with id: ${socket.id} `);

    socket.on("join-room", (data)=>{
        socket.join(data.room);
        console.log(`Name: ${data.username} and Room id: ${data.room}`)
    })
    
    socket.on("send-message", (data)=>{
        socket.to(data.room).emit("receive-message", data);        
    })

    socket.on("disconnect", ()=>{
        console.log("A user has disconnected.")
    })
})

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}...`);
})

app.get("/", (req, res) => {
    res.send("Server is up and running...");
});

