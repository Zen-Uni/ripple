/**
 * @description handle client socket
 */


// TODO: 添加好友

import { io } from "socket.io-client";
import store from "./store"
import { updateMessage, updateReqAction } from "./store/action";
const socket = io("http://localhost:8080");

const {dispatch} = store;

socket.on("connect", () => {
    console.log(socket.id);
})


socket.on("storeid", (data) => {
    console.log(data);
    console.log("from server")
})

socket.on("friend-request", data => {
    if (data === 1) {
        console.log('okkkkkk')
        const action  = updateReqAction();
        dispatch(action);
    }
});

socket.on('chat', data => {
    console.log('send from email', data.from);
    console.log('content --- ', data.content);

    const action = updateMessage(data);
    dispatch(action);
})

const fetchEmit = (event, data) => {
    socket.emit(event, data);
}


export default fetchEmit;