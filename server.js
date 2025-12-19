const express=require("express")
const dotenv=require("dotenv")
const connectDB = require("./config/db")
const taskRoutes=require("./routes/taskRoutes")

dotenv.config()
const app=express()
app.use(express.json())

const startServer=async()=>{
    try{
        await connectDB()
        app.use("/api/tasks",taskRoutes)
        
        app.listen(process.env.PORT,()=>{
            console.log(`Server running on port ${process.env.PORT}`)
        })
    }catch(error){
        console.error("Failed start");
    }
}
startServer()

// app.get("/",(req,res)=>{
//     res.send("Server running at browser")
// })