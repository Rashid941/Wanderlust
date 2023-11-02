const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const listings =require("./routes/listing.js");
const reviews =require("./routes/review.js");
const session = require('express-session')
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.set(methodOverride("_method"));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")));
// app.use(cookieParser)

const sessionOption = {
    secret : "mysecrectcode",
    resave : false,
    saveUninitialized :true,
    cookie : {
        expires : Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    },
};

app.get("/",(req,res)=>{
    res.send("Route is working properly")
})

app.use(session(sessionOption));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/review", reviews)

let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(()=>console.log("Connected to DB"))
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
};

app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode= 500 , message="Something went Wrong"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message})
})

app.listen(8080,()=>{
    console.log("Server is working at port : 8080");
})

















// app.get("/testing",async (req,res)=>{
//     let newListing = new Listing({
//         title:"GOA",
//         description:"This is a very beautiful beach",
//         price:15000,
//         location:"Goa",
//         country:"India"
//     });
//     await newListing.save();
//     console.log("Data Saved");
//     res.send("Data Saved");
// })
