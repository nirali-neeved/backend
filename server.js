const express=require("express")
const app=express()
const dotenv=require("dotenv")

dotenv.config()

app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Server running at browser")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})