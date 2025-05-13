const express = require('express');
const app = express();

//import here
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { readdirSync } = require('fs');

const path = require('path');
const PORT = process.env.PORT || 5555;

//middleware
const corsOptions = {
    origin: ['http://localhost:5555', 'http://localhost:5173'], // เพิ่ม origin ที่ต้องการอนุญาต
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
let users = [];

//Auto load routes file
readdirSync('./routes').map((r) => {
    app.use('/api', require('./routes/' + r));
})

//socket io 

// 1. สร้าง `server` ด้วย `app` โดยใช้ `createServer` จาก `node:http`
const server = require('http').createServer(app);

// 2. สร้าง `io` โดยใช้ `Server` จาก `socket.io`
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5555', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});



// 3. กำหนดการทำงานของ `io` เมื่อมีการเชื่อมต่อกับระบบ
io.on('connection', (socket) => {
    console.log('a user connected');

    // เมื่อมี user เชื่อมต่อเข้ามา
    socket.on('user:join', (username) => {
        // เก็บ username ไว้ใน socket
        socket.username = username;
        // เพิ่ม user เข้าไปใน room
        socket.join('chat-room');
        // ส่งข้อมูล user ที่เชื่อมต่อทั้งหมดกลับไป
        io.to('chat-room').emit('chat:room', {
            users: Array.from(io.sockets.adapter.rooms.get('chat-room') || []).map(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                return {
                    id: socketId,
                    name: socket.username || 'Anonymous',
                    status: 'online'
                };
            })
        });
    });

    socket.on('chat:message', (message) => {
        console.log(message);
        io.emit('chat:message', message);
    });

    // เมื่อ user ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // ส่งข้อมูล user ที่เหลืออยู่กลับไป
        io.to('chat-room').emit('chat:room', {
            users: Array.from(io.sockets.adapter.rooms.get('chat-room') || []).map(socketId => {
                const socket = io.sockets.sockets.get(socketId);
                return {
                    id: socketId,
                    name: socket.username || 'Anonymous',
                    status: 'online'
                };
            })
        });
    });
});

//listen port เปลี่ยนจาก app เป็น server

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

