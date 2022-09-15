const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const http = require('http');
const server = http.createServer(app);
const {v4 : uuidV4} = require('uuid');
const formatMessage= require('./models/message')
const {userLeave,roomUsers,findUser,opponentOf,users} = require('./models/user')

const botName = 'XO BOT'
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    },
  });

  app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

const PORT = process.env.PORT || 3000

server.listen(PORT);

app.get('/room', (req,res)=> {
    res.send({uuid : uuidV4()})
})
app.get('/:room', (req,res) => {
    res.render('room',{roomId : req.params.room})
})

const symbols = ['X','O']

io.on("connection", socket => {
    socket.on("join-room", (roomId, username) => {
        if(!username)  socket.emit('error', {error:'no_username'})
        let capacity  =  io.sockets.adapter.rooms.get(roomId)?.size
        if (capacity===undefined || capacity ===null) {
            socket.join(roomId)
            //send a message to the room we're currently in
            io.to(roomId).emit('user-connected', username)
            const user = {id : socket.id, username : username , roomId: roomId, symbol : '', score : 0}
            users.push(user)
        
        }
        if (capacity==1) {
            socket.join(roomId)
            //send a message to the room we're currently in
            io.to(roomId).emit('user-connected', username)
            const user = {id : socket.id, username : username , roomId: roomId, symbol : '', score : 0}
            users.push(user)
            //start the game
            //get room users
            const players = roomUsers(roomId)
            players.forEach((player,index) => {
                io.to(player.id).emit('start-game', {
                    
                    symbol : symbols[index]
                })
                findUser(player.id).symbol=symbols[index]
            })
            

        }
        else if(capacity>=2) {
            //once the room is full, new user can't join
            io.to(socket.id).emit('error',{error:'fullRoom'})
            //TODO : redirect user to home page
        }


        
        
    })

    socket.on('chatMessage', (message, roomId) => {
        const user = findUser(socket.id)
        io.to(roomId).emit('message', formatMessage(user.username,message))
    })
   
    socket.on('getRoomMembers', roomId => {
            roomUsers(roomId)
    })

    // Event for when any player makes a move
    socket.on("make-move", function(data) {
        if (!opponentOf(socket.id)) {

            // This shouldn't be possible since if a player doens't have an opponent the game board is disabled
            return;
        }

        // Validation of the moves can be done here

        io.to(socket.id).emit("move-made", data); // Emit for the player who made the move
        io.to(opponentOf(socket.id).id).emit("move-made", data); // Emit for the opponent
        });

       


    socket.on("disconnect", ()=> {

        const user = userLeave(socket.id)
        //find useroom and emit to it
        if(user) {
            io.to(user.roomId).emit('message', formatMessage(botName,`${user.username} has left the chat` ))

        }
    })
})

    



