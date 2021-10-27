/**
 * @description handle client socket
 */


// TODO: 添加好友

import { io } from "socket.io-client";

const socket = io("http://localhost:8080");


socket.on("connect", () => {
    console.log(socket.id);
})


socket.on("storeid", (data) => {
    console.log(data);
    console.log("from server")
})


const fetchEmit = (event, data) => {
    socket.emit(event, data);
}


export default fetchEmit;