//jshint esversion:6

import express from 'express'
import bodyparser from 'body-parser'
import ejs from 'ejs'
import mongoose from 'mongoose';

import 'dotenv/config'
import md5 from 'md5';

const app = new express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/userDB");


const userSchema = new mongoose.Schema({
    email: String, 
    password: String
});




const User = new mongoose.model("User", userSchema);


// all the routes

app.get("/", (req, res)=>{
    res.render("home")
});

app.get("/login", (req, res)=>{
    res.render("login")
});

app.get("/register", (req, res)=>{
    res.render("register")
});

app.post("/register", (req, res)=>{
    const name = req.body.username;
    const password = md5(req.body.password);

    const newUser = new User({
        email: name,
        password: password
    })

    newUser.save();

    res.render("secrets");
});


app.post("/login", async (req, res)=>{
    const userName = req.body.username;
    const password = md5(req.body.password)
    ;

    const user = await User.findOne({email: userName});

    console.log(userName, password);

    if(user){
        if(user.password === password){
            res.render("secrets");
        }
    }
})





// Run the server
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`server start at port ${port}`);
    }
})