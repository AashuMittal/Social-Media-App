import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar';

const Home = () => {
  const [data, setData] = useState([]);
   const [showpost, setshowpost] = useState([]);
    const [showcomment,setshowcomment]=useState([])
    const [showlike,setshowlike]=useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();





  useEffect(() => {

    const getuser = async () => {
      try {
        const response = await fetch("http://localhost:9000/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

          },

        });
        const result = await response.json();
        console.log(result.users);
        setData(result.users);

        if (response.ok) {
          toast.success("🦄 Get Successful!");
        } else {
          toast.error(`🦄 ${result.error}`);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("🦄 Something went wrong!");
      }
    };

    getuser();
  }, []);

  const userId = localStorage.getItem("userId");
  const handleclick = (e) => {
    if (e.id === userId) {
      navigate('/social')
    }
    else {
      navigate('/login');
    }
    
  }
useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch("http://localhost:9000/getpost", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        const postsWithState = result.getpost.map(post => ({
          ...post,
          liked: false,
          likes: 0,
          comments: [],
        }));
        setshowpost(postsWithState);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    getPosts();
  }, []);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch("http://localhost:9000/getcomment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resultComments = await response.json();
    
       
        setshowcomment(resultComments.data)
       
      }
         catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
  
   getComments();
  }, [])

  useEffect(() => {
    const getlikes = async () => {
      try {
        const response = await fetch("http://localhost:9000/getlike", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resultComments = await response.json();
       console.log(resultComments)
        setshowlike(resultComments.getlike)
       
      }
         catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
  
   getlikes();
  }, [])


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out h-full ${isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
      >
        {isSidebarOpen && (
          <>
            <div className="text-2xl font-bold mb-6">Social Media</div>
            <ul className="space-y-4">
              <button>
                <SidebarItem iconPath="M10 2a1 1 0 011 1v6h6a1 1 0..." label="Dashboard" />
              </button>
              <Link to="/edit">
                <button>
                  <SidebarItem iconPath="M10 2a1 1 0 011 1v6h6a1 1 0..." label="Edit Profile" />
                </button>
              </Link>
            </ul>
          </>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-all duration-300">
        <Navbar setSidebarOpen={setSidebarOpen} isSidebarOpen={isSidebarOpen} />

        <div className="p-5">
          <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Dashboard</h1>

          {/* Stat Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            <button className="border border-blue-600 text-white bg-blue-600 p-6 rounded-lg shadow-lg flex flex-col items-center h-40">
              <span className="text-xl font-bold">{data.length}</span>
              <span className="text-lg">Total Users</span>
            </button>
            <button className="border border-green-600 text-white bg-green-600 p-6 rounded-lg shadow-lg flex flex-col items-center h-40">
              <span className="text-xl font-bold">{showpost.length}</span>
              <span className="text-lg">Total Post</span>
            </button>
            <button className="border border-yellow-600 text-white bg-yellow-600 p-6 rounded-lg shadow-lg flex flex-col items-center h-40">
              <span className="text-xl font-bold">{showcomment.length}</span>
              <span className="text-lg">Total Comments</span>
            </button>
            <button className="border border-red-600 text-white bg-red-600 p-6 rounded-lg shadow-lg flex flex-col items-center h-40">
              <span className="text-xl font-bold">{showlike.length}</span>
              <span className="text-lg">Total Likes</span>
            </button>
          </div>

          {/* Full Width Table */}
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full min-w-full text-sm text-left text-white bg-gray-800 border border-gray-600">
              <thead className="uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-3 border border-gray-600">ID</th>
                  <th className="px-6 py-3 border border-gray-600">PROFILEPIC</th>
                  <th className="px-6 py-3 border border-gray-600">Name</th>
                  <th className="px-6 py-3 border border-gray-600">Email</th>
                  <th className="px-6 py-3 border border-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 border border-gray-600">{e.id}</td>
                    <td className="px-6 py-4 border border-gray-600">    <img
                      src={e.photo ? `http://localhost:9000/${e.photo.replace(/\\/g, "/")}` : ""}
                     
                      className="w-13 h-12 rounded-full object-cover"
               alt={e.name}
                    /></td>
                    <td className="px-6 py-4 border border-gray-600">{e.name}</td>
                    <td className="px-6 py-4 border border-gray-600">{e.email}</td>
                    <td className="px-6 py-4 border border-gray-600">
                      <button className='border bg-red-700 rounded-lg p-3 text-base' onClick={() => handleclick(e)}>Verify now</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar item component
const SidebarItem = ({ iconPath, label }) => (
  <li>
    <button type="button" className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded w-full text-left">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d={iconPath} />
      </svg>
      <span>{label}</span>
    </button>
  </li>
);


export default Home;
