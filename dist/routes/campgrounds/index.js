const{campgroundService:campgroundService}=require("../../services/index"),express=require("express"),router=express.Router();function escapeRegex(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}router.get("/",async(e,r,n)=>{try{let a=null;if(e.query.search){const n=new RegExp(escapeRegex(e.query.search),"gi"),o=await Campground.find({$or:[{name:n},{location:n},{"author.username":n}]});return o.length<1?(a="No matching locations, campground names or users found. Try again!",r.render("campgrounds/index",{campgrounds:o,noMatch:a})):r.render("campgrounds/index",{campgrounds:o,noMatch:a})}{const e=await campgroundService.getAll();return r.render("campgrounds/index",{campgrounds:e,noMatch:a})}}catch(e){return e.shouldRedirect=!0,n(e)}}),module.exports=router;