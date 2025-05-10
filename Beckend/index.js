const express = require('express');
const app = express();
const auth =require('./middle/auth')
const UserController = require('./controllers/UserController');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const User = require('./models/User');

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
app.use('/loginphoto', express.static('loginphoto'));

app.get('/', (req, res) => {
    res.send("App is working");
});

app.post('/register', UserController.Register);
app.post('/login', UserController.Login);
app.put('/editprofile',UserController.Editprofile);
app.get('/getuser',UserController.Getuser);
app.post('/socialpost',UserController.Socialpost)
app.get('/getpost',UserController.Getpost)
app.post('/postlike',UserController.PostLike)
app.post('/postcomment',UserController.Postcomment)
app.get('/getcomment',UserController.Getcomment);
app.get('/getlike',UserController.Getlike);
app.post('/connection',UserController.Connection);
app.post('/chat',UserController.Chat)
app.get('/getconnection',auth,UserController.Getconnection);
app.get('/getchat/:id',UserController.Getchat);



app.listen(9000, () => {
    console.log('Server is running ');
});
