import { useState } from "react";
import ChatList from "./Chatlist";
import ChatWindow from "./Chatwindow";

const SocialChat= () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList onSelectChat={setSelectedChat} />
      <ChatWindow chat={selectedChat} />
    </div>
  );
};

export default SocialChat;
