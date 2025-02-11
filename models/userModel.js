const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    
    goals:{
        required:true,
        type:Array
    },
    searchedfoods:{
        type:Object
    },
    changedImages:{
        type:Array,
        default:[]
    },
    payment_status:{
        type:String,
        default:'unpaid',
        required:true
    }
})

const users = mongoose.model('users',userSchema)

module.exports = users