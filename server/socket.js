/**
 * @description handle socket
 */

const { Server } = require("socket.io");
const http = require("http");
const app = require('./app');
const {handleStoreSocket} = require('./controller/message');
const { SocketModel, MessageModel } = require("./db");



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


    socket.on("chat", async data => {
        const { email, femail, content } = data;
        const arr = [];
        arr.push(email); arr.push(femail);
        arr.sort();
        const to = arr[0] + arr[1];
        const res = await SocketModel.findOne({
            email: femail
        }).exec();
        const message = new MessageModel({
            from: email,
            to,
            content
        });
        await message.save();
        if (res) {
            const { sid } = res;
            socket.to(sid).emit('chat', {
                from: email,
                content
            });
        }
    })

// console.log(socket);
});

// emitter.emit("friend-add-request", "hll")


module.exports = server