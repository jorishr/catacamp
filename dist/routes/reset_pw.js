require("dotenv").config({debug:process.env.DEBUG});const express=require("express"),router=express.Router(),User=require("../models/user"),async=require("async"),crypto=require("crypto"),mailgun=require("mailgun-js"),mailgunDomain=process.env.MAILGUN_DOMAIN,mailgunApiKey=process.env.MAILGUN_APIKEY,mg=mailgun({apiKey:mailgunApiKey,domain:mailgunDomain});router.get("/forgot",(e,r)=>{r.render("users/forgot")}),router.post("/forgot",(e,r,s)=>{async.waterfall([e=>{crypto.randomBytes(20,(r,s)=>{let o=s.toString("hex");e(r,o)})},(s,o)=>{User.findOne({email:e.body.email},(a,t)=>{a||!t?(console.log("Error: User not found or unexpected error.",a),e.flash("error","No matching user data found. Try again with different email."),r.redirect("/forgot")):(t.resetPasswordToken=s,t.resetPasswordExpires=Date.now()+36e5,t.save(e=>{o(e,s,t)}))})},(r,s,o)=>{let a={to:s.email,from:"CataCamp <catacamp@catacamp.com>",subject:"CataCamp Password Reset",text:`Hello CataCamp user,\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account.\n \nPlease click on the following link, or paste this into your browser to complete the process:\n \n\thttp://${e.headers.host}/reset/${r}\n\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`};mg.messages().send(a,function(r,a){r&&console.log(r),console.log("\nMailgun:\n",a),e.flash("success",`An email has been sent to ${s.email} with further instructions.`),o(r,"All Done")})}],e=>{if(e)return s(e);r.redirect("/forgot")})}),router.get("/reset/:token",(e,r)=>{User.findOne({resetPasswordToken:e.params.token,resetPasswordExpires:{$gt:Date.now()}},(s,o)=>{if(s||!o)return console.log("Unexpected error",s),e.flash("error","Your password reset token is invalid or has expired."),r.redirect("/forgot");r.render("users/reset",{token:e.params.token})})}),router.post("/reset/:token",(e,r)=>{async.waterfall([s=>{User.findOne({resetPasswordToken:e.params.token,resetPasswordExpires:{$gt:Date.now()}},(o,a)=>o||!a?(console.log("\nUnexpected error:\n",o),e.flash("error","Password reset token is invalid or has expired."),r.redirect("back")):e.body.password!==e.body.confirm?(e.flash("error","Passwords do not match."),r.redirect("back")):void a.setPassword(e.body.password,r=>{a.resetPasswordToken=void 0,a.resetPasswordExpires=void 0,a.save(r=>{e.logIn(a,e=>{s(e,a)})}),console.log("\nPassword changed successfully!\n")}))},(r,s)=>{let o={to:r.email,from:"CataCamp <catacamp@catacamp.com>",subject:"Your CataCamp Password has changed",text:`Hello CataCamp user,\nThis is a confirmation that the password for your account ${r.email} has been changed.\n`};mg.messages().send(o,function(r,o){r&&console.log(r),console.log("\nMailgun:\n",o),e.flash("success","Your password has been changed successfully!"),s(r,"All Done")})}],e=>{r.redirect("/campgrounds")})}),module.exports=router;