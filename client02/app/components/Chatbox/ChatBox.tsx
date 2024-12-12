import React, { FC, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Thêm thư viện Google Generative AI
import { Style } from "../../style/styleChatBox"; // Import styles từ styleChatBox.ts
import AvatarAdmin from "../../../public/asstes/avatar1.jpg";
import Image from "next/image";

interface ChatBoxProps {
  onClose: () => void;
  userData: any; // Thêm prop userData để nhận dữ liệu người dùng
}

const ChatBox: FC<ChatBoxProps> = ({ onClose, userData }) => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  // Khởi tạo Google Generative AI với API Key
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBmAKlYVOP6STcoWy8MH-YIS8hnfeoHr1c";  // Đảm bảo bạn đã cấu hình API Key trong file .env
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // Khi component được mount, chào mừng người dùng hoặc bot nếu không có người dùng
  useEffect(() => {
    if (userData && userData.user) {
      setMessages([{
        user: "bot",
        text: `Chào bạn, ${userData.user.name}! Tôi có thể giúp gì cho bạn hôm nay?`
      }]);
    } else {
      setMessages([{
        user: "bot",
        text: "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?"
      }]);
    }
  }, [userData]);

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { user: "user", text: input };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput("");

      // Khởi tạo phiên chat, đảm bảo tin nhắn đầu tiên là của người dùng
      const chatSession = model.startChat({
        generationConfig,
        history: updatedMessages.map((msg, index) => ({
          role: index === 0 ? "user" : msg.user === "user" ? "user" : "model", // Thay "bot" thành "model"
          parts: [{ text: msg.text }],
        })),
      });

      try {
        const result = await chatSession.sendMessage(input);
        const botReply = result.response.text();
        setMessages((prev) => [
          ...prev,
          { user: "bot", text: botReply }, // Vẫn dùng "bot" trong giao diện để hiển thị
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { user: "bot", text: "Đã có lỗi xảy ra." },
        ]);
      }
    }
  };

  return (
    <div className={Style.chatBoxContainer}>
      <div className={Style.chatBoxHeader}>
        <Image
          src={AvatarAdmin}
          width={30}
          height={30}
          alt=""
          className="rounded-full"
        />
        <span>Chat với quản trị viên</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ✖
        </button>
      </div>
      <div className={`${Style.chatBoxMessages} scrollbar`}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${Style.chatBoxMessage} ${msg.user === "user" ? Style.userMessage : Style.botMessage}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className={Style.chatBoxFooter}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={Style.chatBoxInput}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} className={Style.chatBoxButton}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
