const mongoose=require("mongoose")

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connect successfully");   
    }
    catch(error){
        console.log("DB not connected ");
        console.error(error.message)
        process.exit(1)
    }
}

module.exports=connectDB