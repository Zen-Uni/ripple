/**
 * @description handle socket
 */

const { Server } = require("socket.io");
const http = require("http");
const app = require('./app');
const {handleStoreSocket} = require('./controller/message')



const server = http.createServer(app.callback());


const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});
  

io.on("connection", socket => {
    console.log(socket.id);

   socket.on("friend-request", sid => {
       socket.to(sid).emit("friend-request", 1)
   })

    socket.on("storeid", async email => {
        console.log(email)
        const res = await handleStoreSocket(email, socket.id);
        socket.emit("storeid", res);
    })

    socket.on("message", data => console.log(data))

// console.log(socket);
});

// emitter.emit("friend-add-request", "hll")


module.exports = server