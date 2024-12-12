export const Style = {
    chatBoxContainer: "fixed bottom-5 right-5 bg-white border rounded-lg shadow-lg w-[300px] md:w-[400px] h-[450px] z-50 flex flex-col",
    chatBoxHeader: "bg-[#2190ff] text-white flex justify-between items-center p-4 rounded-t-lg shadow-md",
    chatBoxMessages: "overflow-y-auto h-[350px] p-3 flex flex-col space-y-2", // Thêm space-y-2 để tạo khoảng cách giữa các tin nhắn
    chatBoxMessage: "p-3 rounded-lg max-w-[80%] break-words flex items-start mb-2", // Thêm margin-bottom để tạo khoảng cách giữa các tin nhắn
    chatBoxFooter: "flex justify-between items-center p-3",
    chatBoxInput: "w-full p-2 border rounded-lg bg-[#444444] text-white placeholder-gray-500 md-1",
    chatBoxButton: "ml-3 bg-[#2190ff] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1b7ed1] transition-colors duration-200",
  
    // Avatar
    avatar: "w-[30px] h-[30px] rounded-full mr-2 justify-end", // Avatar người dùng hoặc bot
  
    // Tin nhắn của người dùng và bot
    userMessage: "bg-[#d0f0fd] self-end text-black rounded-lg flex items-center", // Người dùng, căn phải
    botMessage: "bg-[#e0e0e0] self-start text-black rounded-lg flex items-center", // Bot, căn trái
  };
  