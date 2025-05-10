import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !email) {
      toast.error("🦄 Invalid Data!");
      return;
    }

    const formData = new FormData();
  formData.append("name", name);
  formData.append("password", password);
  formData.append("email", email);
  if (selectedFile) {
    formData.append("file", selectedFile);
  }

    setTimeout(() => {
      navigate('/');
    }, 1500);

    try {
      const response = await fetch("http://localhost:9000/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.user);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("photo", result.photo);
      if (response.ok) {
        toast.success("🦄 Signup Successful!");
        setName("");
        setPassword("");
        setEmail("");
        setSelectedFile("")
        setPreviewUrl("")
      } else {
        toast.error(`🦄 ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("🦄 Something went wrong!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-indigo-200 to-blue-300 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-[1.02]">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Create Your Account
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Upload an image</label>
        <input
          type="file"
       
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-6">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg shadow-sm border"
          />
        </div>
      )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-500 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
