import { useEffect, useState } from 'react';
import { FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocialNavbar from './SocialNavbar';

const Social = () => {
  const [data, setData] = useState([]);
  const [showPost, setShowPost] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComment, setShowComment] = useState({});

  const photoPath = localStorage.getItem("photo");
  const name = localStorage.getItem("user");
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch("http://localhost:9000/getpost");
        const result = await response.json();
        const postsWithState = result.getpost.map(post => ({
          ...post,
          liked: false,
          likes: 0,
          comments: [],
        }));
        setShowPost(postsWithState);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:9000/getuser");
        const result = await response.json();
        setData(result.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch("http://localhost:9000/getcomment");
        const resultComments = await response.json();
        const grouped = resultComments.data.reduce((acc, comment) => {
          if (!acc[comment.postid]) acc[comment.postid] = [];
          acc[comment.postid].push(comment);
          return acc;
        }, {});
        setShowComment(grouped);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    getComments();
  }, []);

  const toggleLike = async (postId) => {
    const userId = localStorage.getItem("userId");
    let updatedLikeValue = 1;

    const updatedPosts = showPost.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        const newLikes = newLiked ? post.likes + 1 : post.likes - 1;
        updatedLikeValue = newLiked ? 1 : 0;
        return { ...post, liked: newLiked, likes: newLikes };
      }
      return post;
    });

    setShowPost(updatedPosts);

    const formData = new FormData();
    formData.append("userid", userId);
    formData.append("postid", postId);
    formData.append("like", updatedLikeValue.toString());

    try {
      const response = await fetch("http://localhost:9000/postlike", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("👍 Post liked successfully!");
      } else {
        toast.error(`🚫 ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting like:", error);
      toast.error("🚫 Something went wrong!");
    }
  };

  const handleCommentToggle = (postId) => {
    setActiveCommentPostId(prev => (prev === postId ? null : postId));
    setCommentText("");
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    const userId = localStorage.getItem("userId");
    const commentPayload = {
      postid: postId,
      userid: userId,
      comment: commentText,
    };

    try {
      const response = await fetch("http://localhost:9000/postcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("💬 Comment added!");
        const updated = { ...showComment };
        if (!updated[postId]) updated[postId] = [];
        updated[postId].push({ name, comment: commentText });
        setShowComment(updated);
        setCommentText("");
      } else {
        toast.error(`🚫 ${result.error}`);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("🚫 Failed to post comment!");
    }
  };


  const handleclick=async(user)=>{
    const user1id=localStorage.getItem("userId");
    const userdata={user1id,user2id:user};
      try {
          const response = await fetch("http://localhost:9000/connection", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(userdata),
          });
    
          const result = await response.json();
          return result;
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("🦄 Something went wrong!");
        }


  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <SocialNavbar />
      <div className="flex flex-col md:flex-row max-w-4xl mx-auto px-4 py-6 gap-6">
        <div className="md:w-2/3 space-y-6">
          {showPost.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            showPost.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={`http://localhost:9000/${item.photo.replace(/\\/g, "/")}`}
                  alt="post"
                  className="max-w-fit max-h-lvh object-cover"
                />
                <div className="p-4">
                  <p className="text-gray-800 text-lg">{item.text}</p>
                  <div className="flex items-center space-x-6 mt-4 text-gray-600 text-xl">
                    <button
                      className={`flex items-center space-x-2 hover:text-red-500 transition ${
                        item.liked ? 'text-red-500' : ''
                      }`}
                      onClick={() => toggleLike(item.id)}
                    >
                      <FaHeart />
                      <span className="text-base">{item.likes} Like</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 hover:text-blue-500 transition"
                      onClick={() => handleCommentToggle(item.id)}
                    >
                      <FaRegCommentDots />
                      <span className="text-base">
                        {(showComment[item.id]?.length || 0)} Comment
                      </span>
                    </button>
                  </div>

                  {activeCommentPostId === item.id && (
                    <>
                      {showComment[item.id]?.map((comment, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded-lg p-3 my-2 flex items-start space-x-4 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-lg">
                            {comment.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 font-semibold">
                              {comment.name}
                            </p>
                            <p className="mt-1 text-gray-700">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full border rounded-lg p-2"
                          placeholder="Write a comment..."
                        />
                        <button
                          onClick={() => handleCommentSubmit(item.id)}
                          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Post Comment
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <img
              src={photoPath ? `http://localhost:9000/${photoPath.replace(/\\/g, "/")}` : ""}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4"
            />
            <span className="text-lg font-semibold">{name}</span>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4 text-center text-blue-600">
              You can Join Them
            </h3>
            {data.length === 0 ? (
              <p className="text-gray-500 text-center">No users available.</p>
            ) : (
              data.map((user, index) =>
               Number(user.id) !== Number(userid) && (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    {user.photo ? (
                      <img
                        src={`http://localhost:9000/${user.photo.replace(/\\/g, "/")}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-800 font-medium">{user.name}</span>
                    <button className="ml-auto bg-sky-500 px-3 py-1 rounded text-white text-sm" onClick={()=>handleclick(user.id)}>
                      Join Now
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
