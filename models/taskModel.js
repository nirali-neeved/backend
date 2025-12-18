const mongoose=require("mongoose")

const taskSchema=new mongoose.Schema({
    title:{type:String,require:true},
    description:{type:String,require:true},
    completed:{type:Boolean,default:false}
    },{timestamps:true}
)

module.exports=mongoose.model("Task",taskSchema)