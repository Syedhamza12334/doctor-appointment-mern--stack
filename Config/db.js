const mongoose = require("mongoose")
const colors=require("colors")
 
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`database connected ${mongoose.connection.host}`.bgGreen.white)
    }
    catch(error){
        console.log(`mongodb serveer issue ${error}`.bgRed.white)
    }
}

module.exports=connectDB;