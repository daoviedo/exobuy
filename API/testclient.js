const io = require('socket.io-client');

let socket = io.connect('http://localhost:4000',{query: ""});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6NTMsImlhdCI6MTU4MTEwMjg5OSwiZXhwIjoxNTgxMTAyOTI5fQ.QvVk8PC5DKVkDftjdMcNbi7WwiBtQKmwCypRHGvJ6Fk";

socket.on("connect", () => {
    socket.emit('authenticate', {token: token});
})

socket.on("welcome", (data) => {
    console.log(data)
})

socket.on("cartStatus", (data) => {
    console.log(data)
})
socket.on("status", (data) => {
    console.log(data)
})

socket.on("msg", (data) => {
    console.log(data)
})

/* 
{
        items: [
         {id:101, itemname: "test", price: 40, quantity: 2},
        {id: 102, itemname: "test2", price: 50, quantity: 5}]
    }

*/
