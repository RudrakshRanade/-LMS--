const mongoose = require("mongoose");

require("dotenv").config();

module.exports.dbConnect = () =>{

mongoose.connect( process.env.mongourl , {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // connectTimeoutMS: 10000,
} )

.then( console.log("DB connected successfully") )

.catch((error)=>{ console.log("Error in connecting to DB")
                  console.log(error)
                  process.exit(1) })

}


// const dbConnect=async()=>{
//     await mongoose.connect('mongodb://127.0.0.1/LMN');
// }

// module.exports = dbConnect;