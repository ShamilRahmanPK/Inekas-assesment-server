require('dotenv').config();
const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.CONNECTION_STRING

mongoose.connect(CONNECTION_STRING).then((res)=>{
    console.log("MongoDB ATLAS connected succesfully with inekas");
    
}).catch(err=>{
    console.log("Connextion failed");
    console.log(err);
})