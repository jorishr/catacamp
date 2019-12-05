const mongoose=require("mongoose"),Comment=require("./comments");let campgroundSchema=new mongoose.Schema({name:String,image:String,description:String,price:String,location:String,lat:Number,lng:Number,createdAt:{type:Date,default:Date.now},author:{id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},username:String},comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}]});campgroundSchema.pre("remove",async function(e){console.log("\nStarting pre-hook\n");try{await Comment.remove({_id:{$in:this.comments}}),e()}catch(o){e(o)}});let Campground=mongoose.model("Campground",campgroundSchema);module.exports=Campground;