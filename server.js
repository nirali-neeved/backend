const express=require("express")
const dotenv=require("dotenv")
const connectDB = require("./config/db")
const taskRoutes=require("./routes/taskRoutes")

dotenv.config()
connectDB()

const app=express()

app.use(express.json())
app.use("/api/tasks",taskRoutes)

// app.get("/",(req,res)=>{
//     res.send("Server running at browser")
// })

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})