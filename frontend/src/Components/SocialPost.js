import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocialPost = () => {
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async() => {
    const userid=localStorage.getItem("userId")
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("text", postText);
    formData.append("file", selectedFile);
    try {
         const response = await fetch("http://localhost:9000/socialpost", {
           method: "POST",
         
           body: formData,
         });
   
         const result = await response.json();
   
         if (response.ok) {
           toast.success("🦄 Signup Successful!");
         setPostText("");
         setSelectedFile("");
         setPreviewUrl("");
         } else {
           toast.error(`🦄 ${result.error}`);
         }
       } catch (error) {
         console.error("Error submitting form:", error);
         toast.error("🦄 Something went wrong!");
       }
     
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">📸 Create a Post</h1>
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

      
<input
        placeholder="What's on your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="5"
      />


      <button
        onClick={handlePost}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
      >
        Post Now
      </button>
    </div>
  );
};

export default SocialPost;
