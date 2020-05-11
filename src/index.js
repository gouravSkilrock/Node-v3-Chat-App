const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const { generateMessages } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const port = process.env.PORT|1000;
const server = http.createServer(app)

const io = socketio(server);

const publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection',(socket)=>{
    
    socket.on('join',({username, room},callback)=>{
    const {error, user} = addUser({id:socket.id,username,room});
    if(error){
        return callback(error);
    } 

    socket.join(user.room);

    socket.emit('message',generateMessages("Admin","Welcome"));
    socket.broadcast.to(user.room).emit('message',generateMessages("Admin",`${user.username} has joined!`));
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })    
    callback()

    })
    socket.on('sendText',(text,callback)=>{
        const user = getUser(socket.id);
        // const filter = new Filter(); 
        // if(filter.isProfane(message)){
        //     return callback('Profanity is not allowed!');
        // }
        io.to(user.room).emit('message',generateMessages(user.username,text)); 
        callback();     
    });  
    
    socket.on('send-location',(location)=>{
        const user = getUser(socket.id);
       // console.log(location);
        let url = `https://google.com/maps?q=${location.latitute},${location.longitude}`; 
        io.to(user.room).emit('renderLocation',generateMessages(user.username,url));      
    });
    
    socket.once('disconnect',()=>{
        const removeduser = removeUser(socket.id);
        if(removeduser){
            io.to(removeduser.room).emit('message',generateMessages("Admin",`${removeduser.username} has left!`));
            io.to(removeduser.room).emit('roomData',{
                room:removeduser.room,
                users:getUsersInRoom(removeduser.room)
            })
        }
    });
});

server.listen(port,()=>{
    console.log(`App stating at : ${port}`);
});
