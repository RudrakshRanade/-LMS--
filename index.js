const express = require('express');
const app = express();
const router = require("./routes/index");
const dbConnect=require("./config/database");

require('dotenv').config();
const database = require("./config/database");
database.dbConnect();


const PORT = process.env.port || 4000 ;
const coookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(coookieParser());  


app.use("/api/v1" , router );

app.listen(PORT , async ()=> {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/", (req, res) => {
    return res.json({
        success: true, 
        message: "Your server is running...",
    })
})