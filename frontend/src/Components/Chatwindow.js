import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const getChat = async () => {
      if (!chat || !chat.connectionid) return;

      try {
        const response = await fetch(`http://localhost:9000/getchat/${chat.connectionid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        console.log(result.getchat.Message);
        
        if (response.ok && Array.isArray(result.getchat)) {
          setMessages(result.getchat);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        toast.error("🦄 Something went wrong!");
      }
    };

   getChat();
  
   const Intervalid=setInterval(getChat,2000);

   return ()=> clearInterval(Intervalid)
  }, [chat]);

 



  const handleSend = async () => {
    const userid = localStorage.getItem("userId");
    if (!input.trim()) return;

    const newMessage = {
      senderid: userid,
      recieverid: chat.userid,
      Messagetype: "text",
      Message: input,
      connectionid: chat.connectionid,
    };

    try {
      const response = await fetch("http://localhost:9000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("🦄 Something went wrong!");
    }
  };

  if (!chat) {
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-neutral-800 text-slate-300">
        <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
        <h2 className="text-lg font-semibold">{chat.name}</h2>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-2 bg-gray-50 overflow-y-auto flex-1 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-fit px-4 py-2 border-2 rounded-full shadow-sm text-sm font-medium ${
              msg.senderid === localStorage.getItem("userId")
                ? "bg-sky-600 border-blue-500 text-white self-end ml-auto"
                : "bg-green-700 border-green-600 text-white self-start mr-auto"
            }`}
          >
            {msg.Message}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
