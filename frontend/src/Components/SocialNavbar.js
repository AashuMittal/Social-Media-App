import { useEffect, useState } from 'react';
import Avatar from "react-avatar";
import { AiFillHome } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { MdAddBox } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const SocialNavbar = ({ setSidebarOpen, isSidebarOpen }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = localStorage.getItem("user");
  const userid = localStorage.getItem("userid");
  const photoPath = localStorage.getItem("photo");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:9000/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setData(result.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    getUser();
  }, []);

  const filteredUsers = data.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.id !== userid
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex flex-col max-w-screen-xl mx-auto px-6 py-3 space-y-4">
        {/* TOP NAVBAR */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 w-28 h-12">
            <img
              src="/photo1.jpeg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6 relative">
            {/* Search Box with Dropdown */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Looking for someone..."
                className="px-3 py-2 border border-gray-300 rounded shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="absolute top-full left-0 mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-50">
                  {filteredUsers.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">
                      No matching users found.
                    </p>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                      >
                        {user.photo ? (
                          <img
                            src={`http://localhost:9000/${user.photo.replace(/\\/g, "/")}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold mr-3">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-gray-800">{user.name}</span>
                        <button className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          Join
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 text-gray-700 text-2xl">
              <Link to="/social" className="hover:text-blue-600 transition">
                <AiFillHome />
              </Link>
              <Link to="/addpost" className="hover:text-green-600 transition">
                <MdAddBox />
              </Link>
              <Link to="/chat" className="hover:text-purple-600 transition">
                <FaRegCommentDots />
              </Link>
            </div>

            {/* Avatar & Logout */}
            <div className="flex items-center space-x-2">
            < Link to='/editsocial'> {photoPath ? (
                <img
                  src={`http://localhost:9000/${photoPath.replace(/\\/g, "/")}`}
                  className="w-12 h-12 rounded-full object-cover"
                  alt="User"
                />
              ) : (
                <Avatar name={auth} size="40" round className="border border-gray-300 shadow" />
              )}
              </Link>
              <span className="text-gray-800 font-semibold text-md">{auth}</span>
              <Link
                onClick={logout}
                to="/login"
                className="ml-2 text-red-500 hover:text-red-700 font-semibold text-md transition"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SocialNavbar;
