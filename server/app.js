const express = require('express');
const app = express();
const connectDB=require('./db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const UserModel = require("./models/UserModel");
const TokenModel=require('./models/TokenModel');
connectDB();
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.urlencoded({extended:true}));
app.use(express.json());

function generateTokens(email,name)
{
    const accessToken = jwt.sign({name:name,email:email},process.env.ACCESS_SECRET_KEY,{expiresIn:'340s'});
    const refreshToken = jwt.sign({name:name,email:email},process.env.REFRESH_SECRET_KEY);
    return [accessToken,refreshToken];
}
app.post('/signup',async (req,res,next)=>
{
    const {email,password,name} = req.body;
    if(!email || !password || !name){return res.status(401).send("Please Provide all the Credentials needed");return;}
    const hashed_password = bcrypt.hashSync(password,10);
    await UserModel.create({name:name,password:hashed_password,email:email});
    const [accessToken,refreshToken] = await generateTokens(email,name);
    await TokenModel.create({refreshToken:refreshToken});
    return res.status(200).json({sucess:true,accessToken:accessToken,refreshToken:refreshToken,message:"User Successfully Stored"});
});

app.post('/login',async (req,res,next)=>
{
    const {email,password,name} = req.body;
    const query = await UserModel.findOne({name:name,email:email});
    if(!query){return res.status(401).send("User not found in the db");return;}
    else if(!query.password){return res.status(401).send("Please Provide a password");}
    if(bcrypt.compareSync(password,query.password))
    {
         const [accessToken,refreshToken] = generateTokens(email,name);
         await TokenModel.create({refreshToken:refreshToken});
         return res.status(200).json({success:true,accessToken:accessToken,refreshToken:refreshToken,message:"User Successfully logged in"});
    }
    else
    {
        return res.status(401).send("Password Incorrect");
    }
});

app.get('/checkToken',async (req,res,next)=>
{
    console.log(req.headers);
    const accessToken =  req.headers['authorization'];
    console.log(accessToken);
    jwt.verify(accessToken,process.env.ACCESS_SECRET_KEY,(err,user)=>
    {
        if(err)
        {
            return res.status(401).send(err.message);
        }
        else
        {
            return res.status(200).json({success:true,email:user.email,name:user.name,message:"Token Identified"});
        }
    })
});

app.get('/logout',async (req,res,next)=>
{
     const refreshToken = req.headers['authorization'];
     await TokenModel.deleteOne({refreshToken:refreshToken});
     return res.status(200).send("User token successfully deleted");
});

app.get('/retry',async (req,res,next)=>
{
    const refreshToken = req.headers['authorization'];
    if(await TokenModel.findOne({refreshToken:refreshToken}))
    {
        jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY,(err,user)=>
        {
            if(err)
            {
                return res.status(401).send("Invalid refresh token");
            }
            else
            {
                const accessToken = jwt.sign({name:user.name,email:user.email},process.env.ACCESS_SECRET_KEY,{expiresIn:'340s'});
                return res.status(200).json({sucess:true,accessToken:accessToken,message:"New Access token generated"});
            }
        })
    }
    
});

app.listen(5000,()=>
{
    console.log("Server listening at Port : 5000");
})