import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebarOpen, isSidebarOpen }) => {
  const auth = localStorage.getItem("user");
  const photoPath = localStorage.getItem("photo");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between max-w-screen-xl ml-8 p-4">
        {/* Button to toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)} // Toggle the sidebar state
          className="text-gray-800 dark:text-white mx-5 text-2xl"
        >
          &#9776;
        </button>

        {/* Left - Logo or Title */}
        <div className="w-12 h-10">
          {/* Image from the public folder */}
          <img src="/photo.jpeg" alt="Logo" className="w-full h-full object-cover" />
        </div>

        {/* Right - Auth Links */}
        <div className="ml-auto flex items-center space-x-6">

        {auth && (
            <img
            src={photoPath ? `http://localhost:9000/${photoPath.replace(/\\/g, "/")}` : ""}
            
              className="w-12 h-12 rounded-full object-cover"
           
            />
          )}
        
          {auth ? (
            <button
              onClick={logout}
              className="text-gray-900 dark:text-white hover:underline font-semibold"
            >
              {auth} <span className="ml-3 text-sm">Logout</span>
            </button>
          ) : (
            <Link to="/login" className="text-gray-900 dark:text-white hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
