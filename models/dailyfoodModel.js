const mongoose = require('mongoose')

const dailyFoodSchema = new mongoose.Schema({
    userId:{
        required:true,
        type:String
    },
    breakfast:{
        type:Array,
        default:[]
    },
    lunch:{
        type:Array,
        default:[]
    },
    dinner:{
        type:Array,
        default:[]
    },
    snacks:{
        type:Array,
        default:[] 
    },
    date:{
        type:String,
        required:true
    }
})

const dailyfoods = mongoose.model('dailyfoods',dailyFoodSchema)

module.exports = dailyfoods