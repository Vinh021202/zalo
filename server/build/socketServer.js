"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("A user connected");
        // Lắng nghe sự kiện 'notification' từ client
        socket.on("notification", (data) => {
            console.log("Notification received:", data);
            // Gửi thông báo tới tất cả các client
            io.emit("newNotification", data);
        });
        // Xử lý sự kiện khi client ngắt kết nối
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
exports.initSocketServer = initSocketServer;
