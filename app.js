//Main app file
import express from "express";
import loadDB from "./loadDb.js"; //middleware for load DB (sets request.db)
import mathService from "./services/basicMath.js";
import authenticate from "./authenticate.js"; //middleware for authentication
import permit from "./authorization.js"; //middleware for checking if user's role is permitted to make request

const app = express(),
    api = express.Router();

// First middleware will setup db connection
app.use(loadDB);

//Start molecular service
app.use(mathService)

//authenticate each request 
//will set 'request.user'
app.use(authenticate);

//setup permission middleware 
//check 'request.user.role' and decide if ok to continue
app.use("api/private",permit("admin"));
app.use(["api/staff","api/account"],permit("owner","employee"));

//setup request handlers 
//Add logic
api.get("/private/managestaff",(req,res)=>res.json({managed:true}))
api.get("/staff",(req,res)=>res.json({currentUser:req.user}));
api.get("/public",(req,res)=>res.json({currentUser:req.user}));

//setup permissions based on HTTP Method

//account creation is public
api.post("api/account",(req,res)=>res.json({message:"created"}));

//Health of server

api.post("/health",(req,res)=>res.json({message:"Server awake"}));


//account update & delete (PATCH & DELETE) are only available to account owner
api.patch("/account",permit('owner'),(req,res)=>res.json({message:"updated"}));
api.delete("/account", permit('owner'), (req, res) => res.json({message: "deleted"}));

//viewing account "GET" available to account owner and account member
api.get("/account", permit('owner', 'employee'),(req, res) => res.json({currentUser: req.user}));

//mount api to router and server
app.listen(process.env.PORT || 3000);


