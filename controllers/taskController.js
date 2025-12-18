const Task=require("../models/taskModel")

exports.createTask=async(req,res)=>{
    try{
        const task=await Task.create(req.body)//post
        res.status(201).json(task)
    }catch(error){
        res.status(400).json({msg:"Create Error"})
    }
}

//get task-get
exports.getTask=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1
        const limit=parseInt(req.query.limit)||5
        const skip=(page-1)*limit

        const tasks=await Task.find().skip(skip).limit(limit)

        const totalTasks=await Task.countDocuments()

        res.status(200).json({
            success:true,
            count:tasks.length,
            pagination: {
                totalTasks,
                totalPages: Math.ceil(totalTasks/limit),
                currentPage: page
            },
            data:tasks
        })

    }catch(error){
        res.status(404).json({msg:"Get Error"})
        console.log(error)
    }
}

//edit task-update
exports.updateTask=async(req,res)=>{
    try{
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task) return res.status(404).json({msg:"No Task"});
        res.status(200).json(task)
    }catch(error){
        res.status(400).json({msg:"Update Error"})
    }
}

exports.deleteTask=async(req,res)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).json({msg:"no task"});
        res.status(200).json({msg:"Delete Successfully"})
    }catch(error){
        res.status(400).json({msg:"Delete Error"})
    }
}