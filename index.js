const io = require("socket.io")(8900,{
    cors: {
        origin: "http://127.0.0.1:5173",
    }
});

let users = [];
let userNames = [];

const addUser = (userId,socketId)=>{
    !users.some((user)=>{user.userId === userId}) &&
    users.push({userId,socketId});
}
const removeUser = (socketId)=>{
    users = users.filter(user=>{user.socketId !== socketId})
}

const getUser = (userId)=>{
    // console.log(userId)
    return users.find(user=> user.userId === userId)
}

// const addUserName = (username,socketId)=>{
//     !userNames.some((user)=>{user.username === username}) &&
//     userNames.push({username,socketId});
// }
// const removeUserName = (socketId)=>{
//     userNames = userNames.filter(user=>{user.socketId !== socketId})
// }

// const getUserName = (username)=>{
//     // console.log(userId)
//     return userNames.find(user=> user.username === username)
// }


io.on("connection", (socket) => {
    // on connection
    console.log("A user Connected!")
    // io.emit("welcome","hello this is socket sever!")
    
    // take userId and socketId from user 
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);
    });

    // socket.on("addUserName",username=>{
    //     addUserName(username,socket.id);
    //     // console.log(userNames)
    // });

    // send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        // console.log(text)
        const user = getUser(receiverId);
        // console.log(user)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text,
        })
    })

    // notification
    // socket.on("sendNotification",({senderName,receiverName,type})=>{
    //     const receiver = getUserName(receiverName)
    //     // console.log("notification is coming")
    //     io.to(receiver?.socketId).emit("getNotification",{
    //         senderName,
    //         type,
    //     });
    // });

    // on disconnection
    socket.on("disconnect",()=>{
        console.log("A user disconnected!");
        removeUser(socket.id);
        // removeUserName(socket.id)
        io.emit("getUsers",users);

    })
});