import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server);

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
