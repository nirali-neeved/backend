const express=require("express")
const { createTask, getTask,deleteTask, updateTask } = require("../controllers/taskController")
const router=express.Router()

router.post("/",createTask)
router.get("/",getTask)
router.patch("/:id",updateTask)
router.delete("/:id",deleteTask)

module.exports=router