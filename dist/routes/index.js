require("dotenv").config({debug:process.env.DEBUG});const express=require("express"),router=express.Router(),passport=require("passport"),User=require("../models/user");router.get("/",(e,r)=>{r.render("landing")}),router.get("/register",(e,r)=>{r.render("users/register")}),router.post("/register",(e,r)=>{console.log("Starting user registration!"),User.register(new User({username:e.body.username,firstname:e.body.firstName,lastname:e.body.lastName,email:e.body.email,dateOfBirth:e.body.dateOfBirth}),e.body.password,s=>{if(s)return console.log("Error while registering new user",s),r.render("register",{error:s.message});console.log("User registered successfully!"),e.flash("success",`Welcome to Yelp Camp, ${e.body.username}! You are now registered successfully!`),passport.authenticate("local")(e,r,function(){console.log("User logged-in successfully!"),r.redirect("/campgrounds")})})}),router.get("/login",(e,r)=>{r.render("users/login")}),router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login",failureFlash:!0}),(e,r,s)=>{if(err)return err.shouldRedirect=!0,s(err)}),router.get("/logout",(e,r,s)=>{e.logout(),console.log("User logout success!"),e.flash("success","Logged out successfully!"),r.redirect("/campgrounds")}),module.exports=router;