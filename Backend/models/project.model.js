import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:[true,"project name already taken!"],
        lowercase:true,
        trim:true,
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    fileTree:{
        type:Object,
        default:{}
    }
})
const Project = mongoose.model('project',projectSchema)

export default Project
