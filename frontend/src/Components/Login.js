import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [data, setData] = useState([]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

   useEffect(()=>{
 const fetchApi = async () => {
    try {
      const res = await fetch("http://localhost:9000/login");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchApi()
  })

  console.log(data);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !email) {
      toast.error("🦄 Invalid Data!");
      return;
    }

    const userdata = { password, email };

    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userdata),
      });

      const result = await response.json();
     
      
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.user.name);
      localStorage.setItem("userId", result.user.id);

      setPassword("");
      setEmail("");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("🦄 Something went wrong!");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-center text-3xl font-bold text-white mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/Signup" className="text-white underline hover:text-indigo-200 transition duration-200">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
