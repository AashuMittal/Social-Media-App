import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import EditProfile from "./Components/EditProfile";
import Home from "./Components/Home";
import Login from "./Components/Login";
import PrivateComponent from "./Components/PrivateComponent";
import Signup from "./Components/Signup";
import Social from "./Components/Social";
import SocialEditProfile from "./Components/SocialEditProfile";
import SocialPost from "./Components/SocialPost";
import SocialChat from "./Components/SocialChat";
function App() {
  return (
    <div className="App">
     
    
      <Router>
    
      <Routes>

        <Route element={<PrivateComponent/>}/>
        <Route path="/" element={<Home/>} />
        <Route path="/social" element={<Social/>} />
        <Route path="/chat" element={<SocialChat/>} />
        <Route path="/edit" element={<EditProfile/>} />
        <Route path="/addpost" element={<SocialPost/>} />
        <Route path="/editsocial" element={<SocialEditProfile/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
    
    </div>
  );
}


export default App;
