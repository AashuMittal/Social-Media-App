import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocialEditProfile = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const photoPath = localStorage.getItem("photo");

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
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:9000/editprofile", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", result.user);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("photo", result.photo);
        toast.success("🦄 Profile Updated!");
        setName("");
        setPassword("");
        setEmail("");
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(`🦄 ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("🦄 Something went wrong!");
    }
  };

  return (
    <section className="py-10 dark:bg-gray-900">
      <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex flex-col gap-6">
        {/* Cover Image & Profile Image */}
        <div className="relative bg-cover bg-center h-56 rounded-lg shadow-lg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')`,
          }}>
          <div className="absolute bottom-[-3.5rem] left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
          <img
            src={photoPath ? `http://localhost:9000/${photoPath.replace(/\\/g, "/")}` : ""}
            
              className=" rounded-full object-cover"
           
            />
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300">Upload Profile Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 mx-auto object-cover rounded-full shadow-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full p-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SocialEditProfile;
