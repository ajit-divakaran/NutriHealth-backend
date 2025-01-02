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
    Breakfast:{
        type:Array
    },
    Lunch:{
        type:Array
    },
    Dinner:{
        type:Array
    },
    Snacks:{
        type:Array
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
    }
})

const users = mongoose.model('users',userSchema)

module.exports = users