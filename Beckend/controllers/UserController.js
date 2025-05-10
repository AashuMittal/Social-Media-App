const User = require('../models/User');
const Post=require('../models/post')
const bcrypt = require('bcryptjs');
const Postlike=require('../models/postLike');
const Postcomment=require('../models/postcomment')
const { Sequelize, Op } = require('sequelize');
const path=require('path')
const tokenService = require('../Service/TokenService');
const { saveFile } = require('../Service/fileUploadService');
const sequalize = require('../sequalizeDb')
const Connection=require('../models/connection')
const chat=require('../models/chat');
const { get } = require('https');


exports.Register = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ where: { name, email } });
    if (user) {
      return res.status(500).json({ message: 'User already exists.' });
    }

    // Handle optional file upload
    const uploadedFile = req.files && req.files.file ? req.files.file : null;

    let relativePath = null;

    if (uploadedFile) {
      const directory = 'loginphoto';
      const uploadDir = path.join(__dirname, '..', directory);
      await saveFile(uploadedFile, uploadDir); // Save the file

      relativePath = path.join(directory, uploadedFile.name); // Store the relative path
    }

    // Create user with or without photo
    const newUser = await User.create({
      name,
      password: hashedPassword,
      email,
      photo: relativePath, // can be null
    });

    const token = tokenService.createToken(newUser.dataValues);

    if (token) {
      return res.send({
        message: "Successfully Registered",
        token,
        user: newUser.name,
        userId: newUser.id,
        photo: newUser.photo,
      });
    } else {
      return res.status(500).send("No token generated");
    }
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
  
  
  exports.Login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    const token=tokenService.createToken(user.dataValues);
    if (user) {
      // You can also add a token or user data here if needed
      return res.status(200).json({ message: "Successfully Login", token,user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  };
  

  exports.Editprofile = async (req, res) => {
    const { id, name, password, email } = req.body;
  
    try {
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const hashpass = await bcrypt.hash(password, 10);
      const uploadedFile = req.files && req.files.file ? req.files.file : null;

      let relativePath = null;
      if (uploadedFile) {
        const directory = 'loginphoto';
        const uploadDir = path.join(__dirname, '..', directory);
        await saveFile(uploadedFile, uploadDir); // Save the file
  
        relativePath = path.join(directory, uploadedFile.name); // Store the relative path
      }
      await User.update(
        {
          name,
          email,
          password: hashpass,
          photo:relativePath,
        },
        {
          where: { id },
        }
      );
  
      const updatedUser = await User.findOne({ where: { id } });
      const token=tokenService.createToken(user.dataValues);
      return res.status(200).send({
        message: "Successfully updated",
        token,
        user:updatedUser,
        name: updatedUser.name,
  userId: updatedUser.id,
  photo:updatedUser.photo,
      });
  
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Error");
    }
  };

  exports.Getuser = async (req, res) => {
   
  
    try {
      const users = await User.findAll();
  
      return res.status(200).send({
        message: "Successfully fetched users",
        users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send("Error fetching users");
    }
  };

  exports.Socialpost=async(req,res)=>{
    const {userid,text}=req.body;
    const uploadedFile = req.files && req.files.file ? req.files.file : null;

    let relativePath = null;
 
    const directory = 'uploads';
    const uploadDir = path.join(__dirname, '..', directory);
    const filePath = await saveFile(uploadedFile, uploadDir);
 relativePath = path.join(directory,uploadedFile.name);
    const socialpost=await Post.create({userid,text,photo:relativePath});
if(socialpost){
  return res.status(200).send({message:"Successfully post",socialpost})
}
else{
  return res.status(500).send("error");
}
  }

  exports.Getpost=async(req,res)=>{
    const getpost=await Post.findAll();
    if(getpost){
      return res.status(200).send({message:"Successfully get post",getpost})
    }
    else{
      return res.status(500).send("error");
    }

  }

  exports.PostLike=async(req,res)=>{
    const {userid,postid,like}=req.body;
    const postlike=await Postlike.create({userid,postid,like});
    if(postlike){
      return res.status(200).send({message:"Successfully post like",postlike})
    }
    else{
      return res.status(500).send("error");
    }
  }


  exports.Postcomment=async(req,res)=>{
    const {userid,postid,comment}=req.body;
    const postcomment=await Postcomment.create({userid,postid,comment});
    if(postcomment){
      return res.status(200).send({message:"Successfully post like",postcomment});
    }
    else{
      return res.status(500).send("error");
    }
  }

  exports.Getcomment = async (req, res) => {
    try {
      const [comment] = await sequalize.query(`
        SELECT u.name, u.email, c.postid, c.comment
        FROM authentications AS u
        JOIN postcomments AS c 
        ON u.id = c.userid
      `);
  
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ success: false, error: "Failed to fetch comments" });
    }
  };
  
  exports.Getlike=async(req,res)=>{
    const getlike=await Postlike.findAll();
    if(getlike){
      return res.status(200).send({message:"Successfully getlike",getlike})
    }
    else{
      return res.status(500).send("error");
    }
  }




  exports.Connection = async (req, res) => {
    const { user1id, user2id } = req.body;
    const connection = await Connection.findOne({
      where: {
        [Sequelize.Op.or]: [
          { user1id: user1id, user2id: user2id },
          { user1id: user2id, user2id: user1id }
        ]
      }
    });
  
    if (connection) {
      return res.status(200).json({ message: "Connection already exists", connection });
    }
    const newconnection = await Connection.create({ user1id, user2id });
  
    if (newconnection) {
      return res.status(200).send({ message: "Connection successfully created", newconnection });
    } else {
      res.status(500).send("Error creating connection");
    }
  };
  

exports.Chat = async (req, res) => {
    const {senderid, recieverid, Messagetype, Message, connectionid } = req.body;
    try {
        const newChat = await chat.create({ senderid, recieverid, Messagetype, Message, connectionid });
        return res.status(200).send({ message: 'Chat saved', newChat });
    } catch (error) {
        return res.status(500).send({ message: 'Error saving chat', error});
    }
};

exports.Getconnection=async(req,res)=>{
  const userId = req.user.id;
  
  try {
    const results = await sequalize.query(`
      SELECT 
  c.id AS connectionid,
  u.id AS userid,
  u.name,
  u.email
FROM 
  connectionchats AS c
JOIN 
  authentications AS u
  ON (c.user1id = u.id OR c.user2id = u.id)
WHERE 
  (c.user1id = :userId OR c.user2id =:userId)
  AND u.id != :userId;
    `, {
      replacements: { userId },
      type: sequalize.QueryTypes.SELECT,
    });

    return res.status(200).send({message:"Suucessfully get",results})
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching connections',
      error: error.message,
    });
  }
}

exports.Getchat=async(req,res)=>{
  const connecid=req.params.id;

  const getchat=await chat.findAll({where:{connectionid:connecid}})
   
  if(getchat){
   
    return res.status(200).send({message:"Successfully get",getchat})
  }
  else{
    return res.status(500).send("error");
  }
}
