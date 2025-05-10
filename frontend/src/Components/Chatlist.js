import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chatlist = ({ onSelectChat }) => {
const [chat, setchats] = useState([]);

useEffect(() => {
    const getconnection=async()=>{
          try {
              const response = await fetch("http://localhost:9000/getconnection", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
        
              const result = await response.json();
              console.log('aas',result.results);
              
            setchats(result.results)
            } catch (error) {
              console.error("Error submitting form:", error);
              toast.error("🦄 Something went wrong!");
            }
    }

    getconnection();
 
}, [])

    
  return (
    <div className="w-1/3 border-r bg-white overflow-y-auto">
      <div className="p-4 text-xl font-bold border-b">Chats</div>
      <ul>
        {chat.map((e,index) => (
          <li
            key={index}
            onClick={() => onSelectChat(e)}
            className="flex items-center gap-3 p-4 bg-neutral-800 text-slate-300 cursor-pointer border-b"
          >
            <img src={chat.avatar} alt={e.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-semibold">{e.name}</p>
            
              </div>
              <p className="text-sm text-gray-600 ">{e.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chatlist;
